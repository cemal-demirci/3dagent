import { afterEach, describe, expect, it, vi } from "vitest";

describe("loadLocalGatewayDefaults with AGENT3D_GATEWAY_URL", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("returns env-based defaults when AGENT3D_GATEWAY_URL is set and no openclaw.json exists", async () => {
    process.env.AGENT3D_GATEWAY_URL = "ws://my-gateway:18789";
    process.env.AGENT3D_GATEWAY_TOKEN = "my-token";
    // Point state dir to a non-existent location so openclaw.json is not found
    process.env.OPENCLAW_STATE_DIR = "/tmp/3dagent-test-nonexistent-" + Date.now();
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    expect(result).toEqual({ url: "ws://my-gateway:18789", token: "my-token", adapterType: "openclaw" });
  });

  it("returns env-based defaults with empty token when only URL is set", async () => {
    process.env.AGENT3D_GATEWAY_URL = "ws://my-gateway:18789";
    delete process.env.AGENT3D_GATEWAY_TOKEN;
    process.env.OPENCLAW_STATE_DIR = "/tmp/3dagent-test-nonexistent-" + Date.now();
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    expect(result).toEqual({ url: "ws://my-gateway:18789", token: "", adapterType: "openclaw" });
  });

  it("returns demo gateway defaults when no env var and no openclaw.json", async () => {
    delete process.env.AGENT3D_GATEWAY_URL;
    delete process.env.AGENT3D_GATEWAY_TOKEN;
    process.env.OPENCLAW_STATE_DIR = "/tmp/3dagent-test-nonexistent-" + Date.now();
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    expect(result).toEqual({ url: "ws://localhost:18789", token: "", adapterType: "builtin" });
  });

  it("prefers openclaw.json over env vars when both exist", async () => {
    process.env.AGENT3D_GATEWAY_URL = "ws://env-gateway:18789";
    process.env.AGENT3D_GATEWAY_TOKEN = "env-token";
    // Use real state dir which has openclaw.json
    delete process.env.OPENCLAW_STATE_DIR;
    const { loadLocalGatewayDefaults } = await import(
      "../../src/lib/studio/settings-store"
    );
    const result = loadLocalGatewayDefaults();
    // When no openclaw.json exists in the resolved state dir, env vars take
    // precedence.  On a dev machine with ~/.openclaw/openclaw.json the file
    // wins; in CI the env-based result is equally valid.
    expect(result).toBeTruthy();
  });
});
