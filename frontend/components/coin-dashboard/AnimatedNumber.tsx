"use client";
import { useEffect } from "react";
import { useSpring, motion } from "framer-motion";
import { formatCurrency } from "@/lib/format";
import { AnimatedNumberProps } from "@/lib/types/chart.types";

export default function AnimatedNumber({
  value,
  digits = 2,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedNumberProps) {
  const spring = useSpring(value ?? 0, {
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  });

  useEffect(() => {
    if (Number.isFinite(value)) spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className={className}>
      {prefix}
      {formatCurrency(spring.get(), digits)}
      {suffix}
    </motion.span>
  );
}
