/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light mode
        primary: "#40A9E8",
        secondary: "#E5E9EA",
        tertiary: "#024264",
        background: "#F9F9F9",
        primaryHover: "#2E89C9",
        text: "#333333",
        // Dark mode
        primaryDark: "#1B6DAB",
        secondaryDark: "#242526",
        tertiaryDark: "#3a3b3c",
        borderDark: "#393a3b",
        textDark: "#e4e6eb",
        backgroundDark: "#18191a",
      },
    },
  },
  plugins: [],

  corePlugins: {
    preflight: false,
  },
};
