"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesColumnIncreasing, Flag, Gauge, Home, Settings, Trophy, Warehouse } from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/play", label: "开始游戏", icon: Gauge },
  { href: "/garage", label: "车库", icon: Warehouse },
  { href: "/tracks", label: "赛道", icon: Flag },
  { href: "/leaderboard", label: "排行榜", icon: Trophy },
  { href: "/profile", label: "设置", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="arena-shell">
      <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-[#070B1A]/86 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-cyan-300/40 bg-cyan-300/10 shadow-neon">
              <ChartNoAxesColumnIncreasing className="h-5 w-5 text-cyan-200" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black uppercase tracking-[0.18em] text-white sm:text-base">
                Felix Racing Arena
              </span>
              <span className="block text-xs text-slate-400">极速竞技场</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {navItems.slice(1).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
                    active
                      ? "border border-cyan-300/40 bg-cyan-300/12 text-cyan-100"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-slate-800/60 px-4 py-2 lg:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${
                  active
                    ? "border border-cyan-300/40 bg-cyan-300/12 text-cyan-100"
                    : "text-slate-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
