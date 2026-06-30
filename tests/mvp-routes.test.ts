import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function pageFiles(root: string): string[] {
  return readdirSync(root).flatMap((name) => {
    const path = join(root, name);
    return statSync(path).isDirectory()
      ? pageFiles(path)
      : path.endsWith("page.tsx")
        ? [path.replaceAll("\\", "/")]
        : [];
  });
}

test("student H5 keeps only the five MVP pages", () => {
  const pages = pageFiles("app").filter((path) => path !== "app/page.tsx");

  assert.deepEqual(pages.sort(), [
    "app/(student)/app/course/[lessonId]/page.tsx",
    "app/(student)/app/course/page.tsx",
    "app/(student)/app/growth/page.tsx",
    "app/(student)/app/home/page.tsx",
    "app/(student)/app/submit/[lessonId]/page.tsx"
  ]);
});

test("H5 MVP exposes no API route handlers", () => {
  const routeFiles = readdirSync("app", { recursive: true })
    .map(String)
    .filter((path) => path.replaceAll("\\", "/").endsWith("/route.ts"));

  assert.deepEqual(routeFiles, []);
});
