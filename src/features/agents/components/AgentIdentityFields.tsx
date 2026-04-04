"use client";

import { t } from "@/lib/i18n";

export type AgentIdentityValues = {
  name: string;
  creature: string;
  vibe: string;
  emoji: string;
};

type AgentIdentityFieldsProps = {
  values: AgentIdentityValues;
  disabled?: boolean;
  onChange: (field: keyof AgentIdentityValues, value: string) => void;
};

const inputClassName =
  "h-10 rounded-md border border-border/80 bg-background px-3 text-sm text-foreground outline-none";

export function AgentIdentityFields({
  values,
  disabled = false,
  onChange,
}: AgentIdentityFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        {t("agentIdentity.name")}
        <input
          className={inputClassName}
          value={values.name}
          placeholder={t("agentIdentity.namePlaceholder")}
          disabled={disabled}
          onChange={(event) => {
            onChange("name", event.target.value);
          }}
        />
      </label>
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        {t("agentIdentity.role")}
        <input
          className={inputClassName}
          value={values.creature}
          placeholder={t("agentIdentity.rolePlaceholder")}
          disabled={disabled}
          onChange={(event) => {
            onChange("creature", event.target.value);
          }}
        />
      </label>
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        {t("agentIdentity.vibe")}
        <input
          className={inputClassName}
          value={values.vibe}
          placeholder={t("agentIdentity.vibePlaceholder")}
          disabled={disabled}
          onChange={(event) => {
            onChange("vibe", event.target.value);
          }}
        />
      </label>
      <label className="flex flex-col gap-2 text-xs text-muted-foreground">
        {t("agentIdentity.emoji")}
        <input
          className={inputClassName}
          value={values.emoji}
          placeholder={t("agentIdentity.emojiPlaceholder")}
          disabled={disabled}
          onChange={(event) => {
            onChange("emoji", event.target.value);
          }}
        />
      </label>
    </div>
  );
}
