"use client";

export function AdminApiState({
  error,
  isLoading
}: {
  error: string | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <p className="rounded-card bg-white p-4 text-sm text-muted">加载中…</p>;
  }

  if (error) {
    return <p className="rounded-card bg-danger/10 p-4 text-sm text-danger">{error}</p>;
  }

  return null;
}

