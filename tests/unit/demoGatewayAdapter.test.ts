import { describe, expect, it } from "vitest";

const { handleMethod } = await import("../../server/demo-gateway-adapter.js");

describe("demo-gateway-adapter", () => {
  it("supports cron mutations (add, run, remove)", async () => {
    const addResult = await handleMethod("cron.add", { name: "Test Job", task: "Do something", schedule: "0 * * * *" }, "1", () => {});
    expect(addResult).toMatchObject({
      type: "res",
      id: "1",
      ok: true,
    });

    const jobId = ("payload" in addResult) ? (addResult as { payload: { id: string } }).payload.id : undefined;
    expect(typeof jobId).toBe("string");

    const runResult = await handleMethod("cron.run", { id: jobId }, "2", () => {});
    expect(runResult).toMatchObject({
      type: "res",
      id: "2",
      ok: true,
    });

    const removeResult = await handleMethod("cron.remove", { id: jobId }, "3", () => {});
    expect(removeResult).toMatchObject({
      type: "res",
      id: "3",
      ok: true,
    });
  });
});
