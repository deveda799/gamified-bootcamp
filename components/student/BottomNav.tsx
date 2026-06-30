"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { href: "/app/home", label: "首页", icon: "⌂" },
  { href: "/app/course", label: "课程", icon: "▤" },
  { href: "/app/growth", label: "成长", icon: "✦" }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-violet-100 bg-white/95 px-4 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {routes.map((route) => {
          const active = pathname.startsWith(route.href);

          return (
          <Link
            className={`flex min-h-12 flex-col items-center justify-center rounded-xl text-xs font-semibold transition ${
              active
                ? "bg-violet-50 text-violet-700"
                : "text-slate-400"
            }`}
            href={route.href}
            key={route.href}
          >
            <span className="text-lg leading-none">{route.icon}</span>
            <span className="mt-1">{route.label}</span>
          </Link>
          );
        })}
      </div>
    </nav>
  );
}
