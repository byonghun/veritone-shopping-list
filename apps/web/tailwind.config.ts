import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        dialog: "0 4px 34px 0 rgba(0, 0, 0, 0.5)",
        drawer: "0 0 14px 0 rgba(0,0,0,0.25)",
      },
      colors: {
        brand: "#4D81B7",
        buttonBlue: "#1871E8",
        borderGray: "#C6C6C6",
        textGray: "#87898C",
        descriptionGray: '#5C6269',
        primaryFont: '#2A323C',
        drawerHeaderBg: '#FAFAFA',
        drawerBorderGray: "#D5DFE9",
        placeholderGray: '#9CA8BA'
      },
      fontFamily: {
        dosis: ['"Dosis"', "ui-sans-serif", "system-ui", "sans-serif"],
        nunito: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
