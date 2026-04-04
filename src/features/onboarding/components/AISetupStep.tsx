/**
 * AISetupStep — Gateway auto-connect + AI provider key setup within the onboarding wizard.
 *
 * Top section: Gateway connection status (auto-connected for builtin).
 * Bottom section: AI provider key cards (all optional).
 */
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Key, Terminal, Wifi, WifiOff } from "lucide-react";
import { RunningAvatarLoader } from "@/features/agents/components/RunningAvatarLoader";
import { t } from "@/lib/i18n";

type ProviderStatus = { configured: boolean; active: boolean };

export type AISetupStepProps = {
  gatewayUrl: string;
  token: string;
  onGatewayUrlChange: (value: string) => void;
  onTokenChange: (value: string) => void;
  onConnect: () => void;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  callGateway?: (method: string, params: unknown) => Promise<unknown>;
};

const AI_PROVIDERS = [
  { key: "anthropic" as const, label: t("onboarding.connect.aiSetup.anthropic"), placeholder: "sk-ant-..." },
  { key: "gemini" as const, label: t("onboarding.connect.aiSetup.gemini"), placeholder: "AIza..." },
  { key: "openai" as const, label: t("onboarding.connect.aiSetup.openai"), placeholder: "sk-..." },
  { key: "groq" as const, label: t("onboarding.connect.aiSetup.groq"), placeholder: "gsk_..." },
] as const;

export const AISetupStep = ({
  gatewayUrl,
  token,
  onGatewayUrlChange,
  onTokenChange,
  onConnect,
  connected,
  connecting,
  error,
  callGateway,
}: AISetupStepProps) => {
  const [providerStatus, setProviderStatus] = useState<Record<string, ProviderStatus>>({});
  const [keyDrafts, setKeyDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saveFlash, setSaveFlash] = useState<Record<string, boolean>>({});
  const [showUrlForm, setShowUrlForm] = useState(false);

  // Auto-connect on mount if not already connected
  useEffect(() => {
    if (!connected && !connecting && gatewayUrl.trim()) {
      onConnect();
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch AI key status when connected
  const fetchAIStatus = useCallback(async () => {
    if (!callGateway || !connected) return;
    try {
      const result = (await callGateway("ai.keys.get", {})) as {
        providers: Record<string, ProviderStatus>;
      };
      if (result?.providers) setProviderStatus(result.providers);
    } catch {}
  }, [callGateway, connected]);

  useEffect(() => {
    void fetchAIStatus();
  }, [fetchAIStatus]);

  const handleSaveKey = useCallback(
    async (provider: string) => {
      if (!callGateway) return;
      const apiKey = keyDrafts[provider]?.trim() ?? "";
      if (!apiKey) return;
      setSaving((prev) => ({ ...prev, [provider]: true }));
      try {
        await callGateway("ai.keys.set", { provider, apiKey });
        setSaveFlash((prev) => ({ ...prev, [provider]: true }));
        setKeyDrafts((prev) => ({ ...prev, [provider]: "" }));
        setTimeout(() => setSaveFlash((prev) => ({ ...prev, [provider]: false })), 1500);
        await fetchAIStatus();
      } catch {}
      setSaving((prev) => ({ ...prev, [provider]: false }));
    },
    [callGateway, keyDrafts, fetchAIStatus],
  );

  // Fetch CLI/SDK status from gateway setup.status
  const [cliStatus, setCliStatus] = useState<{ agentSdk?: boolean; cli?: boolean } | null>(null);

  const fetchCliStatus = useCallback(async () => {
    if (!callGateway || !connected) return;
    try {
      const result = (await callGateway("setup.status", {})) as {
        agentSdk?: boolean;
        cli?: boolean;
      };
      if (result) setCliStatus(result);
    } catch {
      // setup.status may not exist on all gateways — silently ignore
    }
  }, [callGateway, connected]);

  useEffect(() => {
    void fetchCliStatus();
  }, [fetchCliStatus]);

  return (
    <div className="space-y-4">
      {/* Connection status */}
      {connected ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <p className="text-xs font-medium text-emerald-300">{t("onboarding.connect.connected")}</p>
        </div>
      ) : connecting ? (
        <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2.5">
          <RunningAvatarLoader size={16} trackWidth={32} inline />
          <p className="text-xs text-white/60">{t("onboarding.connect.connecting")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/15 bg-amber-500/5 px-3 py-2.5">
            <WifiOff className="h-4 w-4 text-amber-400" />
            <p className="text-xs text-amber-300/80">{t("onboarding.connect.notConnected")}</p>
            <button
              type="button"
              className="ml-auto text-[10px] text-amber-300 underline hover:text-amber-200"
              onClick={() => setShowUrlForm((prev) => !prev)}
            >
              {showUrlForm ? t("onboarding.back") : t("onboarding.aiSetup.showUrl")}
            </button>
          </div>
          {error ? (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          ) : null}
          {showUrlForm && (
            <div className="space-y-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-white/80">{t("onboarding.connect.gatewayUrl")}</span>
                <input
                  className="h-9 rounded-md border border-white/10 bg-white/5 px-3 font-mono text-sm text-white outline-none placeholder:text-white/30 focus:border-amber-400/50"
                  type="text"
                  value={gatewayUrl}
                  onChange={(e) => onGatewayUrlChange(e.target.value)}
                  placeholder="ws://localhost:18789"
                  spellCheck={false}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-medium text-white/80">{t("onboarding.connect.gatewayToken")}</span>
                <input
                  className="h-9 rounded-md border border-white/10 bg-white/5 px-3 font-mono text-sm text-white outline-none placeholder:text-white/30 focus:border-amber-400/50"
                  type="password"
                  value={token}
                  onChange={(e) => onTokenChange(e.target.value)}
                  placeholder="optional"
                  spellCheck={false}
                />
              </label>
              <button
                type="button"
                className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-amber-500 px-4 text-xs font-semibold text-[#1a1206] transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={onConnect}
                disabled={connecting || !gatewayUrl.trim()}
              >
                <Wifi className="h-3.5 w-3.5" />
                {t("onboarding.connect.connectBtn")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* CLI/SDK Status Badges */}
      {connected && cliStatus && (
        <div className="space-y-2">
          {cliStatus.agentSdk && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/15 bg-emerald-500/5 px-3 py-2">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-300">
                {t("setup.cliReady.claude")}
              </span>
            </div>
          )}
          {cliStatus.cli && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/15 bg-emerald-500/5 px-3 py-2">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-medium text-emerald-300">
                {t("setup.cliReady.gemini")}
              </span>
            </div>
          )}
        </div>
      )}

      {/* AI Provider Setup */}
      {connected && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Key className="h-3.5 w-3.5 text-amber-400" />
            <h3 className="text-xs font-semibold text-white">{t("onboarding.connect.aiSetup.title")}</h3>
          </div>
          <p className="text-[11px] text-white/50">{t("onboarding.connect.aiSetup.description")}</p>

          <div className="space-y-2">
            {AI_PROVIDERS.map(({ key, label, placeholder }) => {
              const status = providerStatus[key];
              const isConfigured = status?.configured ?? false;
              const isSaving = saving[key] ?? false;
              const justSaved = saveFlash[key] ?? false;

              return (
                <div
                  key={key}
                  className={`rounded-lg border px-3 py-2.5 transition-colors ${
                    isConfigured
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-white/8 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-white/80">{label}</span>
                    {isConfigured ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        {t("onboarding.connect.aiSetup.configured")}
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/30">
                        {t("onboarding.connect.aiSetup.optional")}
                      </span>
                    )}
                  </div>
                  {!isConfigured && (
                    <div className="mt-2 flex gap-2">
                      <input
                        className="h-7 flex-1 rounded border border-white/10 bg-white/5 px-2 font-mono text-[11px] text-white outline-none placeholder:text-white/25 focus:border-amber-400/50"
                        type="password"
                        value={keyDrafts[key] ?? ""}
                        onChange={(e) =>
                          setKeyDrafts((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        placeholder={placeholder}
                        spellCheck={false}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") void handleSaveKey(key);
                        }}
                      />
                      <button
                        type="button"
                        className="h-7 rounded bg-amber-500 px-3 text-[10px] font-semibold text-[#1a1206] transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isSaving || !keyDrafts[key]?.trim()}
                        onClick={() => void handleSaveKey(key)}
                      >
                        {justSaved ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : isSaving ? (
                          t("onboarding.connect.aiSetup.saving")
                        ) : (
                          t("onboarding.connect.aiSetup.save")
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-white/30">{t("onboarding.connect.aiSetup.skipHint")}</p>
        </div>
      )}
    </div>
  );
};
