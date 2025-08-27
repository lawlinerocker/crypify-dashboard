"use client";
import React from "react";
import Logo from "../logo/Logo";
import ThemeToggle from "../theme/themeToggle";

export default function Header() {
  const [now, setNow] = React.useState<Date>(new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <p className="text-xs text-gray-400 hidden sm:block">
            Live crypto markets
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 bg-emerald-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Live · Coin data
        </span>

        <span className="text-xs text-gray-400 hidden md:inline">
          Updated {timeStr}
        </span>

        <ThemeToggle />
      </div>
    </header>
  );
}
