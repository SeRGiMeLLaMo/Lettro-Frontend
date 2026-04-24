/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        l3: {
          bg: "#f5ebe0",        // Fondo general beige claro
          card: "#fff7ec",      // Tarjetas color papel cálido
          paper: "#3b2f2a",     // Texto principal marrón oscuro
          muted: "#7b6f67",     // Texto secundario gris-marrón
          border: "#e0d1c3",    // Bordes suaves color crema
          gold: "#d9a05b",      // Acento dorado suave
          goldHover: "#c68c4a", // Hover para acento dorado
          brown: "#8b5a2b",     // Detalles marrón libro
          chip: "rgba(139, 90, 43, 0.06)", // Pill suave café
        }
      }
    },
  },
  plugins: [],
};