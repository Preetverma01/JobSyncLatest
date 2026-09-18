/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bcd3ff",
          300: "#8fb6ff",
          400: "#5c8fff",
          500: "#3366ff",
          600: "#1f47e0",
          700: "#1a38b3",
          800: "#182f8c",
          900: "#182b6f",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(30, 64, 175, 0.25)",
      },
    },
  },
  plugins: [],
};
