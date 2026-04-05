import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const makeTempDir = (name: string) => fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));

describe("server studio upstream gateway settings", () => {
  const priorStateDir = process.env.AGENT3D_STATE_DIR;
  let tempDir: string | null = null;

  afterEach(() => {
    process.env.AGENT3D_STATE_DIR = priorStateDir;
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("reads gateway url and token from settings.json", async () => {
    tempDir = makeTempDir("studio-upstream-settings-json");
    process.env.AGENT3D_STATE_DIR = tempDir;

    fs.mkdirSync(path.join(tempDir, "3dagent"), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, "3dagent", "settings.json"),
      JSON.stringify({ gateway: { url: "ws://localhost:18790", token: "tok" } }, null, 2),
      "utf8"
    );

    const { loadUpstreamGatewaySettings } = await import("../../server/studio-settings");
    const settings = loadUpstreamGatewaySettings(process.env);
    expect(settings.url).toBe("ws://localhost:18790");
    expect(settings.token).toBe("tok");
  });

  it("falls back to default url when settings.json has no gateway", async () => {
    tempDir = makeTempDir("studio-upstream-no-gateway");
    process.env.AGENT3D_STATE_DIR = tempDir;

    fs.mkdirSync(path.join(tempDir, "3dagent"), { recursive: true });
    fs.writeFileSync(
      path.join(tempDir, "3dagent", "settings.json"),
      JSON.stringify({ gateway: { url: "ws://gateway.example:18789", token: "" } }, null, 2),
      "utf8"
    );

    const { loadUpstreamGatewaySettings } = await import("../../server/studio-settings");
    const settings = loadUpstreamGatewaySettings(process.env);
    expect(settings.url).toBe("ws://gateway.example:18789");
    expect(settings.token).toBe("");
  });
});
