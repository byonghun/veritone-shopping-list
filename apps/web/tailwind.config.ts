import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
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
        listDescriptionGray: "#7D7A7A"
      },
      fontFamily: {
        dosis: ['"Dosis"', "Trebuchet MS", "Arial", "ui-sans-serif", "system-ui", "sans-serif"],
        nunito: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
