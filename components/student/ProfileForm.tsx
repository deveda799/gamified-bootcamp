"use client";

import { useState, type FormEvent } from "react";
import type { UserProfile } from "@/lib/application/ports/profile-repository";

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: form.get("nickname"),
        leaderboardAnonymous: form.get("leaderboardAnonymous") === "on"
      })
    });
    const result = await response.json();
    setMessage(response.ok ? "资料已保存" : result.error?.message ?? "保存失败");
    setPending(false);
  }

  async function logout() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    window.location.assign("/login");
  }

  return (
    <form onSubmit={save}>
      <label className="block text-sm font-semibold text-forest">
        昵称
        <input
          className="mt-2 min-h-12 w-full rounded-2xl border border-forest/10 bg-warm px-4 text-sm outline-none focus:border-action"
          defaultValue={profile.nickname}
          maxLength={40}
          name="nickname"
          required
        />
      </label>
      <label className="mt-4 flex items-center justify-between text-sm text-forest">
        排行榜匿名展示
        <input
          defaultChecked={profile.leaderboardAnonymous}
          name="leaderboardAnonymous"
          type="checkbox"
        />
      </label>
      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
      <button
        className="mt-5 min-h-12 w-full rounded-button bg-action font-semibold text-white disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "保存中…" : "保存资料"}
      </button>
      <button
        className="mt-3 min-h-12 w-full rounded-button border border-forest/10 bg-white font-semibold text-forest"
        onClick={logout}
        type="button"
      >
        退出登录
      </button>
    </form>
  );
}
