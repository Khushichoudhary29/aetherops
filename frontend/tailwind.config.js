/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0B0F19",
        cardBg: "#111827",
        panelBorder: "#1F2937",
        accentCyan: "#06B6D4",
        accentBlue: "#3B82F6",
        accentAmber: "#F59E0B",
        accentEmerald: "#10B981",
        accentPurple: "#8B5CF6"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
