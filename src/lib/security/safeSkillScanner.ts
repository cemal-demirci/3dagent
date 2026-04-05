/**
 * SafeSkillScanner — Agent skill/command guvenlik tarayicisi
 *
 * Ajanlarin calistirmak istedigi komut ve skill'leri regex-based
 * pattern matching ile tarar, tehlikeli olanlari engeller.
 */

export type ScanResult = {
  safe: boolean;
  blocked: string[];   // Engellenen pattern aciklamalari
  warnings: string[];  // Uyarilar (engellenmez ama bildirilir)
  scannedAt: number;
};

type BlockRule = {
  pattern: RegExp;
  description: string;
  severity: "block" | "warn";
};

const BLOCK_RULES: BlockRule[] = [
  // ---- Dosya sistemi tehlikeleri ----
  { pattern: /rm\s+-rf\s+\//, description: "Kok dizin silme komutu", severity: "block" },
  { pattern: /rm\s+-rf\s+~/, description: "Ana dizin silme komutu", severity: "block" },
  { pattern: /rm\s+-rf\s+\*/, description: "Toplu silme komutu", severity: "block" },
  { pattern: /mkfs\./, description: "Disk formatlama komutu", severity: "block" },
  { pattern: /dd\s+if=.*of=\/dev\//, description: "Disk yazma komutu", severity: "block" },

  // ---- Ag guvenligi ----
  { pattern: /curl\s+.*\|\s*(bash|sh|zsh)/, description: "Uzaktan script calistirma", severity: "block" },
  { pattern: /wget\s+.*\|\s*(bash|sh|zsh)/, description: "Uzaktan script indirme ve calistirma", severity: "block" },
  { pattern: /nc\s+-[el]/, description: "Netcat dinleme modu (reverse shell)", severity: "block" },

  // ---- Kimlik bilgileri ----
  { pattern: /password\s*[:=]\s*['"][^'"]+['"]/, description: "Hardcoded sifre tespit edildi", severity: "warn" },
  { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/, description: "Hardcoded API anahtari", severity: "warn" },
  { pattern: /(sk-|pk-|rk_live_)[a-zA-Z0-9]+/, description: "API token pattern tespit edildi", severity: "warn" },

  // ---- Surec kontrolu ----
  { pattern: /kill\s+-9\s+1\b/, description: "PID 1 (init) sonlandirma", severity: "block" },
  { pattern: /:\(\)\s*\{\s*:\|:&\s*\}\s*;:/, description: "Fork bomb tespit edildi", severity: "block" },

  // ---- Yetki yukseltme ----
  { pattern: /chmod\s+777\s/, description: "Tam yetki verme (777)", severity: "warn" },
  { pattern: /chmod\s+[0-7]*s/, description: "SUID/SGID bit ayarlama", severity: "block" },
  { pattern: /chown\s+root/, description: "Root sahiplik degisikligi", severity: "warn" },

  // ---- Env/config manipulation ----
  { pattern: /eval\s*\(/, description: "Eval kullanimi (code injection riski)", severity: "warn" },
  { pattern: /process\.env\.\w+\s*=/, description: "Ortam degiskeni degistirme", severity: "warn" },

  // ---- Git tehlikeleri ----
  { pattern: /git\s+push\s+.*--force/, description: "Force push (gecmis silinebilir)", severity: "warn" },
  { pattern: /git\s+reset\s+--hard/, description: "Hard reset (degisiklikler kaybolabilir)", severity: "warn" },
];

export function scanSkill(input: string): ScanResult {
  const blocked: string[] = [];
  const warnings: string[] = [];

  for (const rule of BLOCK_RULES) {
    if (rule.pattern.test(input)) {
      if (rule.severity === "block") {
        blocked.push(rule.description);
      } else {
        warnings.push(rule.description);
      }
    }
  }

  return {
    safe: blocked.length === 0,
    blocked,
    warnings,
    scannedAt: Date.now(),
  };
}

export function scanMultiple(inputs: string[]): ScanResult {
  const combined: ScanResult = {
    safe: true,
    blocked: [],
    warnings: [],
    scannedAt: Date.now(),
  };

  for (const input of inputs) {
    const result = scanSkill(input);
    if (!result.safe) combined.safe = false;
    combined.blocked.push(...result.blocked);
    combined.warnings.push(...result.warnings);
  }

  return combined;
}
