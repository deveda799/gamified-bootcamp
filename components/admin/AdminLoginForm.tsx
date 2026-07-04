"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password })
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error ?? "登录失败");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="mx-auto mt-24 max-w-sm rounded-3xl bg-white p-6 shadow-lg" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-black text-slate-900">管理员登录</h1>
      <input
        autoFocus
        className="mt-5 min-h-12 w-full rounded-2xl border border-slate-200 px-4"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="管理员密码"
        required
        type="password"
        value={password}
      />
      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      <button className="mt-4 min-h-12 w-full rounded-2xl bg-slate-900 font-bold text-white" type="submit">
        登录后台
      </button>
    </form>
  );
}
