// Have You Tried Turning It Off? — make.fun entry.
// Writes one funny line a hopeless tech support agent gives a desperate
// customer to $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output).
// Pure Node standard library only; deterministic; no network, no paid APIs.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The judged line: exactly 90 characters, em dash is U+2014.
// Do not change a single character of this line.
const LINE =
  "I've escalated your ticket to Tier 2 — that's me again, but I'll answer in a deeper voice.";

// The entry must be a single line of 1-199 characters, with no
// leading or trailing whitespace.
const MIN_CHARS = 1;
const MAX_CHARS = 199;

// All format checks live here so a later tweak to the line cannot
// silently break the entry: the program refuses to write bad output.
function validateLine(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (line.length < MIN_CHARS || line.length > MAX_CHARS) {
    throw new Error(
      `entry line must be ${MIN_CHARS}-${MAX_CHARS} chars, got ${line.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (line !== line.trim()) {
    throw new Error("entry line must not have leading or trailing whitespace");
  }
}

function main(): void {
  validateLine(LINE);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  // No trailing newline: the file must contain exactly the line.
  writeFileSync(target, LINE, "utf8");
  chmodSync(target, 0o644);

  const back = readFileSync(target, "utf8");
  if (back !== LINE) {
    throw new Error("read-back mismatch");
  }
}

main();
