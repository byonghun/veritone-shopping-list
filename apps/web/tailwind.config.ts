import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        dialog: "0 4px 34px 0 rgba(0, 0, 0, 0.5)",
        drawer: "0 0 14px 0 rgba(0,0,0,0.25)",
        dropdown: "0 2px 10px 0 #00000033",
      },
      colors: {
        brand: "#4D81B7",
        buttonBlue: "#1871E8",
        borderGray: "#C6C6C6",
        textGray: "#87898C",
        primaryFont: "#2A323C",
        secondaryFont: "#5C6269",
        drawerHeaderBg: "#FAFAFA",
        drawerBorderGray: "#D5DFE9",
        placeholderGray: "#9CA8BA",
        listDescriptionGray: "#7D7A7A",
      },
      fontFamily: {
        dosis: ['"Dosis"', "Trebuchet MS", "Arial", "ui-sans-serif", "system-ui", "sans-serif"],
        nunito: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        flash: {
          "0%": { backgroundColor: "#4D81B7" },
          "100%": { backgroundColor: "rgba(0,0,0,0)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.98) translateY(2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "flash-once": "flash 350ms ease-out forwards",
        "pop-in": "pop-in 200ms ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
