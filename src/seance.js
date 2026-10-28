// src/seance.js
// Séance — Ghost in the Machine. An offline séance chatbot that channels
// the spirits of dead programming languages using open-source AI at its core.
//
// Usage:
//   node src/seance.js              # interactive séance
//   node src/seance.js --list       # list spirits
//   node src/seance.js --spirit COBOL --ask "What is a paragraph?"
//   node src/seance.js --spirit LISP  # conjure one spirit and chat

import { SPIRITS, findSpirit, spiritProgram } from "./spirits.js";
import { conjure, spiritFingerprint } from "./model.js";
import { remember, recall, close as closeMemory } from "./memory.js";
import { traceSéance } from "./tracing.js";
import { groundQuestion } from "./search.js";
import { speak } from "./voice.js";
import { appendSession, replaySessions, durableTurn } from "./session.js";

const SPIRIT_ID = (process.env.SEANCE_SPIRIT || "cobol").toLowerCase();

function log(...args) {
  process.stderr.write(args.join(" ") + "\n");
}

function pad(text, len) {
  const t = String(text);
  return t.length >= len ? t : t + " ".repeat(len - t.length);
}

function printSpiritCard(spirit) {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  🕯️  SÉANCE — ${pad(spirit.name.toUpperCase(), 42)}║
║  Era: ${pad(spirit.era, 52)}║
║  Grave: ${pad(spirit.grave, 52)}║
║  Epitaph: "${pad(spirit.epitaph, 50)}"                              ║
║  Style: ${pad(spirit.style, 52)}║
║  Last words: ${pad(spirit.sample, 48)}║
║                                                              ║
║  The spirit of ${pad(spirit.name, 37)}has been summoned. Ask it anything.   ║
║  Type 'quit', 'exit', or 'bye' to close the séance.               ║
║  Type 'spirits' to list all available spirits.                    ║
║  Type 'history' to replay past séances for this spirit.           ║
╚═══════════════════════════════════════════════════════════════╝
`);
}


async function main() {
  const args = process.argv.slice(2);
  const list = args.includes("--list") || args.includes("-l");

  let spiritId = SPIRIT_ID;
  let askArg = null;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--spirit" || a.startsWith("--spirit=")) {
      spiritId = a.startsWith("--spirit=") ? a.split("=")[1] : args[++i];
    } else if (a === "--ask" || a.startsWith("--ask=")) {
      askArg = a.startsWith("--ask=") ? a.split("=")[1] : args[++i];
    }
  }

  if (list) {
    console.log("Available spirits (dead programming languages):\n");
    console.log(spiritProgram());
    console.log(
      `\nConjure one: node src/seance.js --spirit COBOL --ask "Your question?"`
    );
    return;
  }

  const spirit = findSpirit(spiritId);

  // One-shot mode
  if (askArg) {
    const question = askArg.split("=")[1];
    return oneShot(spirit, question);
  }

  // Interactive mode
  interactive(spirit);
}

async function oneShot(spirit, question) {
  let answer, source;
  await durableTurn("conjure", async () => {
    const grounded = await groundQuestion(question);
    const full = grounded
      ? `${question}\n\nHistorical context from the web:\n${grounded}`
      : question;
    const res = await conjure(spirit, full);
    answer = res.answer;
    source = res.source;
  });

  const fingerprint = spiritFingerprint(spirit.id, question);
  await traceSéance("conjure", async () => {
    await appendSession({ spiritId: spirit.id, question, answer, fingerprint });
    await remember({ spiritId: spirit.id, question, answer, fingerprint });
  });

  const spoken = await speak(answer, {
    voiceId: process.env.ELEVENLABS_VOICE_ID,
  });

  console.log(`\n${spirit.name} whispers:\n`);
  console.log(answer);
  console.log(`\n[source: ${source}]`);
  if (spoken.spoken) console.log(`[voice: ${spoken.path} (${spoken.bytes} bytes)]`);
  else if (spoken.reason) console.log(`[voice: ${spoken.reason}]`);

  await closeMemory();
}

async function interactive(spirit) {
  printSpiritCard(spirit);

  // Replay past séances for this spirit (durable memory).
  const history = replaySessions({ spiritId: spirit.id, limit: 3 });
  if (history.length) {
    console.log("━ Past séances with this spirit ━");
    for (const h of history) {
      console.log(`  You: ${h.question}`);
      console.log(`  ${spirit.name}: ${h.answer}`);
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  }

  const readline = await import("node:readline/promises");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.prompt();
  rl.on("line", async (line) => {
    const cmd = line.trim().toLowerCase();
    if (cmd === "quit" || cmd === "exit" || cmd === "bye") {
      console.log(`\n${spirit.name} fades away... 👋`);
      rl.close();
      await closeMemory();
      process.exit(0);
    }
    if (cmd === "spirits") {
      console.log(spiritProgram());
      rl.prompt();
      return;
    }
    if (cmd === "history") {
      const h = replaySessions({ spiritId: spirit.id, limit: 5 });
      console.log(h.map((e) => `  ${e.ts}  Q: ${e.question}\n     A: ${e.answer}`).join("\n") || "  (none yet)");
      rl.prompt();
      return;
    }
    if (!cmd) {
      rl.prompt();
      return;
    }

    let answer, source;
    try {
      const grounded = await groundQuestion(cmd);
      const full = grounded
        ? `${cmd}\n\nHistorical context from the web:\n${grounded}`
        : cmd;
      const res = await conjure(spirit, full);
      answer = res.answer;
      source = res.source;
    } catch (err) {
      answer = `The séance flickers... ${err.message}`;
      source = "error";
    }

    const fingerprint = spiritFingerprint(spirit.id, cmd);
    await traceSéance("conjure", async () => {
      await appendSession({ spiritId: spirit.id, question: cmd, answer, fingerprint });
      await remember({ spiritId: spirit.id, question: cmd, answer, fingerprint });
    });

    const spoken = await speak(answer, {
      voiceId: process.env.ELEVENLABS_VOICE_ID,
    });

    console.log(`\n${spirit.name} whispers: ${answer}`);
    console.log(`[source: ${source}]`);
    if (spoken.spoken) console.log(`[voice: ${spoken.path}]`);
    rl.prompt();
  });

  rl.on("close", () => {
    closeMemory();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error("Séance failed:", err.message);
  process.exit(1);
});
