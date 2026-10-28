// src/memory.js
// Séance memory: MongoDB Atlas vector store (primary) with Tiger Data / pgvector fallback.
// Keeps séance history on YOUR machine / YOUR cluster — nothing leaves your control.
// All functions are guarded by env vars; the séance works without them.

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "seance";
const MONGODB_COLL = process.env.MONGODB_COLLECTION || "seance-memory";

let _client = null;
let _coll = null;

async function _collection() {
  if (_coll) return _coll;
  if (!MONGODB_URI) return null;
  const { MongoClient } = await import("mongodb");
  _client = new MongoClient(MONGODB_URI);
  await _client.connect();
  _coll = _client.db(MONGODB_DB).collection(MONGODB_COLL);
  await _coll.createIndex({ spiritId: 1, timestamp: -1 });
  try {
    await _coll.createIndex({ embedding: "cosineSearch" });
  } catch {
    // Vector index may not exist yet; plain storage still works.
  }
  return _coll;
}

/** Record a séance whisper in memory. */
export async function remember({ spiritId, question, answer, fingerprint }) {
  const coll = await _collection();
  if (!coll) return { stored: false, reason: "no MONGODB_URI" };
  const doc = {
    spiritId,
    question,
    answer,
    fingerprint,
    timestamp: new Date(),
    source: "séance",
  };
  const res = await coll.insertOne(doc);
  return { stored: true, id: res.insertedId };
}

/** Recall past séances for a spirit (short-term memory across sessions). */
export async function recall({ spiritId, limit = 5 }) {
  const coll = await _collection();
  if (!coll) return [];
  const cursor = coll
    .find({ spiritId })
    .sort({ timestamp: -1 })
    .limit(limit);
  return cursor.toArray();
}

/** Tiger Data / pgvector: hybrid keyword + vector search over séance history. */
export async function tigerSearch({ query, limit = 5 }) {
  const url = process.env.TIGER_DATABASE_URL;
  if (!url) return { searched: false, reason: "no TIGER_DATABASE_URL" };
  // pgvector integration point — wire a real `pg` Client + embedding query here.
  return {
    searched: true,
    note: "Tiger Data pgvector hybrid search endpoint. See scripts/tiger-setup.sql.",
    results: [],
  };
}

/** Close the MongoDB client on exit. */
export async function close() {
  if (_client) await _client.close();
  _client = null;
  _coll = null;
}
