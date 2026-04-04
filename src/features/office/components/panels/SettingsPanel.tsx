"use client";

import { useCallback, useEffect, useState } from "react";
import { CURATED_ELEVENLABS_VOICES } from "@/lib/voiceReply/catalog";
import type { StudioGatewayAdapterType } from "@/lib/studio/settings";
import { t } from "@/lib/i18n";
import { AboutModal } from "./AboutModal";
import {
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationSupported,
} from "@/lib/notifications";

type AIProviderStatus = {
  configured: boolean;
  active: boolean;
};

type AIKeysState = {
  providers: {
    anthropic: AIProviderStatus;
    gemini: AIProviderStatus;
    openai: AIProviderStatus;
    groq: AIProviderStatus;
  };
};

type SettingsPanelProps = {
  gatewayStatus?: string;
  gatewayUrl?: string;
  gatewayToken?: string;
  selectedAdapterType?: StudioGatewayAdapterType;
  activeAdapterType?: StudioGatewayAdapterType;
  onGatewayDisconnect?: () => void;
  onGatewayConnect?: () => void;
  onGatewayUrlChange?: (value: string) => void;
  onGatewayTokenChange?: (value: string) => void;
  onGatewayAdapterTypeChange?: (value: StudioGatewayAdapterType) => void;
  onOpenOnboarding?: () => void;
  officeTitle: string;
  officeTitleLoaded: boolean;
  onOfficeTitleChange: (title: string) => void;
  remoteOfficeEnabled: boolean;
  remoteOfficeSourceKind: "presence_endpoint" | "openclaw_gateway";
  remoteOfficeLabel: string;
  remoteOfficePresenceUrl: string;
  remoteOfficeGatewayUrl: string;
  remoteOfficeTokenConfigured: boolean;
  onRemoteOfficeEnabledChange: (enabled: boolean) => void;
  onRemoteOfficeSourceKindChange: (kind: "presence_endpoint" | "openclaw_gateway") => void;
  onRemoteOfficeLabelChange: (label: string) => void;
  onRemoteOfficePresenceUrlChange: (url: string) => void;
  onRemoteOfficeGatewayUrlChange: (url: string) => void;
  onRemoteOfficeTokenChange: (token: string) => void;
  voiceRepliesEnabled: boolean;
  voiceRepliesVoiceId: string | null;
  voiceRepliesSpeed: number;
  voiceRepliesLoaded: boolean;
  onVoiceRepliesToggle: (enabled: boolean) => void;
  onVoiceRepliesVoiceChange: (voiceId: string | null) => void;
  onVoiceRepliesSpeedChange: (speed: number) => void;
  onVoiceRepliesPreview: (voiceId: string | null, voiceName: string) => void;
  callGateway?: (method: string, params: unknown) => Promise<unknown>;
};

const AI_PROVIDERS = [
  { key: "anthropic" as const, label: t("aiKeys.anthropic"), placeholder: "sk-ant-..." },
  { key: "gemini" as const, label: t("aiKeys.gemini"), placeholder: "AIza..." },
  { key: "openai" as const, label: t("aiKeys.openai"), placeholder: "sk-..." },
  { key: "groq" as const, label: t("aiKeys.groq"), placeholder: "gsk_..." },
] as const;

function AIKeysSection({ callGateway }: { callGateway?: (method: string, params: unknown) => Promise<unknown> }) {
  const [keyDrafts, setKeyDrafts] = useState<Record<string, string>>({ anthropic: "", gemini: "", openai: "", groq: "" });
  const [status, setStatus] = useState<AIKeysState | null>(null);
  const [saveFlash, setSaveFlash] = useState<Record<string, boolean>>({});

  const fetchStatus = useCallback(async () => {
    if (!callGateway) return;
    try {
      const result = await callGateway("ai.keys.get", {}) as AIKeysState;
      setStatus(result);
    } catch {}
  }, [callGateway]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSave = async (provider: string) => {
    if (!callGateway) return;
    const apiKey = keyDrafts[provider]?.trim() ?? "";
    try {
      const result = await callGateway("ai.keys.set", { provider, apiKey }) as { configured: boolean };
      if (result) {
        setSaveFlash((prev) => ({ ...prev, [provider]: true }));
        setTimeout(() => setSaveFlash((prev) => ({ ...prev, [provider]: false })), 1500);
        setKeyDrafts((prev) => ({ ...prev, [provider]: "" }));
        fetchStatus();
      }
    } catch {}
  };

  const handleClear = async (provider: string) => {
    if (!callGateway) return;
    try {
      await callGateway("ai.keys.set", { provider, apiKey: "" });
      fetchStatus();
    } catch {}
  };

  return (
    <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium text-white">{t("aiKeys.title")}</div>
          <div className="mt-1 text-[10px] text-white/75">{t("aiKeys.desc")}</div>
        </div>
      </div>
      <div className="mt-3 grid gap-3">
        {AI_PROVIDERS.map(({ key, label, placeholder }) => {
          const providerStatus = status?.providers?.[key];
          const isConfigured = providerStatus?.configured ?? false;
          return (
            <div key={key} className="rounded-md border border-cyan-500/10 bg-black/15 px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-medium text-white">{label}</div>
                <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${isConfigured ? "text-emerald-300/80" : "text-cyan-200/50"}`}>
                  {isConfigured ? t("aiKeys.configured") : t("aiKeys.notConfigured")}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="password"
                  value={keyDrafts[key] ?? ""}
                  onChange={(e) => setKeyDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={isConfigured ? t("aiKeys.configured") : placeholder}
                  className="min-w-0 flex-1 rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30"
                />
                <button
                  type="button"
                  onClick={() => handleSave(key)}
                  disabled={!keyDrafts[key]?.trim()}
                  className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saveFlash[key] ? t("aiKeys.saved") : t("aiKeys.save")}
                </button>
                {isConfigured ? (
                  <button
                    type="button"
                    onClick={() => handleClear(key)}
                    className="rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-rose-100 transition-colors hover:border-rose-400/40 hover:bg-rose-500/15"
                  >
                    {t("aiKeys.clear")}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NotificationSection() {
  const [permission, setPermission] = useState<string>("default");

  useEffect(() => {
    setPermission(
      isNotificationSupported() ? getNotificationPermission() : "unsupported"
    );
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? "granted" : "denied");
  };

  return (
    <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium text-white">{t("notifications.title")}</div>
          <div className="mt-1 text-[10px] text-white/75">{t("notifications.desc")}</div>
        </div>
        {permission === "granted" ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-300/80">
            {t("notifications.enabled")}
          </span>
        ) : permission === "denied" ? (
          <span className="text-[10px] text-rose-300/70">{t("notifications.denied")}</span>
        ) : permission === "unsupported" ? (
          <span className="text-[10px] text-white/40">{t("notifications.unsupported")}</span>
        ) : (
          <button
            type="button"
            onClick={handleEnable}
            className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/15"
          >
            {t("notifications.enable")}
          </button>
        )}
      </div>
    </div>
  );
}

function ExportImportSection() {
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

  const handleExport = () => {
    window.open("/api/studio/export", "_blank");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const res = await fetch("/api/studio/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: text,
        });
        if (res.ok) {
          setImportStatus("success");
          setTimeout(() => setImportStatus("idle"), 2000);
        } else {
          setImportStatus("error");
          setTimeout(() => setImportStatus("idle"), 2000);
        }
      } catch {
        setImportStatus("error");
        setTimeout(() => setImportStatus("idle"), 2000);
      }
    };
    input.click();
  };

  return (
    <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-medium text-white">{t("settings.exportImport")}</div>
          <div className="mt-1 text-[10px] text-white/75">{t("settings.exportImportDesc")}</div>
          {importStatus === "success" && (
            <div className="mt-1 text-[10px] text-emerald-300">{t("settings.importSuccess")}</div>
          )}
          {importStatus === "error" && (
            <div className="mt-1 text-[10px] text-rose-300">{t("settings.importError")}</div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/15"
          >
            {t("settings.export")}
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/15"
          >
            {t("settings.import")}
          </button>
        </div>
      </div>
    </div>
  );
}

function AboutSection() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium text-white">{t("about.title")}</div>
            <div className="mt-1 text-[10px] text-white/50">
              Claw3D v0.1.4 {t("branding.developedBy")}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAbout(true)}
            className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/15"
          >
            {t("about.details")}
          </button>
        </div>
      </div>
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  );
}

export function SettingsPanel({
  gatewayStatus,
  gatewayUrl,
  gatewayToken,
  selectedAdapterType = "openclaw",
  activeAdapterType = "openclaw",
  onGatewayDisconnect,
  onGatewayConnect,
  onGatewayUrlChange,
  onGatewayTokenChange,
  onGatewayAdapterTypeChange,
  onOpenOnboarding,
  officeTitle,
  officeTitleLoaded,
  onOfficeTitleChange,
  remoteOfficeEnabled,
  remoteOfficeSourceKind,
  remoteOfficeLabel,
  remoteOfficePresenceUrl,
  remoteOfficeGatewayUrl,
  remoteOfficeTokenConfigured,
  onRemoteOfficeEnabledChange,
  onRemoteOfficeSourceKindChange,
  onRemoteOfficeLabelChange,
  onRemoteOfficePresenceUrlChange,
  onRemoteOfficeGatewayUrlChange,
  onRemoteOfficeTokenChange,
  voiceRepliesEnabled,
  voiceRepliesVoiceId,
  voiceRepliesSpeed,
  voiceRepliesLoaded,
  onVoiceRepliesToggle,
  onVoiceRepliesVoiceChange,
  onVoiceRepliesSpeedChange,
  onVoiceRepliesPreview,
  callGateway,
}: SettingsPanelProps) {
  const normalizedGatewayUrl = gatewayUrl?.trim() ?? "";
  const normalizedGatewayToken = gatewayToken ?? "";
  const gatewayStateLabel = gatewayStatus
    ? gatewayStatus.charAt(0).toUpperCase() + gatewayStatus.slice(1)
    : "Unknown";
  const isGatewayConnected = gatewayStatus === "connected";
  const gatewayDisconnectDisabled = !isGatewayConnected;
  const gatewayConnectDisabled = normalizedGatewayUrl.length === 0;
  const tokenOptional =
    selectedAdapterType === "hermes" ||
    selectedAdapterType === "demo" ||
    selectedAdapterType === "custom";
  const [remoteOfficeTokenDraft, setRemoteOfficeTokenDraft] = useState("");

  return (
    <div className="px-4 py-4">
      {/* AI Keys Section — first, most important */}
      <AIKeysSection callGateway={callGateway} />

      <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium text-white">{t("settings.studioTitle")}</div>
            <div className="mt-1 text-[10px] text-white/75">
              {t("settings.studioTitleDesc")}
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200/70">
            {officeTitleLoaded ? t("settings.ready") : t("settings.loading")}
          </span>
        </div>
        <input
          type="text"
          value={officeTitle}
          maxLength={48}
          disabled={!officeTitleLoaded}
          onChange={(event) => onOfficeTitleChange(event.target.value)}
          placeholder={t("settings.officeTitlePlaceholder")}
          className="mt-3 w-full rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="mt-2 text-[10px] text-white/50">
          {t("settings.usedInHeader")}
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium text-white">{t("settings.gateway")}</div>
            <div className="mt-1 text-[10px] text-white/75">
              {t("settings.gatewayDesc")}
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200/70">
            {gatewayStateLabel}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              ["demo", t("settings.demo")],
              ["hermes", t("settings.hermes")],
              ["custom", t("settings.custom")],
              ["openclaw", t("settings.openclaw")],
            ] as const
          ).map(([adapterType, label]) => {
            const selected = selectedAdapterType === adapterType;
            return (
              <button
                key={adapterType}
                type="button"
                onClick={() => onGatewayAdapterTypeChange?.(adapterType)}
                className={`rounded-md border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors ${
                  selected
                    ? "border-cyan-400/35 bg-cyan-500/12 text-cyan-50"
                    : "border-cyan-500/10 bg-black/20 text-white/75 hover:border-cyan-400/25 hover:text-cyan-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 grid gap-3">
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
              {t("connect.upstreamUrl")}
            </div>
            <input
              type="text"
              value={gatewayUrl ?? ""}
              onChange={(event) => onGatewayUrlChange?.(event.target.value)}
              placeholder={
                selectedAdapterType === "custom"
                  ? "http://localhost:7770"
                  : "ws://localhost:18789"
              }
              className="w-full rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 font-mono text-[11px] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30"
            />
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
              {tokenOptional ? t("connect.upstreamTokenOptional") : t("connect.upstreamToken")}
            </div>
            <input
              type="password"
              value={normalizedGatewayToken}
              onChange={(event) => onGatewayTokenChange?.(event.target.value)}
              placeholder={tokenOptional ? t("connect.upstreamTokenOptional") : t("connect.upstreamToken")}
              className="w-full rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-white/60">
          <span className="font-mono">
            {t("connect.eachBackendSaves")}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-[10px] text-white/60">
            {t("settings.connectToApply")}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onGatewayConnect?.()}
              disabled={gatewayConnectDisabled}
              className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-50 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {gatewayStatus === "connecting" ? t("settings.connectingBtn") : t("settings.connectBtn")}
            </button>
            <button
              type="button"
              onClick={() => onGatewayDisconnect?.()}
              disabled={gatewayDisconnectDisabled}
              className="rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-rose-100 transition-colors hover:border-rose-400/40 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("settings.disconnectGateway")}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium text-white">{t("settings.remoteOffice")}</div>
            <div className="mt-1 text-[10px] text-white/75">
              {t("settings.remoteOfficeDesc")}
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200/70">
            {remoteOfficeEnabled ? t("settings.enabled") : t("settings.disabled")}
          </span>
        </div>
        <div className="ui-settings-row mt-3 flex min-h-[72px] items-center justify-between gap-6 rounded-lg border border-cyan-500/10 bg-black/15 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-label={t("settings.remoteOffice")}
              aria-checked={remoteOfficeEnabled}
              className={`ui-switch self-center ${remoteOfficeEnabled ? "ui-switch--on" : ""}`}
              onClick={() => onRemoteOfficeEnabledChange(!remoteOfficeEnabled)}
            >
              <span className="ui-switch-thumb" />
            </button>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-white">{t("settings.showSecondOffice")}</span>
              <span className="text-[10px] text-white/80">
                {t("settings.remoteAgentsReadonly")}
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200/70">
            {remoteOfficeTokenConfigured ? t("settings.tokenSet") : t("settings.noToken")}
          </span>
        </div>
        <div className="mt-3 grid gap-3">
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
              {t("settings.sourceType")}
            </div>
            <select
              value={remoteOfficeSourceKind}
              onChange={(event) =>
                onRemoteOfficeSourceKindChange(
                  event.target.value as "presence_endpoint" | "openclaw_gateway"
                )
              }
              className="w-full rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] text-cyan-100 outline-none transition-colors focus:border-cyan-400/30"
            >
              <option value="presence_endpoint">{t("settings.presenceEndpoint")}</option>
              <option value="openclaw_gateway">{t("settings.openclawGateway")}</option>
            </select>
            <div className="mt-1 text-[10px] text-white/50">
              {t("settings.presenceHint")} {t("settings.gatewayHint")}
            </div>
          </div>
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
              {t("settings.label")}
            </div>
            <input
              type="text"
              value={remoteOfficeLabel}
              maxLength={48}
              onChange={(event) => onRemoteOfficeLabelChange(event.target.value)}
              placeholder={t("settings.remoteOffice")}
              className="w-full rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30"
            />
          </div>
          {remoteOfficeSourceKind === "presence_endpoint" ? (
            <>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
                  {t("settings.presenceUrl")}
                </div>
                <input
                  type="url"
                  value={remoteOfficePresenceUrl}
                  onChange={(event) => onRemoteOfficePresenceUrlChange(event.target.value)}
                  placeholder="https://other-office.example.com/api/office/presence"
                  className="w-full rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30"
                />
                <div className="mt-1 text-[10px] text-white/50">
                  {t("settings.presenceUrlHint")}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
                  {t("settings.optionalToken")}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={remoteOfficeTokenDraft}
                    onChange={(event) => setRemoteOfficeTokenDraft(event.target.value)}
                    placeholder={remoteOfficeTokenConfigured ? t("settings.tokenConfigured") : t("settings.enterToken")}
                    className="min-w-0 flex-1 rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onRemoteOfficeTokenChange(remoteOfficeTokenDraft);
                      setRemoteOfficeTokenDraft("");
                    }}
                    className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/15"
                  >
                    {t("settings.save")}
                  </button>
                  {remoteOfficeTokenConfigured ? (
                    <button
                      type="button"
                      onClick={() => {
                        onRemoteOfficeTokenChange("");
                        setRemoteOfficeTokenDraft("");
                      }}
                      className="rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-rose-100 transition-colors hover:border-rose-400/40 hover:bg-rose-500/15"
                    >
                      {t("settings.clear")}
                    </button>
                  ) : null}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
                  {t("settings.gatewayUrl")}
                </div>
                <input
                  type="text"
                  value={remoteOfficeGatewayUrl}
                  onChange={(event) => onRemoteOfficeGatewayUrlChange(event.target.value)}
                  placeholder="wss://remote-gateway.example.com"
                  className="w-full rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30"
                />
                <div className="mt-1 text-[10px] text-white/50">
                  {t("settings.gatewayUrlHint")}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
                  {t("settings.sharedGatewayToken")}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={remoteOfficeTokenDraft}
                    onChange={(event) => setRemoteOfficeTokenDraft(event.target.value)}
                    placeholder={remoteOfficeTokenConfigured ? t("settings.tokenConfigured") : t("settings.enterToken")}
                    className="min-w-0 flex-1 rounded-md border border-cyan-500/10 bg-black/25 px-3 py-2 text-[11px] text-cyan-100 outline-none transition-colors placeholder:text-cyan-100/30 focus:border-cyan-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onRemoteOfficeTokenChange(remoteOfficeTokenDraft);
                      setRemoteOfficeTokenDraft("");
                    }}
                    className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-cyan-100 transition-colors hover:border-cyan-400/40 hover:bg-cyan-500/15"
                  >
                    {t("settings.save")}
                  </button>
                  {remoteOfficeTokenConfigured ? (
                    <button
                      type="button"
                      onClick={() => {
                        onRemoteOfficeTokenChange("");
                        setRemoteOfficeTokenDraft("");
                      }}
                      className="rounded-md border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-rose-100 transition-colors hover:border-rose-400/40 hover:bg-rose-500/15"
                    >
                      {t("settings.clear")}
                    </button>
                  ) : null}
                </div>
                <div className="mt-1 text-[10px] text-white/50">
                  {t("settings.sharedTokenHint")}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium text-white">{t("settings.onboarding")}</div>
            <div className="mt-1 text-[10px] text-white/75">
              {t("settings.onboardingDesc")}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenOnboarding?.()}
            className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-100 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/15"
          >
            {t("settings.launchWizard")}
          </button>
        </div>
      </div>
      <div className="ui-settings-row mt-3 flex min-h-[72px] items-center justify-between gap-6 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-label={t("settings.voiceReplies")}
            aria-checked={voiceRepliesEnabled}
            className={`ui-switch self-center ${voiceRepliesEnabled ? "ui-switch--on" : ""}`}
            onClick={() => onVoiceRepliesToggle(!voiceRepliesEnabled)}
            disabled={!voiceRepliesLoaded}
          >
            <span className="ui-switch-thumb" />
          </button>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-white">{t("settings.voiceReplies")}</span>
            <span className="text-[10px] text-white/80">
              {t("settings.voiceRepliesDesc")}
            </span>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200/70">
          {voiceRepliesLoaded ? (voiceRepliesEnabled ? t("settings.on") : t("settings.off")) : t("settings.loading")}
        </span>
      </div>
      <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
        <div className="text-[11px] font-medium text-white">{t("settings.voice")}</div>
        <div className="mt-1 text-[10px] text-white/75">
          {t("settings.voiceDesc")}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {CURATED_ELEVENLABS_VOICES.map((voice) => {
            const selected = voice.id === voiceRepliesVoiceId;
            return (
              <button
                key={voice.id ?? "default"}
                type="button"
                onClick={() => {
                  onVoiceRepliesVoiceChange(voice.id);
                  onVoiceRepliesPreview(voice.id, voice.label);
                }}
                disabled={!voiceRepliesLoaded}
                className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                  selected
                    ? "border-cyan-400/40 bg-cyan-500/12 text-white"
                    : "border-cyan-500/10 bg-black/15 text-white/80 hover:border-cyan-400/20 hover:bg-cyan-500/6"
                }`}
              >
                <div className="text-[11px] font-medium">{voice.label}</div>
                <div className="mt-1 text-[10px] text-white/65">{voice.description}</div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-cyan-500/10 bg-black/20 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-medium text-white">{t("settings.speed")}</div>
            <div className="mt-1 text-[10px] text-white/75">
              {t("settings.speedDesc")}
            </div>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200/70">
            {voiceRepliesSpeed.toFixed(2)}x
          </span>
        </div>
        <input
          type="range"
          min="0.7"
          max="1.2"
          step="0.05"
          value={voiceRepliesSpeed}
          disabled={!voiceRepliesLoaded}
          onChange={(event) =>
            onVoiceRepliesSpeedChange(Number.parseFloat(event.target.value))
          }
          className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-cyan-500/15 accent-cyan-400"
        />
        <div className="mt-1 flex items-center justify-between text-[10px] text-white/45">
          <span>{t("settings.slower")}</span>
          <span>{t("settings.faster")}</span>
        </div>
      </div>
      {/* Notifications */}
      <NotificationSection />
      {/* Export/Import */}
      <ExportImportSection />
      {/* About Section */}
      <AboutSection />
    </div>
  );
}
