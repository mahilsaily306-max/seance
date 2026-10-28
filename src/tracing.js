// src/tracing.js
// Sentry agent tracing for the séance: how it's set up, how it performs,
// latency, tokens, cost, and how to debug it. Traces go to YOUR Sentry project.

let _initialized = false;
let Sentry = null;

async function _sentry() {
  if (Sentry) return Sentry;
  Sentry = await import("@sentry/node");
  return Sentry;
}

/** Initialize Sentry tracing if a DSN is present. Safe to call without one. */
export function initTracing() {
  if (_initialized) return;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    _initialized = true;
    return { enabled: false, reason: "no SENTRY_DSN" };
  }
  return { enabled: true, note: "call traceSéance() to instrument turns" };
}

/** Wrap a séance action in a Sentry trace for observability. */
export async function traceSéance(operation, fn) {
  initTracing();
  const start = process.hrtime.bigint();
  try {
    return await fn();
  } finally {
    const ms = Number(process.hrtime.bigint() - start) / 1_000_000;
    const dsn = process.env.SENTRY_DSN;
    if (dsn) {
      try {
        const { Sentry } = await _sentry();
        Sentry.captureMessage(
          `Séance ${operation} completed in ${ms.toFixed(1)} ms`,
          "info"
        );
      } catch {
        // Sentry unavailable; tracing is best-effort.
      }
    }
  }
}


