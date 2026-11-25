// Have You Tried Turning It Off? — make.fun entry.
// Writes one funny line a hopeless tech support agent gives a desperate
// customer (91 chars) to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Pure Node standard library only; deterministic; no network, no paid APIs.
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I've escalated your ticket to Tier 2 \u2014 that's me again, but I'll answer in a deeper voice.";

// The gate allows 1-199 characters; keep the bounds named so a later tweak
// to the line cannot silently break the entry.
const MIN_CHARS = 1;
const MAX_CHARS = 199;

function main(): void {
  // Guard: the entry must stay exactly one line, 1-199 chars, no whitespace-only,
  // and no leading/trailing whitespace (the judge reads the file as submitted).
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  if (LINE.length < MIN_CHARS || LINE.length > MAX_CHARS) {
    throw new Error(
      `entry line must be ${MIN_CHARS}-${MAX_CHARS} chars, got ${LINE.length}`,
    );
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (LINE !== LINE.trim()) {
    throw new Error("entry line must not have leading or trailing whitespace");
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
