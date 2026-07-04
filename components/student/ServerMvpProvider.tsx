"use client";

import type { ProgressRecord, StudentRecord } from "@/lib/server/sqlite";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";

type LeaderboardEntry = {
  nickname: string;
  points: number;
};

type MvpContextValue = {
  student: StudentRecord;
  progress: ProgressRecord;
  leaderboard: LeaderboardEntry[];
  checkIn: () => Promise<void>;
  submitLesson: (lessonId: string, text: string, link: string) => Promise<void>;
  refreshLeaderboard: () => Promise<void>;
};

const MvpContext = createContext<MvpContextValue | null>(null);

async function jsonRequest<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const body = (await response.json()) as T & { error?: string };

  if (!response.ok) throw new Error(body.error ?? "请求失败");

  return body;
}

export function ServerMvpProvider({
  children,
  initialProgress,
  student
}: {
  children: ReactNode;
  initialProgress: ProgressRecord;
  student: StudentRecord;
}) {
  const [progress, setProgress] = useState(initialProgress);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const checkIn = useCallback(async () => {
    const result = await jsonRequest<{ progress: ProgressRecord }>(
      "/api/check-ins",
      { method: "POST" }
    );
    setProgress(result.progress);
  }, []);
  const submitLesson = useCallback(async (lessonId: string, text: string, link: string) => {
    const result = await jsonRequest<{ progress: ProgressRecord }>(
      "/api/submissions",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lessonId, text, link })
      }
    );
    setProgress(result.progress);
  }, []);
  const refreshLeaderboard = useCallback(async () => {
    const result = await jsonRequest<{
      leaderboard: LeaderboardEntry[];
    }>("/api/leaderboard");
    setLeaderboard(result.leaderboard);
  }, []);

  const value = useMemo<MvpContextValue>(
    () => ({
      student,
      progress,
      leaderboard,
      checkIn,
      submitLesson,
      refreshLeaderboard
    }),
    [checkIn, leaderboard, progress, refreshLeaderboard, student, submitLesson]
  );

  return <MvpContext.Provider value={value}>{children}</MvpContext.Provider>;
}

export function useMvp() {
  const context = useContext(MvpContext);

  if (!context) throw new Error("useMvp must be used inside ServerMvpProvider");

  return context;
}
