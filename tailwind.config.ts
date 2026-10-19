import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08192B",
        harbor: {
          950: "#0A2038",
          900: "#0F2D4D",
          800: "#163F6A",
          700: "#1F5489",
        },
        box: { DEFAULT: "#C8481C", dark: "#9E3512", light: "#E8764A" },
        sea: "#2C8596",
        fog: "#EDF0F3",
        chart: "#F7F8FA",
        line: "#CBD3DC",
        slate: { 600: "#4A5868" },
      },
      fontFamily: {
        display: ['"Schibsted Grotesk Variable"', "Arial", "sans-serif"],
        sans: ['"Hanken Grotesk Variable"', "system-ui", "sans-serif"],
      },
      maxWidth: { page: "1360px" },
    },
  },
  plugins: [],
};
export default config;
