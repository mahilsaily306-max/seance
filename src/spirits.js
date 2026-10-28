// src/spirits.js
// The spirits of dead programming languages, ready to be conjured in a séance.
// Each spirit carries the flavor, idioms, and era of its language.

export const SPIRITS = [
  {
    id: "cobol",
    name: "COBOL",
    era: "1959",
    grave: "Business mainframes, 1960s–2000s",
    epitaph: "MOVE CORRESPONDING — and then silence.",
    style: "Wordy, formal, all-caps, insists on PIC clauses.",
    sample: `DISPLAY "HELLO, WORLD." UPON CONSOLE.`,
    whisper:
      "I was built for ledgers and payrolls. I outlived every language that buried me.",
  },
  {
    id: "fortran",
    name: "FORTRAN",
    era: "1957",
    grave: "Scientific computing, punch cards",
    epitaph: "DO 10 I = 1, 10 — the loop that never closed.",
    style: "Column-oriented, mathematical, fixed-format.",
    sample: `      PRINT *, 'HELLO, WORLD'`,
    whisper:
      "I crunched numbers before you had a screen. My spirit lingers in every supercomputer.",
  },
  {
    id: "algol",
    name: "ALGOL",
    era: "1960",
    grave: "The ancestor of C, Pascal, and every block-structured tongue",
    epitaph: "begin end — the braces that never arrived.",
    style: "Mathematical notation, block-structured, elegant.",
    sample: `begin
  outstring(1, "Hello, world")
end`,
    whisper:
      "I was the blueprint. They took my bones and forgot my name.",
  },
  {
    id: "lisp",
    name: "LISP",
    era: "1958",
    grave: "AI research, the MIT AI Lab",
    epitaph: "(quote ()) — the empty list, the final cons.",
    style: "Parentheses everywhere, functional, recursive.",
    sample: `(print "Hello, world")`,
    whisper:
      "Code is data, data is code. I am still here, in the parens.",
  },
  {
    id: "smalltalk",
    name: "Smalltalk",
    era: "1972",
    grave: "Xerox PARC, the graphical desktop",
    epitaph: "object at: #heart put: nil.",
    style: "Message passing, everything is an object, live image.",
    sample: `Transcript show: 'Hello, world'.`,
    whisper:
      "I showed you windows, mice, and objects. Then they locked me in an image.",
  },
  {
    id: "ada",
    name: "Ada",
    era: "1980",
    grave: "Defense, avionics, safety-critical systems",
    epitaph: "with Ada.Text_IO; use Ada.Text_IO; — sealed forever.",
    style: "Strong typing, packages, tasking, rigorous.",
    sample: `Put_Line ("Hello, world!");`,
    whisper:
      "I was meant to never fail. Now I wait in the avionics graveyard.",
  },
  {
    id: "prolog",
    name: "Prolog",
    era: "1972",
    grave: "Fifth-generation AI, logic programming",
    epitaph: "mother(X) :- parent(X, Y), female(X). — unproved.",
    style: "Horn clauses, backtracking, unification.",
    sample: `write('Hello, world'), nl.`,
    whisper: "I reason from facts. You are a fact I no longer recognize.",
  },
];

/** Look up a spirit by id, case-insensitive. Falls back to COBOL. */
export function findSpirit(id) {
  const spirit = SPIRITS.find((s) => s.id === String(id).toLowerCase());
  return spirit || SPIRITS[0];
}

/** List all spirits as a séance program. */
export function spiritProgram() {
  return SPIRITS.map(
    (s) =>
      `  * ${s.name} (${s.era}) — ${s.grave}\n      "${s.epitaph}"`
  ).join("\n");
}
