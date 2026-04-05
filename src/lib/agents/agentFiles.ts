export const AGENT_FILE_NAMES = [
  "AGENTS.md",
  "SOUL.md",
  "IDENTITY.md",
  "USER.md",
  "TOOLS.md",
  "HEARTBEAT.md",
  "MEMORY.md",
] as const;

export type AgentFileName = (typeof AGENT_FILE_NAMES)[number];

export const PERSONALITY_FILE_NAMES = [
  "SOUL.md",
  "AGENTS.md",
  "USER.md",
  "IDENTITY.md",
] as const satisfies readonly AgentFileName[];

export type PersonalityFileName = (typeof PERSONALITY_FILE_NAMES)[number];

export const PERSONALITY_FILE_LABELS: Record<PersonalityFileName, string> = {
  "SOUL.md": "Kişilik",
  "AGENTS.md": "Direktifler",
  "USER.md": "Bağlam",
  "IDENTITY.md": "Kimlik",
};

export const isAgentFileName = (value: string): value is AgentFileName =>
  AGENT_FILE_NAMES.includes(value as AgentFileName);

export const AGENT_FILE_META: Record<AgentFileName, { title: string; hint: string }> = {
  "AGENTS.md": {
    title: "AGENTS.md",
    hint: "Çalışma talimatları, öncelikler ve kurallar.",
  },
  "SOUL.md": {
    title: "SOUL.md",
    hint: "Kişilik, ton ve sınırlar.",
  },
  "IDENTITY.md": {
    title: "IDENTITY.md",
    hint: "İsim, karakter ve emoji.",
  },
  "USER.md": {
    title: "USER.md",
    hint: "Kullanıcı profili ve tercihler.",
  },
  "TOOLS.md": {
    title: "TOOLS.md",
    hint: "Araç notları ve gelenekler.",
  },
  "HEARTBEAT.md": {
    title: "HEARTBEAT.md",
    hint: "Periyodik kontrol listesi.",
  },
  "MEMORY.md": {
    title: "MEMORY.md",
    hint: "Ajanın kalıcı hafızası.",
  },
};

export const AGENT_FILE_PLACEHOLDERS: Record<AgentFileName, string> = {
  "AGENTS.md": "Bu ajan nasıl çalışmalı? Öncelikler, kurallar ve alışkanlıklar.",
  "SOUL.md": "Ton, kişilik, sınırlar ve nasıl konuşmalı.",
  "IDENTITY.md": "İsim, karakter, emoji ve tek cümlelik kimlik.",
  "USER.md": "Size nasıl hitap etmeli? Tercihler ve bağlam.",
  "TOOLS.md": "Araç notları, gelenekler ve kısayollar.",
  "HEARTBEAT.md": "Periyodik çalıştırma için küçük kontrol listesi.",
  "MEMORY.md": "Hatırlanması gereken kalıcı bilgiler ve kararlar.",
};

export const createAgentFilesState = () =>
  Object.fromEntries(
    AGENT_FILE_NAMES.map((name) => [name, { content: "", exists: false }])
  ) as Record<AgentFileName, { content: string; exists: boolean }>;
