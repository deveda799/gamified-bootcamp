import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: "#173B2B",
        action: "#39A85A",
        successLight: "#8EE29E",
        warm: "#F5F7F2",
        growthGold: "#F3C969",
        growthPurple: "#7B6FD0",
        ink: "#18231B",
        muted: "#718078",
        danger: "#D65C5C"
      },
      borderRadius: {
        card: "20px",
        button: "14px"
      }
    }
  },
  plugins: []
};

export default config;

