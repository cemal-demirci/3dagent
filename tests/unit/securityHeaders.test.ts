// @vitest-environment node

import { describe, expect, it } from "vitest";

function mockReq(method = "GET") {
  return { method, url: "/", headers: {}, socket: {} };
}

function mockRes() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let ended = false;
  return {
    get statusCode() { return statusCode; },
    set statusCode(v: number) { statusCode = v; },
    setHeader(k: string, v: string) { headers[k] = v; },
    end() { ended = true; },
    get _headers() { return headers; },
    get _ended() { return ended; },
  };
}

describe("createSecurityHeaders", () => {
  it("sets standard security headers", async () => {
    const { createSecurityHeaders } = await import("../../server/security-headers");
    const sh = createSecurityHeaders();
    const res = mockRes();
    const handled = sh.applyHeaders(mockReq(), res);
    expect(handled).toBe(false);
    expect(res._headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(res._headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    expect(res._headers["X-XSS-Protection"]).toBe("1; mode=block");
    expect(res._headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(res._headers["Permissions-Policy"]).toContain("camera=()");
  });

  it("does not set HSTS for HTTP", async () => {
    const { createSecurityHeaders } = await import("../../server/security-headers");
    const sh = createSecurityHeaders();
    const res = mockRes();
    sh.applyHeaders(mockReq(), res);
    expect(res._headers["Strict-Transport-Security"]).toBeUndefined();
  });

  it("sets HSTS for HTTPS", async () => {
    const { createSecurityHeaders } = await import("../../server/security-headers");
    const sh = createSecurityHeaders();
    const req = { method: "GET", url: "/", headers: { "x-forwarded-proto": "https" }, socket: {} };
    const res = mockRes();
    sh.applyHeaders(req, res);
    expect(res._headers["Strict-Transport-Security"]).toContain("max-age=");
  });

  it("handles CORS preflight when origin is set", async () => {
    const { createSecurityHeaders } = await import("../../server/security-headers");
    const sh = createSecurityHeaders({ corsOrigin: "https://example.com" });
    const res = mockRes();
    const handled = sh.applyHeaders(mockReq("OPTIONS"), res);
    expect(handled).toBe(true);
    expect(res.statusCode).toBe(204);
    expect(res._headers["Access-Control-Allow-Origin"]).toBe("https://example.com");
  });

  it("does not set CORS headers when origin is empty", async () => {
    const { createSecurityHeaders } = await import("../../server/security-headers");
    const sh = createSecurityHeaders({ corsOrigin: "" });
    const res = mockRes();
    sh.applyHeaders(mockReq(), res);
    expect(res._headers["Access-Control-Allow-Origin"]).toBeUndefined();
  });
});
