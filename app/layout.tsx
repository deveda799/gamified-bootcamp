import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "游戏化训练营",
  description: "知识付费行业的游戏化训练营 MVP V1"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

