/**
 * Structured JSON logger — zero dependencies.
 *
 * Outputs newline-delimited JSON to stdout/stderr.
 * Set LOG_LEVEL env to: debug, info, warn, error (default: info)
 */

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const LOG_LEVEL = LEVELS[process.env.LOG_LEVEL?.toLowerCase() ?? "info"] ?? LEVELS.info;

function formatEntry(level, msg, extra) {
  return JSON.stringify({
    time: new Date().toISOString(),
    level,
    msg,
    ...extra,
  });
}

const logger = {
  debug(msg, extra) {
    if (LOG_LEVEL > LEVELS.debug) return;
    process.stdout.write(formatEntry("debug", msg, extra) + "\n");
  },
  info(msg, extra) {
    if (LOG_LEVEL > LEVELS.info) return;
    process.stdout.write(formatEntry("info", msg, extra) + "\n");
  },
  warn(msg, extra) {
    if (LOG_LEVEL > LEVELS.warn) return;
    process.stderr.write(formatEntry("warn", msg, extra) + "\n");
  },
  error(msg, extra) {
    process.stderr.write(formatEntry("error", msg, extra) + "\n");
  },
};

module.exports = { logger };
