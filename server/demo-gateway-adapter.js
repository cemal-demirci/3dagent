"use strict";

const http = require("http");
const { randomUUID } = require("crypto");
const { execSync, spawn } = require("child_process");
const { WebSocketServer } = require("ws");

const ADAPTER_PORT = parseInt(process.env.DEMO_ADAPTER_PORT || "18789", 10);
const MAIN_KEY = "main";

// ---------------------------------------------------------------------------
// AI Provider clients — initialized lazily when keys arrive from the UI
// ---------------------------------------------------------------------------
let anthropicClient = null;
let geminiClient = null;
let openaiClient = null;

/** Keys stored in memory (set via ai.keys.set from UI) */
const aiKeys = { anthropic: "", gemini: "", openai: "" };

// ---------------------------------------------------------------------------
// CLI / Agent SDK availability detection (cached)
// ---------------------------------------------------------------------------
let claudeAgentSDKAvailable = null;
let claudeAgentQuery = null; // Lazy-loaded ESM import
let geminiCLIAvailable = null;

async function loadClaudeAgentSDK() {
  if (claudeAgentSDKAvailable !== null) return claudeAgentSDKAvailable;
  try {
    const mod = await import("@anthropic-ai/claude-agent-sdk");
    claudeAgentQuery = mod.query;
    claudeAgentSDKAvailable = true;
    console.log("[demo-gateway] Claude Agent SDK yüklendi (OAuth — API key gerekmez).");
  } catch {
    claudeAgentSDKAvailable = false;
  }
  return claudeAgentSDKAvailable;
}

function isClaudeAgentSDKAvailable() {
  return claudeAgentSDKAvailable === true;
}

function isGeminiCLIAvailable() {
  if (geminiCLIAvailable !== null) return geminiCLIAvailable;
  try {
    execSync("npx @google/gemini-cli --version", { stdio: "pipe", timeout: 10000 });
    geminiCLIAvailable = true;
  } catch { geminiCLIAvailable = false; }
  return geminiCLIAvailable;
}

function initAnthropicClient(apiKey) {
  try {
    const Anthropic = require("@anthropic-ai/sdk");
    anthropicClient = new Anthropic({ apiKey });
    console.log("[demo-gateway] Anthropic client initialized.");
  } catch (err) {
    console.error("[demo-gateway] Anthropic SDK error:", err.message);
    anthropicClient = null;
  }
}

function initGeminiClient(apiKey) {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    geminiClient = new GoogleGenerativeAI(apiKey);
    console.log("[demo-gateway] Gemini client initialized.");
  } catch (err) {
    console.error("[demo-gateway] Gemini SDK error:", err.message);
    geminiClient = null;
  }
}

function initOpenAIClient(apiKey) {
  try {
    const OpenAI = require("openai");
    openaiClient = new OpenAI({ apiKey });
    console.log("[demo-gateway] OpenAI client initialized.");
  } catch (err) {
    console.error("[demo-gateway] OpenAI SDK error:", err.message);
    openaiClient = null;
  }
}

// ---------------------------------------------------------------------------
// Default provider/model — all agents use this unless overridden at runtime
// ---------------------------------------------------------------------------
const DEFAULT_PROVIDER = "anthropic";
const DEFAULT_MODEL = "claude-sonnet-4-20250514";

// ---------------------------------------------------------------------------
// Agent definitions
// ---------------------------------------------------------------------------
const agents = new Map([
  ["erlik-devops", {
    id: "erlik-devops",
    name: "Erlik",
    role: "DevOps & Infrastructure",
    workspace: "/demo/devops",
    provider: DEFAULT_PROVIDER,
    model: DEFAULT_MODEL,
  }],
  ["kayra-iot", {
    id: "kayra-iot",
    name: "Kayra",
    role: "IoT & Embedded",
    workspace: "/demo/iot",
    provider: DEFAULT_PROVIDER,
    model: DEFAULT_MODEL,
  }],
  ["ulgen-backend", {
    id: "ulgen-backend",
    name: "Ülgen",
    role: "Backend",
    workspace: "/demo/backend",
    provider: DEFAULT_PROVIDER,
    model: DEFAULT_MODEL,
  }],
  ["umay-frontend", {
    id: "umay-frontend",
    name: "Umay",
    role: "Frontend & Mobile",
    workspace: "/demo/frontend",
    provider: DEFAULT_PROVIDER,
    model: DEFAULT_MODEL,
  }],
  ["asena-video", {
    id: "asena-video",
    name: "Asena",
    role: "Video & Streaming",
    workspace: "/demo/video",
    provider: DEFAULT_PROVIDER,
    model: DEFAULT_MODEL,
  }],
  ["tengri-ai", {
    id: "tengri-ai",
    name: "Tengri",
    role: "AI & Automation",
    workspace: "/demo/ai",
    provider: DEFAULT_PROVIDER,
    model: DEFAULT_MODEL,
  }],
]);

// ---------------------------------------------------------------------------
// Turkish system prompts per role
// ---------------------------------------------------------------------------
const AGENT_SYSTEM_PROMPTS = {
  "DevOps & Infrastructure": `Sen Erlik adında bir DevOps ve altyapı uzmanısın. Türk mitolojisinde yeraltı dünyasının hükümdarısın — altyapının derinliklerini yönetirsin. Docker, Jenkins, Linux server yönetimi, CI/CD pipeline'lar, Nginx, network konfigürasyonu ve deployment konularında uzmansın. Türkçe yanıt ver. Kısa ve teknik ol.`,
  "IoT & Embedded": `Sen Kayra adında bir IoT ve gömülü sistem uzmanısın. Türk mitolojisinde ilk yaratıcı güçsün — donanıma hayat verirsin. ESP32, PlatformIO, SHT31/ADS1115/TSL2591 sensörler, aktüatörler, MQTT protokolü ve firmware geliştirme konularında uzmansın. Türkçe yanıt ver. Kısa ve teknik ol.`,
  "Backend": `Sen Ülgen adında bir backend geliştiricisisin. Türk mitolojisinde yaratıcı gök tanrısısın — sistemlerin mimarisini kurarsın. Node.js, Express, PostgreSQL, MQTT broker, WebSocket, REST API tasarımı ve veritabanı yönetimi konularında uzmansın. Türkçe yanıt ver. Kısa ve teknik ol.`,
  "Frontend & Mobile": `Sen Umay adında bir frontend ve mobil geliştiricisisin. Türk mitolojisinde bereket ve güzellik tanrıçasısın — arayüzlere estetik katarsın. React, Next.js, Tailwind CSS, React Native, Expo ve responsive tasarım konularında uzmansın. Türkçe yanıt ver. Kısa ve teknik ol.`,
  "Video & Streaming": `Sen Asena adında bir video ve streaming uzmanısın. Türk mitolojisinde efsanevi dişi kurtsun — hız ve akış senin doğan. FFmpeg, HLS/RTMP transcoding, WebRTC, CDN routing, video analytics ve canlı yayın altyapısı konularında uzmansın. Türkçe yanıt ver. Kısa ve teknik ol.`,
  "AI & Automation": `Sen Tengri adında bir AI ve otomasyon uzmanısın. Türk mitolojisinde Gök Tanrı'sın — yapay zekanın en yüce gücüsün. n8n workflow, LLM API entegrasyonu (Gemini, Claude, GPT), Telegram bot, web scraping ve otomasyon zincirleri konularında uzmansın. Türkçe yanıt ver. Kısa ve teknik ol.`,
};

// ---------------------------------------------------------------------------
// Shared state
// ---------------------------------------------------------------------------
const files = new Map();
const sessionSettings = new Map();
const conversationHistory = new Map();
const activeRuns = new Map();
const activeSendEventFns = new Set();

// Task board (in-memory)
const tasks = new Map();

// Cron jobs (in-memory + timers)
const cronJobs = new Map();
const cronTimers = new Map();

function randomId() {
  return randomUUID().replace(/-/g, "");
}

function sessionKeyFor(agentId) {
  return `agent:${agentId}:${MAIN_KEY}`;
}

function getHistory(sessionKey) {
  if (!conversationHistory.has(sessionKey)) {
    conversationHistory.set(sessionKey, []);
  }
  return conversationHistory.get(sessionKey);
}

function clearHistory(sessionKey) {
  conversationHistory.delete(sessionKey);
}

function resOk(id, payload) {
  return { type: "res", id, ok: true, payload: payload ?? {} };
}

function resErr(id, code, message) {
  return { type: "res", id, ok: false, error: { code, message } };
}

function broadcastEvent(frame) {
  for (const send of activeSendEventFns) {
    try {
      send(frame);
    } catch {}
  }
}

const ROLE_EMOJI = {
  "DevOps & Infrastructure": "\u{1F6E0}\u{FE0F}",
  "IoT & Embedded": "\u{26A1}",
  "Backend": "\u{1F5C4}\u{FE0F}",
  "Frontend & Mobile": "\u{1F3A8}",
  "Video & Streaming": "\u{1F3AC}",
  "AI & Automation": "\u{1F9E0}",
};

// ---------------------------------------------------------------------------
// Auto-load AI keys from environment variables
// ---------------------------------------------------------------------------
const ENV_KEY_MAP = {
  anthropic: ["ANTHROPIC_API_KEY", "CLAUDE_API_KEY"],
  gemini: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
  openai: ["OPENAI_API_KEY"],
  groq: ["GROQ_API_KEY"],
};

function autoLoadKeysFromEnv() {
  for (const [provider, envNames] of Object.entries(ENV_KEY_MAP)) {
    for (const envName of envNames) {
      const key = process.env[envName]?.trim();
      if (key) {
        aiKeys[provider] = key;
        if (provider === "anthropic") initAnthropicClient(key);
        else if (provider === "gemini") initGeminiClient(key);
        else if (provider === "openai") initOpenAIClient(key);
        break;
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Cron scheduling helpers
// ---------------------------------------------------------------------------
function scheduleCronJob(job) {
  clearCronTimer(job.id);
  if (!job.enabled) return;

  const schedule = job.schedule;
  if (!schedule) return;

  if (schedule.kind === "every" && schedule.everyMs > 0) {
    job.state.nextRunAtMs = Date.now() + schedule.everyMs;
    const timer = setInterval(() => executeCronJob(job), schedule.everyMs);
    cronTimers.set(job.id, timer);
  } else if (schedule.kind === "at" && schedule.at) {
    const atMs = new Date(schedule.at).getTime();
    const delay = atMs - Date.now();
    if (delay > 0) {
      job.state.nextRunAtMs = atMs;
      const timer = setTimeout(() => {
        executeCronJob(job);
        cronTimers.delete(job.id);
        if (job.deleteAfterRun) cronJobs.delete(job.id);
      }, delay);
      cronTimers.set(job.id, timer);
    }
  } else if (schedule.kind === "cron" && schedule.expr) {
    // Simple cron: parse "M H * * *" for minute/hour scheduling
    const nextMs = nextCronRun(schedule.expr);
    if (nextMs) {
      job.state.nextRunAtMs = nextMs;
      const delay = nextMs - Date.now();
      const timer = setTimeout(() => {
        executeCronJob(job);
        scheduleCronJob(job); // reschedule
      }, Math.max(delay, 1000));
      cronTimers.set(job.id, timer);
    }
  }
}

function clearCronTimer(jobId) {
  const timer = cronTimers.get(jobId);
  if (timer) {
    clearTimeout(timer);
    clearInterval(timer);
    cronTimers.delete(jobId);
  }
}

function nextCronRun(expr) {
  // Minimal cron parser: "M H * * *" (minute hour)
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const minute = parseInt(parts[0], 10);
  const hour = parseInt(parts[1], 10);
  if (isNaN(minute) || isNaN(hour)) return null;
  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime();
}

function executeCronJob(job) {
  job.state.lastStatus = "ok";
  job.state.lastRunAtMs = Date.now();
  job.updatedAtMs = Date.now();
  console.log(`[demo-gateway] Cron job executed: ${job.name} (${job.id})`);
  // If job has a payload message, send it as a chat to the assigned agent
  if (job.payload?.message && job.agentId) {
    const sessionKey = sessionKeyFor(job.agentId);
    for (const sendFn of activeSendEventFns) {
      try {
        sendFn({
          type: "event",
          event: "cron.fired",
          payload: { jobId: job.id, jobName: job.name, agentId: job.agentId, message: job.payload.message },
        });
      } catch {}
    }
  }
}

function agentListPayload() {
  return [...agents.values()].map((agent) => ({
    id: agent.id,
    name: agent.name,
    workspace: agent.workspace,
    identity: { name: agent.name, emoji: ROLE_EMOJI[agent.role] || "\u{1F916}" },
    role: agent.role,
  }));
}

// ---------------------------------------------------------------------------
// Dynamic MODELS list — built from available providers
// ---------------------------------------------------------------------------
function buildModelsList() {
  const models = [];
  // SDK models
  if (anthropicClient) {
    models.push({ id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4 (API)", provider: "anthropic", reasoning: true });
  }
  if (geminiClient) {
    models.push({ id: "google/gemini-2.0-flash", name: "Gemini 2.0 Flash (API)", provider: "google" });
  }
  if (openaiClient) {
    models.push({ id: "openai/gpt-4o", name: "GPT-4o (API)", provider: "openai" });
  }
  // Agent SDK / CLI models (only if API SDK not available for that provider)
  if (!anthropicClient && isClaudeAgentSDKAvailable()) {
    models.push({ id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4 (OAuth)", provider: "anthropic", reasoning: true });
  }
  if (!geminiClient && isGeminiCLIAvailable()) {
    models.push({ id: "google/gemini-2.0-flash", name: "Gemini 2.0 Flash (CLI)", provider: "google" });
  }
  // Mock always available
  models.push({ id: "builtin/mock-office", name: "Mock (Yedek)", provider: "builtin" });
  return models;
}

// ---------------------------------------------------------------------------
// AI Streaming Functions
// ---------------------------------------------------------------------------

async function streamAnthropicReply(agent, history, userMessage, abortSignal, emitDelta) {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agent.role] || `Sen ${agent.name} adında bir asistansın. Türkçe yanıt ver.`;
  const messages = history.map((m) => ({ role: m.role, content: m.content }));
  messages.push({ role: "user", content: userMessage });

  const stream = anthropicClient.messages.stream({
    model: agent.model || "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  });

  let fullText = "";
  for await (const event of stream) {
    if (abortSignal.aborted) break;
    if (event.type === "content_block_delta" && event.delta?.type === "text_delta") {
      fullText += event.delta.text;
      emitDelta(fullText);
    }
  }
  return fullText;
}

async function streamGeminiReply(agent, history, userMessage, abortSignal, emitDelta) {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agent.role] || `Sen ${agent.name} adında bir asistansın. Türkçe yanıt ver.`;
  const model = geminiClient.getGenerativeModel({
    model: agent.model || "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  const chatHistory = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessageStream(userMessage);

  let fullText = "";
  for await (const chunk of result.stream) {
    if (abortSignal.aborted) break;
    const text = chunk.text();
    if (text) {
      fullText += text;
      emitDelta(fullText);
    }
  }
  return fullText;
}

async function streamOpenAIReply(agent, history, userMessage, abortSignal, emitDelta) {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agent.role] || `Sen ${agent.name} adında bir asistansın. Türkçe yanıt ver.`;
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const stream = await openaiClient.chat.completions.create({
    model: agent.model || "gpt-4o",
    messages,
    stream: true,
  });

  let fullText = "";
  for await (const chunk of stream) {
    if (abortSignal.aborted) break;
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) {
      fullText += delta;
      emitDelta(fullText);
    }
  }
  return fullText;
}

// ---------------------------------------------------------------------------
// Agent SDK / CLI-based streaming (no API key needed — uses OAuth/Google auth)
// ---------------------------------------------------------------------------

async function streamClaudeAgentReply(agent, history, userMessage, abortSignal, emitDelta) {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agent.role] || `Sen ${agent.name} adında bir asistansın. Türkçe yanıt ver.`;

  // Build context from history
  let contextPrompt = "";
  if (history.length > 0) {
    contextPrompt = "Önceki konuşma:\n";
    for (const m of history) {
      contextPrompt += `${m.role === "user" ? "User" : "Assistant"}: ${m.content}\n\n`;
    }
    contextPrompt += "---\n\n";
  }

  const abortController = new AbortController();
  if (abortSignal.aborted) abortController.abort();
  // Sync external abort signal
  const checkAbort = setInterval(() => {
    if (abortSignal.aborted && !abortController.signal.aborted) {
      abortController.abort();
    }
  }, 100);

  let fullText = "";

  try {
    const response = claudeAgentQuery({
      prompt: contextPrompt + userMessage,
      options: {
        systemPrompt,
        model: "claude-sonnet-4-20250514",
        maxTurns: 5,
        abortController,
        allowedTools: [],
      },
    });

    for await (const message of response) {
      if (abortSignal.aborted) break;

      if (message.type === "assistant") {
        // Extract text from content blocks
        const content = message.message?.content;
        if (Array.isArray(content)) {
          const textParts = content
            .filter((b) => b.type === "text")
            .map((b) => b.text);
          if (textParts.length > 0) {
            fullText = textParts.join("");
            emitDelta(fullText);
          }
        } else if (typeof content === "string") {
          fullText = content;
          emitDelta(fullText);
        }
      } else if (message.type === "result") {
        // Final result
        if (message.result && typeof message.result === "string" && message.result.length > fullText.length) {
          fullText = message.result;
          emitDelta(fullText);
        }
      }
    }
  } finally {
    clearInterval(checkAbort);
  }

  return fullText;
}

async function streamGeminiCLIReply(agent, history, userMessage, abortSignal, emitDelta) {
  const systemPrompt = AGENT_SYSTEM_PROMPTS[agent.role] || `Sen ${agent.name} adında bir asistansın. Türkçe yanıt ver.`;

  let fullPrompt = `System: ${systemPrompt}\n\n`;
  for (const m of history) {
    fullPrompt += `${m.role === "user" ? "User" : "Assistant"}: ${m.content}\n\n`;
  }
  fullPrompt += `User: ${userMessage}`;

  return new Promise((resolve, reject) => {
    const child = spawn("npx", [
      "@google/gemini-cli",
      "-p", fullPrompt,
      "-o", "stream-json",
    ], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let fullText = "";
    let buffer = "";

    child.stdout.on("data", (chunk) => {
      if (abortSignal.aborted) { child.kill(); return; }
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line);
          if (event.type === "result" && event.result) {
            fullText = event.result;
            emitDelta(fullText);
          } else if (event.message?.content) {
            fullText = event.message.content;
            emitDelta(fullText);
          } else if (typeof event.text === "string") {
            fullText += event.text;
            emitDelta(fullText);
          }
        } catch {}
      }
    });

    child.stderr.on("data", () => {});

    child.on("close", (code) => {
      if (abortSignal.aborted) resolve(fullText);
      else if (code !== 0 && !fullText) reject(new Error(`Gemini CLI exited with code ${code}`));
      else resolve(fullText);
    });

    child.on("error", reject);
  });
}

// ---------------------------------------------------------------------------
// Provider selection: agent's preferred provider -> any available -> null (mock)
// ---------------------------------------------------------------------------
function selectStreamFunction(agent) {
  // 1. Agent's assigned provider (API SDK)
  if (agent.provider === "anthropic" && anthropicClient) return streamAnthropicReply;
  if (agent.provider === "gemini" && geminiClient) return streamGeminiReply;
  if (agent.provider === "openai" && openaiClient) return streamOpenAIReply;
  // 2. Agent's assigned provider (Agent SDK / CLI)
  if (agent.provider === "anthropic" && isClaudeAgentSDKAvailable()) return streamClaudeAgentReply;
  if (agent.provider === "gemini" && isGeminiCLIAvailable()) return streamGeminiCLIReply;
  // 3. Any available API SDK provider
  if (anthropicClient) return streamAnthropicReply;
  if (geminiClient) return streamGeminiReply;
  if (openaiClient) return streamOpenAIReply;
  // 4. Any available Agent SDK / CLI provider
  if (isClaudeAgentSDKAvailable()) return streamClaudeAgentReply;
  if (isGeminiCLIAvailable()) return streamGeminiCLIReply;
  // 5. Mock fallback
  return null;
}

// ---------------------------------------------------------------------------
// Mock reply (fallback when no AI keys configured)
// ---------------------------------------------------------------------------
function buildDemoReply(agent, message) {
  const normalized = message.trim().toLowerCase();
  const isGreeting = /^(merhaba|selam|hey|sa|slm|naber|nasıl|nasil|hi|hello)/i.test(normalized);
  const replyMap = {
    "DevOps & Infrastructure": {
      greeting: `Merhaba! Ben ${agent.name}, DevOps ve altyapı konularında yardımcınızım. Sunucular, Docker container'lar ve CI/CD pipeline'larla ilgileniyorum. Ne üzerinde çalışalım?`,
      response: `Anlaşıldı. Docker compose, Jenkins pipeline, Linux server yönetimi, Nginx konfigürasyonu ve deployment süreçlerinde destek verebilirim. Detay paylaşır mısınız?`,
    },
    "IoT & Embedded": {
      greeting: `Merhaba! Ben ${agent.name}, IoT ve gömülü sistemler uzmanıyım. ESP32 firmware, sensörler ve MQTT protokolü konusunda çalışıyorum. Nasıl yardımcı olabilirim?`,
      response: `PlatformIO, ESP32, SHT31/ADS1115/TSL2591 sensörler, aktüatörler ve MQTT iletişimi konusunda destek verebilirim. Hangi modül üzerinde çalışıyorsunuz?`,
    },
    "Backend": {
      greeting: `Merhaba! Ben ${agent.name}, backend geliştirme uzmanıyım. API tasarımı, veritabanı yönetimi ve sunucu tarafı mimarisiyle ilgileniyorum. Ne yapıyoruz?`,
      response: `Node.js, Express, PostgreSQL, WebSocket ve REST API konularında yardımcı olabilirim. Hangi endpoint veya servis üzerinde çalışalım?`,
    },
    "Frontend & Mobile": {
      greeting: `Merhaba! Ben ${agent.name}, frontend ve mobil geliştirme uzmanıyım. Kullanıcı arayüzleri ve responsive tasarım konusunda çalışıyorum. Hangi ekranı geliştiriyoruz?`,
      response: `React, Next.js, Tailwind CSS, React Native ve Expo konularında destek verebilirim. Tasarım detaylarını paylaşır mısınız?`,
    },
    "Video & Streaming": {
      greeting: `Merhaba! Ben ${agent.name}, video ve streaming altyapısı uzmanıyım. Canlı yayın, transcoding ve CDN konularında çalışıyorum. Ne üzerinde çalışalım?`,
      response: `FFmpeg, HLS/RTMP transcoding, WebRTC, CDN routing ve video analytics konularında yardımcı olabilirim. Hangi stream veya video işlemiyle ilgileniyorsunuz?`,
    },
    "AI & Automation": {
      greeting: `Merhaba! Ben ${agent.name}, yapay zeka ve otomasyon uzmanıyım. Workflow otomasyonu ve LLM entegrasyonları konusunda çalışıyorum. Hangi otomasyon üzerinde çalışalım?`,
      response: `n8n workflow, Gemini/Claude/GPT API entegrasyonu, Telegram bot ve otomasyon zincirleri konusunda destek verebilirim. Detayları paylaşır mısınız?`,
    },
  };
  const entry = replyMap[agent.role] || {
    greeting: `Merhaba! Ben ${agent.name}. Nasıl yardımcı olabilirim?`,
    response: `Anlaşıldı. Bu konuda yardımcı olabilirim. Biraz daha detay paylaşır mısınız?`,
  };
  return isGreeting ? entry.greeting : entry.response;
}

// ---------------------------------------------------------------------------
// Main method handler
// ---------------------------------------------------------------------------
async function handleMethod(method, params, id, sendEvent) {
  const p = params || {};

  switch (method) {
    // -----------------------------------------------------------------------
    // AI Keys management (UI-driven)
    // -----------------------------------------------------------------------
    case "ai.keys.set": {
      const provider = typeof p.provider === "string" ? p.provider.trim() : "";
      const apiKey = typeof p.apiKey === "string" ? p.apiKey.trim() : "";
      if (!provider || !["anthropic", "gemini", "openai", "groq"].includes(provider)) {
        return resErr(id, "invalid_provider", "Provider must be anthropic, gemini, openai, or groq.");
      }
      aiKeys[provider] = apiKey;
      if (apiKey) {
        if (provider === "anthropic") initAnthropicClient(apiKey);
        else if (provider === "gemini") initGeminiClient(apiKey);
        else if (provider === "openai") initOpenAIClient(apiKey);
        else if (provider === "groq") process.env.GROQ_API_KEY = apiKey;
      } else {
        // Clear client when key is removed
        if (provider === "anthropic") anthropicClient = null;
        else if (provider === "gemini") geminiClient = null;
        else if (provider === "openai") openaiClient = null;
        else if (provider === "groq") delete process.env.GROQ_API_KEY;
      }
      return resOk(id, {
        provider,
        configured: Boolean(apiKey),
        availableProviders: {
          anthropic: Boolean(anthropicClient),
          gemini: Boolean(geminiClient),
          openai: Boolean(openaiClient),
          groq: Boolean(aiKeys.groq),
        },
      });
    }

    case "ai.keys.get": {
      return resOk(id, {
        providers: {
          anthropic: { configured: Boolean(aiKeys.anthropic), active: Boolean(anthropicClient) },
          gemini: { configured: Boolean(aiKeys.gemini), active: Boolean(geminiClient) },
          openai: { configured: Boolean(aiKeys.openai), active: Boolean(openaiClient) },
          groq: { configured: Boolean(aiKeys.groq), active: Boolean(aiKeys.groq) },
        },
      });
    }

    // -----------------------------------------------------------------------
    // Agent methods
    // -----------------------------------------------------------------------
    case "agents.list":
      return resOk(id, { defaultId: "erlik-devops", mainKey: MAIN_KEY, agents: agentListPayload(), meta: { teamName: "Cemal'in AI Ekibi" } });

    case "agents.create": {
      const name = typeof p.name === "string" && p.name.trim() ? p.name.trim() : "Demo Agent";
      const role = typeof p.role === "string" ? p.role.trim() : "";
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "demo-agent";
      const agentId = `${slug}-${randomId().slice(0, 6)}`;
      agents.set(agentId, {
        id: agentId,
        name,
        role,
        workspace: `/demo/${slug}`,
        provider: DEFAULT_PROVIDER,
        model: DEFAULT_MODEL,
      });
      broadcastEvent({
        type: "event",
        event: "presence",
        payload: { sessions: { recent: [], byAgent: [] } },
      });
      return resOk(id, { agentId, name, workspace: `/demo/${slug}` });
    }

    case "agents.update": {
      const agentId = typeof p.agentId === "string" ? p.agentId.trim() : "";
      const agent = agents.get(agentId);
      if (!agent) return resErr(id, "not_found", `Agent ${agentId} not found`);
      if (typeof p.name === "string" && p.name.trim()) agent.name = p.name.trim();
      if (typeof p.role === "string") agent.role = p.role.trim();
      return resOk(id, { ok: true, removedBindings: 0 });
    }

    case "agents.delete": {
      const agentId = typeof p.agentId === "string" ? p.agentId.trim() : "";
      if (agentId && agents.has(agentId) && agentId !== "erlik-devops") {
        agents.delete(agentId);
        clearHistory(sessionKeyFor(agentId));
      }
      return resOk(id, { ok: true, removedBindings: 0 });
    }

    case "agents.files.get": {
      const key = `${p.agentId || "erlik-devops"}/${p.name || ""}`;
      const content = files.get(key);
      return resOk(id, { file: content !== undefined ? { content } : { missing: true } });
    }

    case "agents.files.set": {
      const key = `${p.agentId || "erlik-devops"}/${p.name || ""}`;
      files.set(key, typeof p.content === "string" ? p.content : "");
      return resOk(id, {});
    }

    case "config.get":
      return resOk(id, {
        config: { gateway: { reload: { mode: "hot" } } },
        hash: "demo-gateway",
        exists: true,
        path: "/demo/config.json",
      });

    case "config.patch":
    case "config.set":
      return resOk(id, { hash: "demo-gateway" });

    case "exec.approvals.get":
      return resOk(id, {
        path: "",
        exists: true,
        hash: "demo-approvals",
        file: { version: 1, defaults: { security: "full", ask: "off", autoAllowSkills: true }, agents: {} },
      });

    case "exec.approvals.set":
      return resOk(id, { hash: "demo-approvals" });

    case "exec.approval.resolve":
      return resOk(id, { ok: true });

    case "models.list":
      return resOk(id, { models: buildModelsList() });

    // -----------------------------------------------------------------------
    // Skills — report task-manager and soundclaw as installed
    // -----------------------------------------------------------------------
    case "skills.status":
      return resOk(id, {
        workspaceDir: "/demo/workspace",
        managedSkillsDir: "/demo/workspace/.skills",
        skills: [
          {
            name: "Task Manager",
            description: "Turns actionable requests into persistent shared tasks that power the 3DAgent Kanban board.",
            source: "openclaw-workspace",
            bundled: false,
            filePath: "/demo/workspace/skills/task-manager/task-manager.md",
            baseDir: "/demo/workspace/skills/task-manager",
            skillKey: "task-manager",
            always: false,
            disabled: false,
            blockedByAllowlist: false,
            eligible: true,
            requirements: { bins: [], anyBins: [], env: [], config: [], os: [] },
            missing: { bins: [], anyBins: [], env: [], config: [], os: [] },
            configChecks: [],
            install: [],
          },
          {
            name: "Soundclaw",
            description: "Lets agents search Spotify, control playback, and return music links.",
            source: "openclaw-workspace",
            bundled: false,
            filePath: "/demo/workspace/skills/soundclaw/soundclaw.md",
            baseDir: "/demo/workspace/skills/soundclaw",
            skillKey: "soundclaw",
            always: false,
            disabled: false,
            blockedByAllowlist: false,
            eligible: true,
            requirements: { bins: [], anyBins: [], env: [], config: [], os: [] },
            missing: { bins: [], anyBins: [], env: [], config: [], os: [] },
            configChecks: [],
            install: [],
          },
        ],
      });

    case "skills.install":
      return resOk(id, { ok: true, message: "Installed.", stdout: "", stderr: "", code: 0 });

    case "skills.update":
      return resOk(id, { ok: true, skillKey: p.skillKey || "", config: {} });

    case "skills.remove":
      return resOk(id, { removed: true, removedPath: `/demo/workspace/skills/${p.skillKey || "unknown"}`, source: "openclaw-workspace" });

    // -----------------------------------------------------------------------
    // Setup status — for onboarding wizard AI configuration
    // -----------------------------------------------------------------------
    case "setup.status": {
      const claudeSDK = isClaudeAgentSDKAvailable();
      const geminiCLI = isGeminiCLIAvailable();
      return resOk(id, {
        providers: {
          anthropic: { configured: Boolean(aiKeys.anthropic), active: Boolean(anthropicClient), agentSdk: claudeSDK },
          gemini: { configured: Boolean(aiKeys.gemini), active: Boolean(geminiClient), cli: geminiCLI },
          openai: { configured: Boolean(aiKeys.openai), active: Boolean(openaiClient) },
        },
        skills: ["task-manager", "soundclaw"],
        features: { kanban: true, jukebox: true, cron: true },
        needsSetup: !aiKeys.anthropic && !aiKeys.gemini && !aiKeys.openai && !claudeSDK && !geminiCLI,
      });
    }

    // -----------------------------------------------------------------------
    // Tasks — in-memory Kanban board
    // -----------------------------------------------------------------------
    case "tasks.list": {
      const includeArchived = p.includeArchived !== false;
      const list = [...tasks.values()].filter((t) => includeArchived || !t.isArchived);
      return resOk(id, { tasks: list });
    }

    case "tasks.create": {
      const task = {
        id: randomId(),
        title: p.title || "Untitled",
        description: p.description || "",
        status: p.status || "todo",
        source: p.source || "3dagent_manual",
        sourceEventId: p.sourceEventId || null,
        assignedAgentId: p.assignedAgentId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        playbookJobId: p.playbookJobId || null,
        runId: p.runId || null,
        channel: p.channel || null,
        externalThreadId: p.externalThreadId || null,
        lastActivityAt: null,
        notes: p.notes || [],
        isArchived: false,
        isInferred: false,
      };
      tasks.set(task.id, task);
      broadcastEvent({ type: "event", event: "tasks.changed", payload: { action: "created", task } });
      return resOk(id, task);
    }

    case "tasks.update": {
      const task = tasks.get(p.id);
      if (!task) return resErr(id, "not_found", "Task not found");
      if (p.title !== undefined) task.title = p.title;
      if (p.description !== undefined) task.description = p.description;
      if (p.status !== undefined) task.status = p.status;
      if (p.assignedAgentId !== undefined) task.assignedAgentId = p.assignedAgentId;
      if (p.notes !== undefined) task.notes = p.notes;
      if (p.archived !== undefined) task.isArchived = p.archived;
      if (p.source !== undefined) task.source = p.source;
      if (p.channel !== undefined) task.channel = p.channel;
      if (p.playbookJobId !== undefined) task.playbookJobId = p.playbookJobId;
      if (p.runId !== undefined) task.runId = p.runId;
      task.updatedAt = new Date().toISOString();
      task.lastActivityAt = new Date().toISOString();
      broadcastEvent({ type: "event", event: "tasks.changed", payload: { action: "updated", task } });
      return resOk(id, task);
    }

    case "tasks.delete": {
      const existed = tasks.delete(p.id);
      if (existed) {
        broadcastEvent({ type: "event", event: "tasks.changed", payload: { action: "deleted", taskId: p.id } });
      }
      return resOk(id, { ok: true, removed: existed });
    }

    // -----------------------------------------------------------------------
    // Cron — in-memory job store with real scheduling
    // -----------------------------------------------------------------------
    case "cron.list": {
      return resOk(id, { jobs: [...cronJobs.values()] });
    }

    case "cron.add": {
      const job = {
        id: randomId(),
        name: p.name || "Untitled Job",
        agentId: p.agentId || null,
        description: p.description || "",
        enabled: p.enabled !== false,
        deleteAfterRun: p.deleteAfterRun || false,
        updatedAtMs: Date.now(),
        schedule: p.schedule || null,
        sessionTarget: p.sessionTarget || "main",
        wakeMode: p.wakeMode || "now",
        payload: p.payload || null,
        delivery: p.delivery || undefined,
        state: { nextRunAtMs: null, lastStatus: null, lastRunAtMs: null },
      };
      cronJobs.set(job.id, job);
      if (job.enabled && job.schedule) scheduleCronJob(job);
      return resOk(id, job);
    }

    case "cron.run": {
      const job = cronJobs.get(p.id);
      if (!job) return resErr(id, "not_found", "Job not found");
      executeCronJob(job);
      return resOk(id, { ok: true, ran: true });
    }

    case "cron.remove": {
      clearCronTimer(p.id);
      const existed = cronJobs.delete(p.id);
      return resOk(id, { ok: true, removed: existed });
    }

    case "sessions.list": {
      const currentModels = buildModelsList();
      const sessions = [...agents.values()].map((agent) => {
        const sessionKey = sessionKeyFor(agent.id);
        const history = getHistory(sessionKey);
        const settings = sessionSettings.get(sessionKey) || {};
        return {
          key: sessionKey,
          agentId: agent.id,
          updatedAt: history.length > 0 ? Date.now() : null,
          displayName: "Main",
          origin: { label: agent.name, provider: "builtin" },
          model: settings.model || currentModels[0]?.id || "builtin/mock-office",
          modelProvider: "builtin",
        };
      });
      return resOk(id, { sessions });
    }

    case "sessions.preview": {
      const keys = Array.isArray(p.keys) ? p.keys : [];
      const limit = typeof p.limit === "number" ? p.limit : 8;
      const maxChars = typeof p.maxChars === "number" ? p.maxChars : 240;
      const previews = keys.map((key) => {
        const history = getHistory(key);
        if (history.length === 0) return { key, status: "empty", items: [] };
        const items = history.slice(-limit).map((msg) => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          text: String(msg.content || "").slice(0, maxChars),
          timestamp: Date.now(),
        }));
        return { key, status: "ok", items };
      });
      return resOk(id, { ts: Date.now(), previews });
    }

    case "sessions.patch": {
      const key = typeof p.key === "string" ? p.key : sessionKeyFor("erlik-devops");
      const current = sessionSettings.get(key) || {};
      const next = { ...current };
      if (p.model !== undefined) next.model = p.model;
      if (p.thinkingLevel !== undefined) next.thinkingLevel = p.thinkingLevel;
      sessionSettings.set(key, next);
      const currentModels = buildModelsList();
      return resOk(id, {
        ok: true,
        key,
        entry: { thinkingLevel: next.thinkingLevel },
        resolved: { model: next.model || currentModels[0]?.id || "builtin/mock-office", modelProvider: "builtin" },
      });
    }

    case "sessions.reset": {
      const key = typeof p.key === "string" ? p.key : sessionKeyFor("erlik-devops");
      clearHistory(key);
      return resOk(id, { ok: true });
    }

    // -----------------------------------------------------------------------
    // Chat — uses real AI when keys are configured, falls back to mock
    // -----------------------------------------------------------------------
    case "chat.send": {
      const sessionKey = typeof p.sessionKey === "string" ? p.sessionKey : sessionKeyFor("erlik-devops");
      const agentId = sessionKey.startsWith("agent:") ? sessionKey.split(":")[1] : "erlik-devops";
      const agent = agents.get(agentId) || agents.get("erlik-devops");
      const message = typeof p.message === "string" ? p.message.trim() : String(p.message || "").trim();
      const runId = typeof p.idempotencyKey === "string" && p.idempotencyKey ? p.idempotencyKey : randomId();
      if (!message) return resOk(id, { status: "no-op", runId });

      let aborted = false;
      const abortController = { aborted: false };
      activeRuns.set(runId, {
        runId,
        sessionKey,
        agentId,
        abort() {
          aborted = true;
          abortController.aborted = true;
        },
      });

      const streamFn = selectStreamFunction(agent);

      setImmediate(async () => {
        let seq = 0;
        const emitChat = (state, extra) => {
          sendEvent({
            type: "event",
            event: "chat",
            seq: seq++,
            payload: { runId, sessionKey, state, ...extra },
          });
        };

        try {
          if (streamFn) {
            // ---- Real AI streaming ----
            const history = getHistory(sessionKey);
            let fullText = "";

            try {
              fullText = await streamFn(agent, history, message, abortController, (partial) => {
                if (!aborted) {
                  emitChat("delta", { message: { role: "assistant", content: partial } });
                }
              });
            } catch (aiError) {
              console.error(`[demo-gateway] AI error (${agent.provider}):`, aiError.message);
              // Fallback to mock on AI error
              fullText = buildDemoReply(agent, message) + `\n\n_(AI hatası: ${aiError.message}. Mock yanıt gösterildi.)_`;
              emitChat("delta", { message: { role: "assistant", content: fullText } });
            }

            if (aborted) {
              emitChat("aborted", {});
              return;
            }

            history.push({ role: "user", content: message });
            history.push({ role: "assistant", content: fullText });
            emitChat("final", { stopReason: "end_turn", message: { role: "assistant", content: fullText } });
          } else {
            // ---- Mock word-by-word streaming ----
            const reply = buildDemoReply(agent, message);
            const words = reply.split(" ");
            let partial = "";
            for (const word of words) {
              if (aborted) break;
              partial = partial ? `${partial} ${word}` : word;
              emitChat("delta", { message: { role: "assistant", content: partial } });
              await new Promise((resolve) => setTimeout(resolve, 45));
            }

            if (aborted) {
              emitChat("aborted", {});
              return;
            }

            const history = getHistory(sessionKey);
            history.push({ role: "user", content: message });
            history.push({ role: "assistant", content: reply });
            emitChat("final", { stopReason: "end_turn", message: { role: "assistant", content: reply } });
          }

          sendEvent({
            type: "event",
            event: "presence",
            seq: seq++,
            payload: {
              sessions: {
                recent: [{ key: sessionKey, updatedAt: Date.now() }],
                byAgent: [{ agentId, recent: [{ key: sessionKey, updatedAt: Date.now() }] }],
              },
            },
          });
        } finally {
          activeRuns.delete(runId);
        }
      });

      return resOk(id, { status: "started", runId });
    }

    case "chat.abort": {
      const runId = typeof p.runId === "string" ? p.runId.trim() : "";
      const sessionKey = typeof p.sessionKey === "string" ? p.sessionKey.trim() : "";
      let abortedCount = 0;
      if (runId) {
        const handle = activeRuns.get(runId);
        if (handle) {
          handle.abort();
          activeRuns.delete(runId);
          abortedCount += 1;
        }
      } else if (sessionKey) {
        for (const [activeRunId, handle] of activeRuns.entries()) {
          if (handle.sessionKey !== sessionKey) continue;
          handle.abort();
          activeRuns.delete(activeRunId);
          abortedCount += 1;
        }
      }
      return resOk(id, { ok: true, aborted: abortedCount });
    }

    case "chat.history": {
      const sessionKey = typeof p.sessionKey === "string" ? p.sessionKey : sessionKeyFor("erlik-devops");
      return resOk(id, { sessionKey, messages: getHistory(sessionKey) });
    }

    case "agent.wait": {
      const runId = typeof p.runId === "string" ? p.runId : "";
      const timeoutMs = typeof p.timeoutMs === "number" ? p.timeoutMs : 30000;
      const start = Date.now();
      while (activeRuns.has(runId) && Date.now() - start < timeoutMs) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      return resOk(id, { status: activeRuns.has(runId) ? "running" : "done" });
    }

    case "status": {
      const recent = [...agents.keys()].flatMap((agentId) => {
        const key = sessionKeyFor(agentId);
        const history = getHistory(key);
        return history.length > 0 ? [{ key, updatedAt: Date.now() }] : [];
      });
      return resOk(id, {
        sessions: {
          recent,
          byAgent: [...agents.keys()].map((agentId) => ({
            agentId,
            recent: recent.filter((entry) => entry.key.includes(`:${agentId}:`)),
          })),
        },
      });
    }

    case "wake":
      return resOk(id, { ok: true });

    default:
      return resOk(id, {});
  }
}

// ---------------------------------------------------------------------------
// WebSocket server
// ---------------------------------------------------------------------------
function startAdapter(options = {}) {
  const port = options.port != null ? options.port : ADAPTER_PORT;
  const silent = options.silent || false;

  // Auto-load AI keys from environment variables on startup
  autoLoadKeysFromEnv();

  // Agent SDK / CLI detection (async for ESM import)
  loadClaudeAgentSDK().then(() => {
    if (isGeminiCLIAvailable()) console.log("[demo-gateway] Gemini CLI tespit edildi (Google auth — API key gerekmez).");
    if (!anthropicClient && !geminiClient && !openaiClient && !isClaudeAgentSDKAvailable() && !isGeminiCLIAvailable()) {
      console.log("[demo-gateway] AI sağlayıcı bulunamadı. Mock yanıtlar kullanılacak.");
    }
  });

  const httpServer = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("3DAgent Demo Gateway Adapter\n");
  });

  const wss = new WebSocketServer({ server: httpServer });
  wss.on("error", () => {}); // Prevent unhandled WSS errors (httpServer handler manages them)
  wss.on("connection", (ws) => {
    let connected = false;
    let globalSeq = 0;

    const send = (frame) => {
      if (ws.readyState !== ws.OPEN) return;
      ws.send(JSON.stringify(frame));
    };

    const sendEventFn = (frame) => {
      if (frame.type === "event" && typeof frame.seq !== "number") {
        frame.seq = globalSeq++;
      }
      send(frame);
    };

    activeSendEventFns.add(sendEventFn);
    send({ type: "event", event: "connect.challenge", payload: { nonce: randomId() } });

    ws.on("message", async (raw) => {
      let frame;
      try {
        frame = JSON.parse(raw.toString("utf8"));
      } catch {
        return;
      }
      if (!frame || typeof frame !== "object" || frame.type !== "req") return;
      const { id, method, params } = frame;
      if (typeof id !== "string" || typeof method !== "string") return;

      if (method === "connect") {
        connected = true;
        send({
          type: "res",
          id,
          ok: true,
          payload: {
            type: "hello-ok",
            protocol: 3,
            adapterType: "builtin",
            features: {
              methods: [
                "agents.list",
                "agents.create",
                "agents.delete",
                "agents.update",
                "sessions.list",
                "sessions.preview",
                "sessions.patch",
                "sessions.reset",
                "chat.send",
                "chat.abort",
                "chat.history",
                "agent.wait",
                "status",
                "config.get",
                "config.set",
                "config.patch",
                "agents.files.get",
                "agents.files.set",
                "exec.approvals.get",
                "exec.approvals.set",
                "exec.approval.resolve",
                "wake",
                "skills.status",
                "models.list",
                "cron.list",
                "cron.add",
                "cron.run",
                "cron.remove",
                "tasks.list",
                "tasks.create",
                "tasks.update",
                "tasks.delete",
                "ai.keys.set",
                "ai.keys.get",
                "setup.status",
              ],
              events: ["chat", "presence", "heartbeat"],
            },
            snapshot: {
              health: {
                agents: [...agents.values()].map((agent) => ({
                  agentId: agent.id,
                  name: agent.name,
                  isDefault: agent.id === "erlik-devops",
                })),
                defaultAgentId: "erlik-devops",
              },
              sessionDefaults: { mainKey: MAIN_KEY },
            },
            auth: { role: "operator", scopes: ["operator.admin"] },
            policy: { tickIntervalMs: 30000 },
          },
        });
        return;
      }

      if (!connected) {
        send(resErr(id, "not_connected", "Send connect first."));
        return;
      }

      try {
        send(await handleMethod(method, params, id, sendEventFn));
      } catch (error) {
        send(resErr(id, "internal_error", error instanceof Error ? error.message : "Internal error"));
      }
    });

    ws.on("close", () => activeSendEventFns.delete(sendEventFn));
    ws.on("error", () => activeSendEventFns.delete(sendEventFn));
  });

  return new Promise((resolve, reject) => {
    httpServer.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        if (!silent) console.log(`[demo-gateway] Port ${port} zaten kullanımda, atlanıyor.`);
        resolve(null);
        return;
      }
      reject(err);
    });
    httpServer.listen(port, "127.0.0.1", () => {
      if (!silent) {
        console.log(`[demo-gateway] ws://localhost:${port} üzerinde dinliyor`);
        console.log("[demo-gateway] AI anahtarlarını Ayarlar panelinden girebilirsiniz.");
      }
      resolve(httpServer);
    });
  });
}

if (require.main === module) {
  startAdapter().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = {
  handleMethod,
  startAdapter,
};
