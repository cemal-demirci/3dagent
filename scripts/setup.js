#!/usr/bin/env node

/**
 * Claw3D Setup Wizard — cemal.cloud
 *
 * Interactive terminal setup: system check, CLI installs, auth, env, test.
 * Zero external dependencies — uses only Node.js built-ins.
 */

const { execSync, spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");

// ── ANSI colors ──
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  amber: "\x1b[33m",
  gray: "\x1b[90m",
  white: "\x1b[97m",
};

const ok = (msg) => console.log(`  ${C.green}\u2713${C.reset} ${msg}`);
const fail = (msg) => console.log(`  ${C.red}\u2717${C.reset} ${msg}`);
const info = (msg) => console.log(`  ${C.cyan}\u2192${C.reset} ${msg}`);
const warn = (msg) => console.log(`  ${C.yellow}!${C.reset} ${msg}`);
const step = (n, total, title) =>
  console.log(`\n${C.cyan}[${n}/${total}]${C.reset} ${C.bold}${title}${C.reset}`);

function banner() {
  console.log(`
${C.amber}${C.bold}\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551     CLAW3D SETUP \u2014 cemal.cloud      \u2551
\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d${C.reset}
`);
}

function footer() {
  console.log(`
${C.amber}\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550${C.reset}
  ${C.green}${C.bold}Kurulum tamamland\u0131!${C.reset}
  Ba\u015flatmak i\u00e7in: ${C.cyan}npm run dev${C.reset}
  Geli\u015ftirici: ${C.white}Cemal Demirci${C.reset}
  ${C.dim}cemal.cloud${C.reset}
${C.amber}\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550${C.reset}
`);
}

/** Run a command silently, return stdout or null on failure */
function run(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  } catch {
    return null;
  }
}

/** Check if a command exists */
function cmdExists(cmd) {
  return run(`command -v ${cmd}`) !== null;
}

const TOTAL_STEPS = 6;
const ROOT = path.resolve(__dirname, "..");

async function main() {
  banner();

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  // ── Step 1: System Check ──
  step(1, TOTAL_STEPS, "Sistem Kontrol\u00fc");

  const nodeVersion = run("node --version");
  if (nodeVersion) {
    ok(`Node.js ${nodeVersion}`);
  } else {
    fail("Node.js bulunamad\u0131");
    process.exit(1);
  }

  const npmVersion = run("npm --version");
  if (npmVersion) {
    ok(`npm ${npmVersion}`);
  } else {
    fail("npm bulunamad\u0131");
    process.exit(1);
  }

  // ── Step 2: Dependencies ──
  step(2, TOTAL_STEPS, "Ba\u011f\u0131ml\u0131l\u0131klar");

  const nodeModulesPath = path.join(ROOT, "node_modules");
  if (fs.existsSync(nodeModulesPath)) {
    ok("node_modules mevcut");
  } else {
    info("npm install \u00e7al\u0131\u015ft\u0131r\u0131l\u0131yor...");
    try {
      execSync("npm install", { cwd: ROOT, stdio: "inherit" });
      ok("Ba\u011f\u0131ml\u0131l\u0131klar y\u00fcklendi");
    } catch {
      fail("npm install ba\u015far\u0131s\u0131z oldu");
      process.exit(1);
    }
  }

  // ── Step 3: Claude CLI ──
  step(3, TOTAL_STEPS, "Claude CLI");

  let claudeInstalled = cmdExists("claude");
  if (claudeInstalled) {
    const claudeVersion = run("claude --version") || "kurulu";
    ok(`Kurulu (${claudeVersion})`);
  } else {
    warn("Kurulu de\u011fil");
    const installClaude = await rl.question(
      `  ${C.cyan}?${C.reset} Claude CLI kurulsun mu? [E/h] `
    );
    if (!installClaude || installClaude.toLowerCase() === "e" || installClaude.toLowerCase() === "y") {
      info("npm install -g @anthropic-ai/claude-code ...");
      try {
        execSync("npm install -g @anthropic-ai/claude-code", { stdio: "inherit" });
        claudeInstalled = cmdExists("claude");
        if (claudeInstalled) {
          ok("Claude CLI kuruldu");
        } else {
          warn("Kurulum tamamland\u0131 ama PATH'te bulunamad\u0131");
        }
      } catch {
        fail("Claude CLI kurulamad\u0131 \u2014 manuel olarak deneyin: npm install -g @anthropic-ai/claude-code");
      }
    } else {
      info("Claude CLI atland\u0131");
    }
  }

  if (claudeInstalled) {
    info("Auth kontrol\u00fc...");
    const authCheck = run("claude auth status 2>&1");
    if (authCheck && (authCheck.includes("Logged in") || authCheck.includes("authenticated"))) {
      ok("OAuth tamamlanm\u0131\u015f");
    } else {
      warn("Giri\u015f yap\u0131lmam\u0131\u015f");
      const doLogin = await rl.question(
        `  ${C.cyan}?${C.reset} claude login ba\u015flat\u0131ls\u0131n m\u0131? (taray\u0131c\u0131 a\u00e7\u0131l\u0131r) [E/h] `
      );
      if (!doLogin || doLogin.toLowerCase() === "e" || doLogin.toLowerCase() === "y") {
        info("claude login ba\u015flat\u0131l\u0131yor...");
        try {
          execSync("claude login", { stdio: "inherit" });
          ok("OAuth tamamland\u0131");
        } catch {
          warn("Login i\u015flemi tamamlanamad\u0131 \u2014 daha sonra 'claude login' ile deneyebilirsiniz");
        }
      }
    }
  }

  // ── Step 4: Gemini CLI ──
  step(4, TOTAL_STEPS, "Gemini CLI");

  let geminiAvailable = false;
  info("npx @google/gemini-cli kontrol ediliyor...");
  const geminiCheck = run("npx --yes @google/gemini-cli --version 2>&1");
  if (geminiCheck && !geminiCheck.includes("ERR")) {
    ok(`Mevcut (${geminiCheck})`);
    geminiAvailable = true;
  } else {
    // Gemini CLI may not have --version, just check if npx can resolve it
    const geminiHelp = run("npx --yes @google/gemini-cli --help 2>&1");
    if (geminiHelp && geminiHelp.length > 20) {
      ok("Mevcut");
      geminiAvailable = true;
    } else {
      warn("Gemini CLI bulunamad\u0131 veya y\u00fcklenemedi");
      info("npx @google/gemini-cli ile kullanabilirsiniz");
    }
  }

  if (geminiAvailable) {
    info("Auth kontrol\u00fc...");
    // Gemini CLI uses Google account auth - check for gcloud or ADC
    const adcPath = path.join(
      process.env.HOME || "~",
      ".config",
      "gcloud",
      "application_default_credentials.json"
    );
    if (fs.existsSync(adcPath)) {
      ok("Google hesab\u0131 ba\u011fl\u0131 (ADC mevcut)");
    } else {
      warn("Google kimlik bilgileri bulunamad\u0131 \u2014 Gemini CLI ilk \u00e7al\u0131\u015ft\u0131rmada auth isteyecek");
    }
  }

  // ── Step 5: Environment File ──
  step(5, TOTAL_STEPS, "Ortam Dosyas\u0131");

  const envPath = path.join(ROOT, ".env");
  const envExamplePath = path.join(ROOT, ".env.example");

  if (fs.existsSync(envPath)) {
    ok(".env dosyas\u0131 mevcut");
  } else if (fs.existsSync(envExamplePath)) {
    info(".env dosyas\u0131 olu\u015fturuluyor (.env.example'dan)");
    fs.copyFileSync(envExamplePath, envPath);
    ok(".env olu\u015fturuldu");
  } else {
    warn(".env.example bulunamad\u0131 \u2014 .env olu\u015fturma atland\u0131");
  }

  const wantApiKey = await rl.question(
    `  ${C.cyan}?${C.reset} API key girmek ister misiniz? (opsiyonel, CLI zaten \u00e7al\u0131\u015f\u0131yor) [e/H] `
  );
  if (wantApiKey && (wantApiKey.toLowerCase() === "e" || wantApiKey.toLowerCase() === "y")) {
    const anthropicKey = await rl.question(`  ${C.gray}Anthropic API key (bo\u015f b\u0131rakmak i\u00e7in Enter):${C.reset} `);
    const geminiKey = await rl.question(`  ${C.gray}Gemini API key (bo\u015f b\u0131rakmak i\u00e7in Enter):${C.reset} `);
    const openaiKey = await rl.question(`  ${C.gray}OpenAI API key (bo\u015f b\u0131rakmak i\u00e7in Enter):${C.reset} `);

    if (anthropicKey || geminiKey || openaiKey) {
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
      if (anthropicKey) {
        envContent = envContent.replace(/^#?\s*ANTHROPIC_API_KEY=.*/m, `ANTHROPIC_API_KEY=${anthropicKey}`);
        if (!envContent.includes("ANTHROPIC_API_KEY=")) envContent += `\nANTHROPIC_API_KEY=${anthropicKey}`;
      }
      if (geminiKey) {
        envContent = envContent.replace(/^#?\s*GEMINI_API_KEY=.*/m, `GEMINI_API_KEY=${geminiKey}`);
        if (!envContent.includes("GEMINI_API_KEY=")) envContent += `\nGEMINI_API_KEY=${geminiKey}`;
      }
      if (openaiKey) {
        envContent = envContent.replace(/^#?\s*OPENAI_API_KEY=.*/m, `OPENAI_API_KEY=${openaiKey}`);
        if (!envContent.includes("OPENAI_API_KEY=")) envContent += `\nOPENAI_API_KEY=${openaiKey}`;
      }
      fs.writeFileSync(envPath, envContent);
      ok("API key'ler .env dosyas\u0131na kaydedildi");
    }
  }

  // ── Step 6: Test ──
  step(6, TOTAL_STEPS, "Test");

  info("Demo gateway ba\u015flat\u0131l\u0131yor...");
  let gatewayOk = false;
  try {
    // Quick test: spawn demo gateway and check if it starts
    const gw = spawn("node", [path.join(ROOT, "server", "demo-gateway-adapter.js")], {
      cwd: ROOT,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, DEMO_ADAPTER_PORT: "18799" },
    });

    await new Promise((resolve) => {
      let output = "";
      const timeout = setTimeout(() => {
        gw.kill();
        resolve();
      }, 5000);

      gw.stdout.on("data", (data) => {
        output += data.toString();
        if (output.includes("listening") || output.includes("ready") || output.includes("18799")) {
          gatewayOk = true;
          clearTimeout(timeout);
          gw.kill();
          resolve();
        }
      });

      gw.stderr.on("data", (data) => {
        output += data.toString();
        if (output.includes("listening") || output.includes("ready") || output.includes("18799")) {
          gatewayOk = true;
          clearTimeout(timeout);
          gw.kill();
          resolve();
        }
      });

      gw.on("close", () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    if (gatewayOk) {
      ok("Gateway: ws://localhost:18799 ba\u015far\u0131l\u0131");
    } else {
      warn("Gateway testi zaman a\u015f\u0131m\u0131na u\u011frad\u0131 \u2014 npm run dev ile kontrol edin");
    }
  } catch {
    warn("Gateway test edilemedi \u2014 npm run dev ile kontrol edin");
  }

  if (claudeInstalled) {
    ok("Claude Agent SDK: Haz\u0131r");
  } else {
    warn("Claude Agent SDK: CLI kurulu de\u011fil");
  }

  if (geminiAvailable) {
    ok("Gemini CLI: Haz\u0131r");
  } else {
    warn("Gemini CLI: Bulunamad\u0131");
  }

  rl.close();
  footer();
}

main().catch((err) => {
  console.error(`\n${C.red}Kurulum hatas\u0131:${C.reset}`, err.message);
  process.exit(1);
});
