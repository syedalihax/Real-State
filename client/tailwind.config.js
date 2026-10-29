/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 12px 32px rgba(15, 23, 42, 0.08)",
      },
      colors: {
        brand: {
          50: "#fff1f3",
          100: "#ffe4e6",
          500: "#e11d48",
          600: "#be123c",
          700: "#9f1239",
        },
      },
    },
  },
  plugins: [],
};
