"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Splash from "@/components/logo/Splash";
import { useTheme } from "next-themes";

export default function Landing() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    router.prefetch("/markets");
    const t = setTimeout(() => router.push("/markets"), 1600);
    return () => clearTimeout(t);
  }, [router]);

  if (!mounted) return null;

  const bgClass = theme === "dark" ? "bg-[#0b0c0e]" : "bg-white";

  return (
    <main
      className={`h-[100dvh] overflow-hidden flex items-center justify-center transition-colors duration-500 ${bgClass}`}
    >
      <Splash
        title="Welcome to Crypify"
        subtitle="Loading markets…"
        barMs={1200}
      />
    </main>
  );
}
