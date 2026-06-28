"use client";

import { useState, type FormEvent } from "react";

type Mode = "sign-in" | "sign-up";

type ApiResult = {
  ok: boolean;
  data?: {
    sessionEstablished?: boolean;
  };
  error?: {
    message: string;
  };
};

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password")
      })
    }).catch(() => null);
    const result = response
      ? await response.json().catch(() => null) as ApiResult | null
      : null;

    if (!response?.ok || !result?.ok) {
      setMessage(result?.error?.message ?? "服务暂时不可用，请稍后重试");
      setPending(false);
      return;
    }

    if (mode === "sign-up" && result.data?.sessionEstablished === false) {
      setMessage("注册成功，请先查收邮箱确认邮件");
      setPending(false);
      return;
    }

    window.location.assign("/app/home");
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 rounded-2xl bg-warm p-1 text-sm">
        {(["sign-in", "sign-up"] as const).map((value) => (
          <button
            className={`rounded-xl px-3 py-2 font-semibold ${
              mode === value ? "bg-white text-forest shadow-sm" : "text-muted"
            }`}
            key={value}
            onClick={() => {
              setMode(value);
              setMessage(null);
            }}
            type="button"
          >
            {value === "sign-in" ? "登录" : "注册"}
          </button>
        ))}
      </div>

      <label className="block text-sm font-semibold text-forest">
        邮箱
        <input
          autoComplete="email"
          className="mt-2 min-h-12 w-full rounded-2xl border border-forest/10 bg-warm px-4 text-sm outline-none focus:border-action"
          name="email"
          placeholder="name@example.com"
          required
          type="email"
        />
      </label>

      <label className="block text-sm font-semibold text-forest">
        密码
        <input
          autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          className="mt-2 min-h-12 w-full rounded-2xl border border-forest/10 bg-warm px-4 text-sm outline-none focus:border-action"
          minLength={8}
          name="password"
          placeholder="至少 8 位"
          required
          type="password"
        />
      </label>

      {message ? (
        <p className="rounded-2xl bg-warm px-4 py-3 text-sm text-forest">
          {message}
        </p>
      ) : null}

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-button bg-action px-5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "请稍候…" : mode === "sign-in" ? "登录并进入训练营" : "创建账号"}
      </button>
    </form>
  );
}
