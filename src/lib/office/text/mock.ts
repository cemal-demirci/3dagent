import type { MockTextMessageScenario } from "@/lib/office/text/types";
import { t, tReplace } from "@/lib/i18n";

const normalizeWhitespace = (value: string | null | undefined): string =>
  (value ?? "").replace(/\s+/g, " ").trim();

const titleCase = (value: string): string =>
  value.replace(/\b([a-z])([a-z']*)/g, (_, first: string, rest: string) => {
    return `${first.toUpperCase()}${rest}`;
  });

const formatRecipientLabel = (recipient: string): string => {
  const normalized = normalizeWhitespace(recipient).toLowerCase();
  if (!normalized) return t("mock.yourContact");
  if (normalized === "my wife" || normalized === "kişim") return t("mock.yourContact");
  if (normalized === "my husband") return t("mock.yourHusband");
  if (normalized === "my mom") return t("mock.yourMom");
  if (normalized === "my dad") return t("mock.yourDad");
  return titleCase(normalized);
};

const buildPromptText = (recipientLabel: string): string =>
  tReplace("mock.whatShouldIMessage", { recipient: recipientLabel });

const buildConfirmationText = (message: string): string => {
  const normalized = normalizeWhitespace(message).toLowerCase();
  if (normalized.includes("late for the soccer game") || normalized.includes("maça geç")) {
    return t("mock.noWorriesHeadsUp");
  }
  if (normalized.includes("running late") || normalized.includes("gecikiyorum")) {
    return t("mock.thanksLettingKnow");
  }
  if (normalized.includes("on my way") || normalized.includes("yoldayım")) {
    return t("mock.perfectSeeYou");
  }
  if (normalized.includes("be there") || normalized.includes("orada")) {
    return t("mock.soundsGoodShort");
  }
  return t("mock.deliveredShort");
};

export const buildMockTextMessageScenario = (params: {
  recipient: string;
  message?: string | null;
}): MockTextMessageScenario => {
  const recipientLabel = formatRecipientLabel(params.recipient);
  const message = normalizeWhitespace(params.message);
  if (!message) {
    return {
      phase: "needs_message",
      recipient: recipientLabel,
      messageText: null,
      confirmationText: null,
      promptText: buildPromptText(recipientLabel),
      statusLine: tReplace("mock.waitingForTextTo", { recipient: recipientLabel }),
    };
  }
  return {
    phase: "ready_to_send",
    recipient: recipientLabel,
    messageText: message,
    confirmationText: buildConfirmationText(message),
    promptText: null,
    statusLine: tReplace("mock.textQueuedFor", { recipient: recipientLabel }),
  };
};
