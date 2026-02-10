/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      l3: {
        bg: "#0F0B1E",        // Fondo principal (muy oscuro)
        card: "#16102B",      // Tarjetas
        purple: "#7C3AED",    // Color principal
        light: "#A78BFA",     // Violeta claro
        neon: "#22D3EE",      // Cian neón de acento
        gray: "#9CA3AF",      // Texto secundario
      }
    },
  },
  plugins: [],
};