"use client";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import AnimatedNumber from "./AnimatedNumber";
import { motion } from "framer-motion";

export function ChangeCell({ value }: { value: number }) {
  const up = (value ?? 0) >= 0;

  const bgColor = up ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)";

  const textColor = up ? "text-green-500" : "text-red-500";

  return (
    <motion.div
      key={value}
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center justify-end gap-1 rounded px-1 ${textColor}`}
    >
      {up ? (
        <ArrowUpRight className="w-4 h-4" />
      ) : (
        <ArrowDownRight className="w-4 h-4" />
      )}
      <AnimatedNumber value={value ?? 0} digits={2} suffix="%" />
    </motion.div>
  );
}
