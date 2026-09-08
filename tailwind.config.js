/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#0B0D10",
        white: "#FFFFFF",
        card: "#14181D",
        stone: "#10141A",
        concrete: "#171C23",
        charcoal: "#F2EFE6",
        ink: "#F2EFE6",       // legacy alias
        champagne: "#D9A84E", // legacy alias
        bronze: "#D9A84E",
        green: "#8A6427",
        mist: "#1A2029",
      },
      fontFamily: {
        display: ["Archivo", "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.24em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};