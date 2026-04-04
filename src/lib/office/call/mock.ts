import type { MockPhoneCallScenario } from "@/lib/office/call/types";
import { t, tReplace } from "@/lib/i18n";

const normalizeWhitespace = (value: string | null | undefined): string =>
  (value ?? "").replace(/\s+/g, " ").trim();

const titleCase = (value: string): string =>
  value.replace(/\b([a-z])([a-z']*)/g, (_, first: string, rest: string) => {
    return `${first.toUpperCase()}${rest}`;
  });

const isPhoneNumberLike = (value: string): boolean => /[\d+]/.test(value);

const formatCalleeLabel = (callee: string): string => {
  const normalized = normalizeWhitespace(callee).toLowerCase();
  if (!normalized) return t("mock.yourContact");
  if (normalized === "my wife" || normalized === "kişim") return t("mock.yourContact");
  if (normalized === "my husband") return t("mock.yourHusband");
  if (normalized === "my mom") return t("mock.yourMom");
  if (normalized === "my dad") return t("mock.yourDad");
  if (isPhoneNumberLike(normalized)) return normalized;
  return titleCase(normalized);
};

const buildPromptText = (calleeLabel: string): string =>
  tReplace("mock.whatShouldISayTo", { callee: calleeLabel });

const DEMO_DIAL_NUMBER = "973-619-4672";

const resolveDialNumber = (): string => DEMO_DIAL_NUMBER;

const buildSpokenText = (message: string): string =>
  tReplace("mock.hiThisIsAssistant", { message });

const buildRecipientReply = (message: string): string => {
  const normalized = normalizeWhitespace(message).toLowerCase();
  if (normalized.includes("late for dinner") || normalized.includes("geç")) {
    return t("mock.okayThanks");
  }
  if (normalized.includes("on my way") || normalized.includes("yoldayım")) return t("mock.seeYouSoon");
  if (normalized.includes("love you") || normalized.includes("seviyorum")) return t("mock.loveToo");
  if (normalized.includes("be there") || normalized.includes("orada")) return t("mock.soundsGood");
  if (normalized.includes("running late") || normalized.includes("gecikiyorum")) return t("mock.thanksForLettingKnow");
  return t("mock.gotIt");
};

export const buildMockPhoneCallScenario = (params: {
  callee: string;
  message?: string | null;
  voiceAvailable: boolean;
}): MockPhoneCallScenario => {
  const calleeLabel = formatCalleeLabel(params.callee);
  const dialNumber = resolveDialNumber();
  const message = normalizeWhitespace(params.message);
  if (!message) {
    return {
      phase: "needs_message",
      callee: calleeLabel,
      dialNumber,
      promptText: buildPromptText(calleeLabel),
      spokenText: null,
      recipientReply: null,
      statusLine: tReplace("mock.waitingForMessageTo", { callee: calleeLabel }),
      voiceAvailable: params.voiceAvailable,
    };
  }
  return {
    phase: "ready_to_call",
    callee: calleeLabel,
    dialNumber,
    promptText: null,
    spokenText: buildSpokenText(message),
    recipientReply: buildRecipientReply(message),
    statusLine: tReplace("mock.connectedTo", { callee: calleeLabel }),
    voiceAvailable: params.voiceAvailable,
  };
};
