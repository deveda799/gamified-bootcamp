"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { camp } from "@/lib/mockData";

export function NicknameLoginForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nickname })
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error ?? "登录失败");

      router.push("/app/home");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "登录失败");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-5 py-10">
      <div className="w-full rounded-[28px] bg-white p-6 shadow-xl shadow-violet-100">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-blue-500 p-6 text-white">
          <p className="text-sm text-white/75">{camp.name}</p>
          <h1 className="mt-2 text-3xl font-black">{camp.headline}</h1>
          <p className="mt-3 text-sm text-white/80">
            {camp.subtitle}
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-slate-700">昵称</span>
            <input
              autoComplete="nickname"
              autoFocus
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none ring-violet-200 focus:ring-2"
              maxLength={20}
              minLength={2}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="请输入 2–20 个字符"
              required
              value={nickname}
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 font-bold text-white disabled:opacity-60"
            disabled={pending}
            type="submit"
          >
            {pending ? "登录中…" : "进入我的玩家基地"}
          </button>
        </form>
      </div>
    </div>
  );
}
