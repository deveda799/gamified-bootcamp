import Link from "next/link";
import { studentRoutes } from "@/lib/constants/routes";

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-forest/10 bg-white/95 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-md justify-between">
        {studentRoutes.map((route) => (
          <Link
            className="min-h-11 min-w-12 rounded-xl px-2 py-2 text-center text-xs font-medium text-muted"
            href={route.href}
            key={route.href}
          >
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

