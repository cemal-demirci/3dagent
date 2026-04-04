/**
 * Security headers middleware — zero dependencies.
 *
 * Adds standard security headers to all HTTP responses.
 * CORS is configurable via CORS_ORIGIN env (default: same-origin only).
 */

function createSecurityHeaders(options) {
  const corsOrigin = options?.corsOrigin ?? process.env.CORS_ORIGIN ?? "";

  const applyHeaders = (req, res) => {
    // Prevent MIME sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Prevent clickjacking
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    // XSS protection (legacy browsers)
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Referrer policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions policy (disable unnecessary browser features)
    res.setHeader(
      "Permissions-Policy",
      "camera=(), geolocation=(), payment=(), usb=()"
    );

    // HSTS — only when served over HTTPS
    const proto =
      req.headers["x-forwarded-proto"] ??
      (req.socket?.encrypted ? "https" : "http");
    if (proto === "https") {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );
    }

    // CORS — if configured
    if (corsOrigin) {
      res.setHeader("Access-Control-Allow-Origin", corsOrigin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Max-Age", "86400");

      // Handle preflight
      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return true;
      }
    }

    return false;
  };

  return { applyHeaders };
}

module.exports = { createSecurityHeaders };
