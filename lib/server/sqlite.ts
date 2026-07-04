import { createHash, randomBytes, randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

export type StudentRecord = {
  id: string;
  nickname: string;
};

export type ProgressRecord = {
  points: number;
  checkedInToday: boolean;
  completedLessonIds: string[];
  submittedLessonIds: string[];
};

type StoreOptions = {
  path: string;
  today?: () => string;
};

type StudentRow = {
  id: string;
  nickname: string;
};

function shanghaiDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function normalizeNickname(value: string) {
  const nickname = value.trim();
  const length = [...nickname].length;

  if (length < 2 || length > 20) {
    throw new Error("昵称长度必须为 2–20 个字符");
  }

  return {
    nickname,
    key: nickname.toLocaleLowerCase("zh-CN")
  };
}

function tokenDigest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createMvpStore(options: StoreOptions) {
  if (options.path !== ":memory:") {
    mkdirSync(dirname(options.path), { recursive: true });
  }

  const database = new DatabaseSync(options.path);
  const today = options.today ?? shanghaiDate;

  database.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL,
      nickname_key TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_digest TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS check_ins (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      local_date TEXT NOT NULL,
      points INTEGER NOT NULL DEFAULT 5,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, local_date)
    );

    CREATE TABLE IF NOT EXISTS submissions (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      text_content TEXT NOT NULL DEFAULT '',
      link_url TEXT NOT NULL DEFAULT '',
      points INTEGER NOT NULL DEFAULT 20,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, lesson_id)
    );
  `);

  function getProgress(studentId: string): ProgressRecord {
    const checkInPoints = database
      .prepare(
        "SELECT COALESCE(SUM(points), 0) AS points FROM check_ins WHERE user_id = ?"
      )
      .get(studentId) as { points: number };
    const submissionPoints = database
      .prepare(
        "SELECT COALESCE(SUM(points), 0) AS points FROM submissions WHERE user_id = ?"
      )
      .get(studentId) as { points: number };
    const checkedInToday = Boolean(
      database
        .prepare(
          "SELECT 1 AS present FROM check_ins WHERE user_id = ? AND local_date = ?"
        )
        .get(studentId, today())
    );
    const submissionRows = database
      .prepare(
        "SELECT lesson_id FROM submissions WHERE user_id = ? ORDER BY created_at, lesson_id"
      )
      .all(studentId) as Array<{ lesson_id: string }>;
    const lessonIds = submissionRows.map((row) => row.lesson_id);

    return {
      points: Number(checkInPoints.points) + Number(submissionPoints.points),
      checkedInToday,
      completedLessonIds: lessonIds,
      submittedLessonIds: lessonIds
    };
  }

  return {
    close() {
      database.close();
    },

    loginByNickname(value: string) {
      const { nickname, key } = normalizeNickname(value);

      database
        .prepare(
          "INSERT OR IGNORE INTO users (id, nickname, nickname_key) VALUES (?, ?, ?)"
        )
        .run(randomUUID(), nickname, key);

      const student = database
        .prepare("SELECT id, nickname FROM users WHERE nickname_key = ?")
        .get(key) as StudentRow;
      const token = randomBytes(32).toString("base64url");
      const expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString();

      database
        .prepare(
          "INSERT INTO sessions (token_digest, user_id, expires_at) VALUES (?, ?, ?)"
        )
        .run(tokenDigest(token), student.id, expiresAt);

      return {
        student: { id: student.id, nickname: student.nickname },
        token
      };
    },

    getStudentByToken(token: string): StudentRecord | null {
      if (!token) return null;

      const row = database
        .prepare(
          `SELECT users.id, users.nickname
           FROM sessions
           JOIN users ON users.id = sessions.user_id
           WHERE sessions.token_digest = ? AND sessions.expires_at > ?`
        )
        .get(tokenDigest(token), new Date().toISOString()) as
        | StudentRow
        | undefined;

      return row ? { id: row.id, nickname: row.nickname } : null;
    },

    deleteSession(token: string) {
      if (token) {
        database
          .prepare("DELETE FROM sessions WHERE token_digest = ?")
          .run(tokenDigest(token));
      }
    },

    getProgress,

    checkIn(studentId: string) {
      database.exec("BEGIN IMMEDIATE");
      try {
        database
          .prepare(
            "INSERT OR IGNORE INTO check_ins (user_id, local_date) VALUES (?, ?)"
          )
          .run(studentId, today());
        database.exec("COMMIT");
      } catch (error) {
        database.exec("ROLLBACK");
        throw error;
      }

      return getProgress(studentId);
    },

    submitAssignment(input: {
      studentId: string;
      lessonId: string;
      text: string;
      link: string;
    }) {
      database.exec("BEGIN IMMEDIATE");
      try {
        database
          .prepare(
            `INSERT OR IGNORE INTO submissions
              (user_id, lesson_id, text_content, link_url)
             VALUES (?, ?, ?, ?)`
          )
          .run(
            input.studentId,
            input.lessonId,
            input.text.trim(),
            input.link.trim()
          );
        database.exec("COMMIT");
      } catch (error) {
        database.exec("ROLLBACK");
        throw error;
      }

      return getProgress(input.studentId);
    },

    getLeaderboard() {
      const rows = database
        .prepare(
          `SELECT users.nickname,
                  COALESCE(check_in_totals.points, 0) +
                  COALESCE(submission_totals.points, 0) AS points
           FROM users
           LEFT JOIN (
             SELECT user_id, SUM(points) AS points
             FROM check_ins
             GROUP BY user_id
           ) AS check_in_totals ON check_in_totals.user_id = users.id
           LEFT JOIN (
             SELECT user_id, SUM(points) AS points
             FROM submissions
             GROUP BY user_id
           ) AS submission_totals ON submission_totals.user_id = users.id
           ORDER BY points DESC, users.created_at ASC, users.nickname ASC`
        )
        .all() as Array<{ nickname: string; points: number }>;

      return rows.map((row) => ({
        nickname: row.nickname,
        points: Number(row.points)
      }));
    },

    getAdminOverview() {
      const rows = database
        .prepare(
          `SELECT users.id,
                  users.nickname,
                  users.created_at AS createdAt,
                  COUNT(DISTINCT check_ins.local_date) AS checkInCount,
                  COUNT(DISTINCT submissions.lesson_id) AS submissionCount,
                  COALESCE(check_in_totals.points, 0) +
                  COALESCE(submission_totals.points, 0) AS points
           FROM users
           LEFT JOIN check_ins ON check_ins.user_id = users.id
           LEFT JOIN submissions ON submissions.user_id = users.id
           LEFT JOIN (
             SELECT user_id, SUM(points) AS points
             FROM check_ins
             GROUP BY user_id
           ) AS check_in_totals ON check_in_totals.user_id = users.id
           LEFT JOIN (
             SELECT user_id, SUM(points) AS points
             FROM submissions
             GROUP BY user_id
           ) AS submission_totals ON submission_totals.user_id = users.id
           GROUP BY users.id
           ORDER BY users.created_at DESC`
        )
        .all() as Array<{
        id: string;
        nickname: string;
        createdAt: string;
        checkInCount: number;
        submissionCount: number;
        points: number;
      }>;

      return rows.map((row) => ({
        ...row,
        checkInCount: Number(row.checkInCount),
        submissionCount: Number(row.submissionCount),
        points: Number(row.points)
      }));
    }
  };
}

type MvpStore = ReturnType<typeof createMvpStore>;

const globalStore = globalThis as typeof globalThis & {
  __mvpStore?: MvpStore;
};

export function getMvpStore() {
  if (!globalStore.__mvpStore) {
    globalStore.__mvpStore = createMvpStore({
      path:
        process.env.SQLITE_PATH ??
        join(process.cwd(), "data", "gamified-bootcamp.sqlite")
    });
  }

  return globalStore.__mvpStore;
}
