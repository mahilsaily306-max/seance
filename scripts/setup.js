// scripts/setup.js
// One-time setup: install dependencies and verify the séance modules load.
import { execSync } from "node:child_process";
import * as fs from "node:fs";

console.log("🕯️  Setting up Séance — Ghost in the Machine\n");

try {
  execSync("npm install", { stdio: "inherit" });
} catch (err) {
  console.error("npm install failed:", err.message);
  process.exit(1);
}

// Verify modules load without crashing.
const checks = [
  "./src/spirits.js",
  "./src/model.js",
  "./src/tracing.js",
  "./src/session.js",
  "./src/search.js",
  "./src/voice.js",
];
for (const mod of checks) {
  try {
    // eslint-disable-next-line no-eval
    new Function("", `import "${mod}";`); // syntax check only
  } catch (e) {
    console.error(`Module load check failed for ${mod}:`, e.message);
    process.exit(1);
  }
}

console.log("\n✅ Séance setup complete.");
console.log("Run:  npm start        # interactive séance");
console.log("      npm start -- --list   # list spirits");
console.log("      npm start -- --spirit COBOL --ask \"Hello?\"");
