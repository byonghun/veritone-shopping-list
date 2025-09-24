import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        dialog: "0 4px 34px 0 rgba(0, 0, 0, 0.5)"
      },
      colors: {
        brand: "#4D81B7",
        buttonBlue: "#1871E8",
        borderGray: "#C6C6C6",
        textGray: "#87898C",
        descriptionGray: '#5C6269',
        titleBlack: '#2A323C'
      },
      fontFamily: {
        dosis: ['"Dosis"', "ui-sans-serif", "system-ui", "sans-serif"],
        nunito: ['"Nunito"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
