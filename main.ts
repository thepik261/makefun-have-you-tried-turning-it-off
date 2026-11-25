// Have You Tried Turning It Off? — make.fun entry.
// Writes one funny line a hopeless tech support agent gives a desperate
// customer (91 chars) to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Pure Node standard library only; deterministic; no network, no paid APIs.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I've escalated your ticket to Tier 2 \u2014 that's me again, but I'll answer in a deeper voice.";

function main(): void {
  // Guard: the entry must stay exactly one line, 1-199 chars, no whitespace-only.
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (LINE.length < 1 || LINE.length > 199) {
    throw new Error(`entry line must be 1-199 chars, got ${LINE.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, LINE, "utf8");
  chmodSync(target, 0o644);
  const back = readFileSync(target, "utf8");
  if (back !== LINE) {
    throw new Error("read-back mismatch");
  }
}

main();
