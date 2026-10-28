// src/session.js
// Durable séance sessions (Temporal-style): a séance survives restarts.
// Each session is appended to a local JSONL log; on startup we replay it
// so the spirits can pick up where they left off.

import * as fs from "node:fs";
import * as path from "node:path";

const LOG_DIR = process.env.SEANCE_LOG_DIR || "./séance-logs";

export function ensureLogDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/** Append one séance turn to the durable log. */
export function appendSession({ spiritId, question, answer, fingerprint }) {
  ensureLogDir();
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    spiritId,
    question,
    answer,
    fingerprint,
  })+"\n";
  fs.appendFileSync(path.join(LOG_DIR, "sessions.jsonl"), line);
  return line;
}

/** Replay past sessions for a spirit (durable memory across restarts). */
export function replaySessions({ spiritId, limit = 10 }) {
  ensureLogDir();
  const file = path.join(LOG_DIR, "sessions.jsonl");
  if (!fs.existsSync(file)) return [];
  const lines = fs
    .readFileSync(file, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .filter((e) => e.spiritId === spiritId);
  return lines.slice(-limit);
}

/** Temporal hook point: wrap a séance turn so it can be retried / resumed. */
export async function durableTurn(operation, fn) {
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 200 * attempt));
    }
  }
  throw lastErr;
}
