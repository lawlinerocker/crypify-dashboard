// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        "bg-light": "#f9fafb",
        card: "#111213",
        "card-light": "#ffffff",
        line: "#2a2a2a",
        "line-light": "#d1d5db",
        up: "#22c55e",
        down: "#ef4444",
      },
    },
  },
  plugins: [],
};
