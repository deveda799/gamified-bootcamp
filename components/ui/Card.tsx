import type { ReactNode } from "react";

export function Card({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-card bg-white p-4 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

