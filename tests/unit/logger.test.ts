// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

describe("logger", () => {
  it("outputs structured JSON to stdout", async () => {
    const writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const { logger } = await import("../../server/logger");
    logger.info("test message", { key: "value" });
    expect(writeSpy).toHaveBeenCalledOnce();
    const output = writeSpy.mock.calls[0][0] as string;
    const parsed = JSON.parse(output.trim());
    expect(parsed.level).toBe("info");
    expect(parsed.msg).toBe("test message");
    expect(parsed.key).toBe("value");
    expect(parsed.time).toBeDefined();
    writeSpy.mockRestore();
  });

  it("outputs errors to stderr", async () => {
    const writeSpy = vi.spyOn(process.stderr, "write").mockImplementation(() => true);
    const { logger } = await import("../../server/logger");
    logger.error("something broke", { code: 500 });
    expect(writeSpy).toHaveBeenCalled();
    const output = writeSpy.mock.calls.find((c) =>
      (c[0] as string).includes("something broke")
    );
    expect(output).toBeDefined();
    const parsed = JSON.parse((output![0] as string).trim());
    expect(parsed.level).toBe("error");
    expect(parsed.code).toBe(500);
    writeSpy.mockRestore();
  });
});
