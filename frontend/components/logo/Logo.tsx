import React from "react";

export default function Logo({
  size = 9,
  withText = true,
}: {
  size?: number;
  withText?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2`}>
      <div
        className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 ring-2 ring-emerald-600/20 flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 text-white/90"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 16l6-6 4 4 6-6" />
          <path d="M20 10V4h-6" />
        </svg>
      </div>
      {withText && (
        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-black to-black/70 dark:from-white dark:to-white/70">
          Crypify
        </span>
      )}
    </div>
  );
}
