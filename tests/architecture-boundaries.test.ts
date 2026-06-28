import assert from "node:assert/strict";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { join } from "node:path";
import test from "node:test";

const roots = ["app", "components", "lib/application", "lib/domain"];
const forbidden = [
  /from ["']@supabase\/supabase-js["']/,
  /from ["']@supabase\/ssr["']/,
  /from ["']@\/lib\/infrastructure\/supabase/,
  /from ["']@\/lib\/supabase/,
  /from ["']@\/lib\/repositories\/.*\.supabase/
];

const legacyAllowlist = new Set([
  "app/api/check-ins/route.ts",
  "app/api/lessons/[lessonId]/complete/route.ts",
  "app/api/submissions/draft/route.ts",
  "app/api/submissions/submit/route.ts"
]);

function sourceFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);

    return statSync(path).isDirectory()
      ? sourceFiles(path)
      : /\.(ts|tsx)$/.test(path)
        ? [path]
        : [];
  });
}

test("presentation and application layers do not add Supabase dependencies", () => {
  const violations = roots.flatMap((root) =>
    sourceFiles(root).flatMap((file) => {
      const source = readFileSync(file, "utf8");
      const normalized = file.replaceAll("\\", "/");
      const violatesBoundary = forbidden.some((pattern) => pattern.test(source));

      return violatesBoundary && !legacyAllowlist.has(normalized)
        ? [normalized]
        : [];
    })
  );

  assert.deepEqual(violations, []);
});
