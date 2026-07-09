import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI人生操作系统创造营",
  description: "14天，把你的人生经验、知识和方法，沉淀成可复用的AI资产。"
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
