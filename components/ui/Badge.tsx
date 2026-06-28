import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-growthGold/30 px-3 py-1 text-xs font-semibold text-forest">
      {children}
    </span>
  );
}

