import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/ui/AppShell";

export const metadata: Metadata = {
  title: "Felix Racing Arena / 极速竞技场",
  description: "在线 3D 街机赛车计时挑战，选择赛车，冲进虚拟霓虹赛道。",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
