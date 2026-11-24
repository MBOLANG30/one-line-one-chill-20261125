// One Line, One Chill — make.fun entry (u-azazex-one-line-one-chill-6d4d5488).
//
// Writes a single original sentence of horror to entry.txt in the output
// directory. The line is 174 characters, one sentence, one line, no gore:
// a small hotel ritual (a mint on the pillow) quietly reframes itself when
// a second mint appears for a guest who checked in under the narrator's
// own name in 1987.
//
// The program is deterministic and self-contained: no network, no reads
// outside this repository. It only creates the output directory (mkdir,
// recursive) and writes entry.txt inside it — it never deletes the output
// directory or anything in it.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one sentence, 174 Unicode code points, ending on a year.
const LINE =
  "The hotel put a mint on my pillow every night of my stay, and on the last morning there were two mints, one for me and one for the guest who checked in under my name in 1987.";

const MAX_CHARS = 200;
const MIN_CHARS = 1;

function validate(line: string): void {
  // Count Unicode code points, not UTF-16 code units.
  const length = [...line].length;
  if (length < MIN_CHARS || length > MAX_CHARS) {
    throw new Error(
      `line must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("line must not be empty or whitespace-only");
  }
  if (/[\r\n]/.test(line)) {
    throw new Error("line must be a single line with no newline characters");
  }
  if (/[\u0000-\u001F\u007F]/.test(line)) {
    throw new Error("line must not contain control characters");
  }
  if (/  /.test(line)) {
    throw new Error("line must not contain double spaces");
  }
  // Exactly one sentence: one sentence-ending mark, and it must be last.
  const endings = line.match(/[.!?]/g) ?? [];
  if (endings.length !== 1 || !/[.!?]$/.test(line)) {
    throw new Error("line must be exactly one sentence");
  }
}

function main(): void {
  validate(LINE);
  // The grader mounts the output directory; fall back to /output.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  // No trailing newline: the file holds exactly the one line, byte for byte.
  writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
}

main();
