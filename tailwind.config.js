/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "Tahoma", "sans-serif"],
      },
      colors: {
        ledger: {
          bg: "#f4f4f2",
          paper: "#ffffff",
          ink: "#1f2937",
          muted: "#6b7280",
          line: "#e5e7eb",
          in: "#15803d",
          "in-soft": "#dcfce7",
          out: "#9f1239",
          "out-soft": "#ffe4e6",
          gold: "#92400e",
        },
      },
    },
  },
  plugins: [],
};
