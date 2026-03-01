import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const baseLink =
    "text-sm md:text-base text-l3-muted hover:text-l3-gold transition px-2 md:px-3 py-1 rounded-full";

  const activeLink =
    "text-sm md:text-base text-l3-gold font-semibold px-2 md:px-3 py-1 rounded-full bg-l3-chip";

  return (
    <nav className="sticky top-0 z-30 bg-l3-card/95 border-b border-l3-border px-4 md:px-8 py-3 flex items-center justify-between backdrop-blur">
      {/* Logo + nombre */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-l3-gold/80 to-l3-brown flex items-center justify-center shadow-lg shadow-l3-gold/40">
          <span className="text-xl font-serif text-l3-bg">L</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg md:text-xl font-serif text-l3-paper">
            L3ttro
          </span>
          <span className="text-[11px] md:text-xs text-l3-muted">
            Biblioteca de historias
          </span>
        </div>
      </Link>

      {/* Links de navegación */}
      <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
          end
        >
          Inicio
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
        >
          Explorar libros
        </NavLink>

        <NavLink
          to="/profile/1"
          className={({ isActive }) => (isActive ? activeLink : baseLink)}
        >
          Mi estantería
        </NavLink>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2 md:gap-3">
        <Link
          to="/login"
          className="hidden md:inline-flex px-3 py-1.5 text-sm rounded-full border border-l3-border text-l3-muted hover:bg-l3-chip hover:text-l3-paper transition"
        >
          Iniciar sesión
        </Link>

        <Link
          to="/create-story"
          className="inline-flex items-center gap-2 bg-l3-gold text-l3-bg text-sm md:text-base px-4 md:px-5 py-1.5 md:py-2 rounded-full font-semibold hover:bg-yellow-400 transition shadow-lg shadow-l3-gold/30"
        >
          <span className="text-base md:text-lg">＋</span>
          <span>Publicar historia</span>
        </Link>
      </div>
    </nav>
  );
}