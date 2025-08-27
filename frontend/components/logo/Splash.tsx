"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplashProps } from "@/lib/types/coin.types";
import { useTheme } from "next-themes";

export default function Splash({
  title = "Welcome to Crypify",
  subtitle = "Loading markets…",
  barMs = 1200,
}: SplashProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const borderColor = isDark ? "#1f6f43" : "#d1fae5";
  const fillColor = isDark ? "#22c55e" : "#059669";
  const textColor = isDark ? "text-white" : "text-black";
  const subTextColor = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="flex flex-col items-center gap-5"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ border: `2px solid ${borderColor}` }}
        >
          <div
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: fillColor }}
          />
        </motion.div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className={`text-2xl font-semibold ${textColor}`}
          >
            {title}
          </motion.div>
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className={`mt-1 ${subTextColor}`}
            >
              {subtitle}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "12rem" }}
          transition={{
            duration: barMs / 1000,
            ease: "easeInOut",
            delay: 0.15,
          }}
          className="h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: borderColor }}
          aria-hidden
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: barMs / 1000, ease: "easeInOut" }}
            className="h-full"
            style={{ backgroundColor: fillColor }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
