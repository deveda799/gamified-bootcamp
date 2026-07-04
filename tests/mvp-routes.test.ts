import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
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

test("student H5 keeps all required MVP pages", () => {
  const pages = pageFiles("app").filter((path) => path !== "app/page.tsx");

  const requiredPages = [
    "app/(student)/app/course/[lessonId]/page.tsx",
    "app/(student)/app/course/page.tsx",
    "app/(student)/app/growth/page.tsx",
    "app/(student)/app/home/page.tsx",
    "app/(student)/app/submit/[lessonId]/page.tsx",
    "app/login/page.tsx",
    "app/admin/login/page.tsx",
    "app/admin/page.tsx"
  ];

  for (const page of requiredPages) {
    assert.ok(pages.includes(page), `${page} must exist`);
  }
});

test("SQLite MVP exposes the required server route handlers", () => {
  const routeFiles = readdirSync("app", { recursive: true })
    .map(String)
    .map((path) => path.replaceAll("\\", "/"))
    .filter((path) => path.endsWith("/route.ts"));

  for (const route of [
    "api/session/route.ts",
    "api/progress/route.ts",
    "api/check-ins/route.ts",
    "api/submissions/route.ts",
    "api/leaderboard/route.ts",
    "api/admin/session/route.ts"
  ]) {
    assert.ok(routeFiles.includes(route), `${route} must exist`);
  }
});

test("root renders the student home without a redirect response", () => {
  const source = readFileSync("app/page.tsx", "utf8");

  assert.doesNotMatch(source, /redirect\(/);
  assert.match(source, /NicknameLoginForm/);
});
