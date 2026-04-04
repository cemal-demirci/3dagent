/**
 * Onboarding wizard types.
 *
 * The wizard is step-based and extensible: new steps can be added by
 * extending `OnboardingStepId` and registering a component in the
 * step registry.
 */

import { t } from "@/lib/i18n";

export type OnboardingStepId =
  | "welcome"
  | "ai-setup"
  | "agents"
  | "company"
  | "complete";

export type OnboardingStep = {
  id: OnboardingStepId;
  title: string;
  description: string;
  /** Whether the step can be skipped. */
  skippable: boolean;
};

export type OnboardingState = {
  currentStep: OnboardingStepId;
  completedSteps: Set<OnboardingStepId>;
  /** Whether the user has dismissed the wizard entirely. */
  dismissed: boolean;
  /** Gateway connection state passed from the parent. */
  gatewayConnected: boolean;
  /** Number of agents discovered after connection. */
  agentCount: number;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: t("onboarding.step.welcome.title"),
    description: t("onboarding.step.welcome.description"),
    skippable: false,
  },
  {
    id: "ai-setup",
    title: t("onboarding.step.aiSetup.title"),
    description: t("onboarding.step.aiSetup.description"),
    skippable: true,
  },
  {
    id: "agents",
    title: t("onboarding.step.agents.title"),
    description: t("onboarding.step.agents.description"),
    skippable: true,
  },
  {
    id: "company",
    title: t("onboarding.step.company.title"),
    description: t("onboarding.step.company.description"),
    skippable: true,
  },
  {
    id: "complete",
    title: t("onboarding.step.complete.title"),
    description: t("onboarding.step.complete.description"),
    skippable: false,
  },
];

export const getStepIndex = (stepId: OnboardingStepId): number =>
  ONBOARDING_STEPS.findIndex((s) => s.id === stepId);

export const getNextStep = (
  currentId: OnboardingStepId,
): OnboardingStepId | null => {
  const idx = getStepIndex(currentId);
  if (idx < 0 || idx >= ONBOARDING_STEPS.length - 1) return null;
  return ONBOARDING_STEPS[idx + 1].id;
};

export const getPrevStep = (
  currentId: OnboardingStepId,
): OnboardingStepId | null => {
  const idx = getStepIndex(currentId);
  if (idx <= 0) return null;
  return ONBOARDING_STEPS[idx - 1].id;
};
