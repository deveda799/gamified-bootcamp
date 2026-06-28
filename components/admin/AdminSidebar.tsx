import Link from "next/link";
import { adminRoutes } from "@/lib/constants/routes";

export function AdminSidebar() {
  return (
    <aside className="rounded-card bg-forest p-4 text-white">
      <p className="text-lg font-bold">Jenny 后台</p>
      <nav className="mt-6 grid gap-2">
        {adminRoutes.map((route) => (
          <Link className="rounded-2xl px-3 py-2 text-sm hover:bg-white/10" href={route.href} key={route.href}>
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

