// src/voice.js
// ElevenLabs voice for the séance — narration for the whispers.
// Opt-in; requires ELEVENLABS_API_KEY. Silent otherwise.

const API_BASE = "https://api.elevenlabs.io/v1";

export async function speak(text, { voiceId, model = "eleven_multilingual_v2" } = {}) {
  const key = process.env.ELEVENLABS_API_KEY;
  const vId = voiceId || process.env.ELEVENLABS_VOICE_ID;
  if (!key || !vId) {
    return { spoken: false, reason: "no ELEVENLABS_API_KEY / ELEVENLABS_VOICE_ID" };
  }
  try {
    const res = await fetch(`${API_BASE}/text-to-speech/${vId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": key,
      },
      body: JSON.stringify({ text, model_id: model }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return { spoken: false, reason: `ElevenLabs ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    const fs = await import("node:fs");
    const path = `./séance-logs/whisper-${Date.now()}.mp3`;
    fs.mkdirSync("./séance-logs", { recursive: true });
    fs.writeFileSync(path, buf);
    return { spoken: true, path, bytes: buf.length };
  } catch (err) {
    return { spoken: false, reason: String(err) };
  }
}
