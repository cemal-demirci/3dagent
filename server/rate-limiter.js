/**
 * In-memory rate limiter — zero dependencies.
 *
 * Sliding window per IP. Configurable via env:
 *   RATE_LIMIT_WINDOW_MS  (default 60000 = 1 min)
 *   RATE_LIMIT_MAX        (default 120 requests per window)
 */

function createRateLimiter(options) {
  const windowMs = Number(options?.windowMs ?? process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
  const max = Number(options?.max ?? process.env.RATE_LIMIT_MAX ?? 120);

  /** @type {Map<string, number[]>} */
  const hits = new Map();

  // Cleanup stale entries every 5 minutes
  const cleanup = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    for (const [ip, timestamps] of hits) {
      const valid = timestamps.filter((t) => t > cutoff);
      if (valid.length === 0) hits.delete(ip);
      else hits.set(ip, valid);
    }
  }, 5 * 60_000);
  cleanup.unref();

  const getIP = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
    return req.socket?.remoteAddress ?? "unknown";
  };

  /**
   * Returns true if the request is rate-limited (and response was sent).
   * Returns false if the request is allowed.
   */
  const handleHttp = (req, res) => {
    const pathname = req.url?.split("?")[0] ?? "/";

    // Only rate-limit API routes
    if (!pathname.startsWith("/api/")) return false;

    // Skip WebSocket upgrade paths
    if (pathname === "/api/gateway/ws") return false;

    const ip = getIP(req);
    const now = Date.now();
    const cutoff = now - windowMs;

    const timestamps = hits.get(ip) ?? [];
    const valid = timestamps.filter((t) => t > cutoff);
    valid.push(now);
    hits.set(ip, valid);

    const remaining = Math.max(0, max - valid.length);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil((cutoff + windowMs) / 1000)));

    if (valid.length > max) {
      res.statusCode = 429;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Retry-After", String(Math.ceil(windowMs / 1000)));
      res.end(JSON.stringify({ error: "Too many requests. Please try again later." }));
      return true;
    }

    return false;
  };

  return { handleHttp };
}

module.exports = { createRateLimiter };
