import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
};

const variantClass = {
  primary: "bg-action text-white",
  secondary: "bg-white text-forest border border-forest/10"
};

export function Button({
  children,
  href,
  type = "button",
  variant = "primary"
}: ButtonProps) {
  const className = `inline-flex min-h-12 w-full items-center justify-center rounded-button px-5 text-sm font-semibold shadow-sm ${variantClass[variant]}`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type={type}>
      {children}
    </button>
  );
}

