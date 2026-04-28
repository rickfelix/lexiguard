/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-logo)",
          accent: "var(--brand-highlighting-key-insights)",
          text: "var(--brand-body-text)",
          bg: "var(--brand-main-background-color-for-the-application-and-website)",
        },
      },
      fontFamily: {
        serif: ["Merriweather", "Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
