import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#FFFFFF",
          warm: "#F4F6F8",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#0F1419",
          mid: "#4B5765",
          mute: "#8A95A1",
        },
        line: {
          DEFAULT: "#E4E8EC",
          soft: "#EFF2F5",
        },
        accent: {
          DEFAULT: "#1F9F5A",
          hov: "#1A8C4F",
          soft: "#DFF4E6",
        },
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "16px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
