/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      prose: {
        table: false,
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
