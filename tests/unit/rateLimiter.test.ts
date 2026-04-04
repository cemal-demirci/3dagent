// @vitest-environment node

import { describe, expect, it } from "vitest";

function mockReq(url: string, ip = "127.0.0.1") {
  return { url, headers: {}, socket: { remoteAddress: ip } };
}

function mockRes() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body = "";
  return {
    get statusCode() { return statusCode; },
    set statusCode(v: number) { statusCode = v; },
    setHeader(k: string, v: string) { headers[k] = v; },
    getHeader(k: string) { return headers[k]; },
    end(b?: string) { body = b ?? ""; },
    get _body() { return body; },
    get _headers() { return headers; },
  };
}

describe("createRateLimiter", () => {
  it("allows requests under limit", async () => {
    const { createRateLimiter } = await import("../../server/rate-limiter");
    const limiter = createRateLimiter({ max: 5, windowMs: 60000 });
    const req = mockReq("/api/test");
    const res = mockRes();
    const blocked = limiter.handleHttp(req, res);
    expect(blocked).toBe(false);
    expect(res._headers["X-RateLimit-Remaining"]).toBe("4");
  });

  it("blocks after exceeding limit", async () => {
    const { createRateLimiter } = await import("../../server/rate-limiter");
    const limiter = createRateLimiter({ max: 3, windowMs: 60000 });
    const ip = "10.0.0.1";
    for (let i = 0; i < 3; i++) {
      limiter.handleHttp(mockReq("/api/test", ip), mockRes());
    }
    const res = mockRes();
    const blocked = limiter.handleHttp(mockReq("/api/test", ip), res);
    expect(blocked).toBe(true);
    expect(res.statusCode).toBe(429);
  });

  it("skips non-API routes", async () => {
    const { createRateLimiter } = await import("../../server/rate-limiter");
    const limiter = createRateLimiter({ max: 1, windowMs: 60000 });
    const res = mockRes();
    const blocked = limiter.handleHttp(mockReq("/office"), res);
    expect(blocked).toBe(false);
  });

  it("skips WebSocket gateway path", async () => {
    const { createRateLimiter } = await import("../../server/rate-limiter");
    const limiter = createRateLimiter({ max: 1, windowMs: 60000 });
    const res = mockRes();
    const blocked = limiter.handleHttp(mockReq("/api/gateway/ws"), res);
    expect(blocked).toBe(false);
  });

  it("tracks IPs independently", async () => {
    const { createRateLimiter } = await import("../../server/rate-limiter");
    const limiter = createRateLimiter({ max: 2, windowMs: 60000 });
    limiter.handleHttp(mockReq("/api/x", "1.1.1.1"), mockRes());
    limiter.handleHttp(mockReq("/api/x", "1.1.1.1"), mockRes());
    // IP1 should be at limit
    const res1 = mockRes();
    expect(limiter.handleHttp(mockReq("/api/x", "1.1.1.1"), res1)).toBe(true);
    // IP2 should still be fine
    const res2 = mockRes();
    expect(limiter.handleHttp(mockReq("/api/x", "2.2.2.2"), res2)).toBe(false);
  });
});
