"use client";

import {
  applyCheckIn,
  applySubmission,
  initialProgress,
  type MockProgress
} from "@/lib/mockData";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

const storageKey = "gamified-bootcamp-mvp-progress";

type MockMvpContextValue = {
  progress: MockProgress;
  checkIn: () => void;
  submitLesson: (lessonId: string) => void;
};

const MockMvpContext = createContext<MockMvpContextValue | null>(null);

export function MockMvpProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(initialProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        setProgress(JSON.parse(saved) as MockProgress);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [hydrated, progress]);

  const value = useMemo(
    () => ({
      progress,
      checkIn: () => setProgress((current) => applyCheckIn(current)),
      submitLesson: (lessonId: string) =>
        setProgress((current) => applySubmission(current, lessonId))
    }),
    [progress]
  );

  return (
    <MockMvpContext.Provider value={value}>
      {children}
    </MockMvpContext.Provider>
  );
}

export function useMockMvp() {
  const context = useContext(MockMvpContext);

  if (!context) {
    throw new Error("useMockMvp must be used inside MockMvpProvider");
  }

  return context;
}
