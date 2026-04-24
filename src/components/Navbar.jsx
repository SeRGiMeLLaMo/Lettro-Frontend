import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const STORAGE_URL = API_BASE.replace("/api", "/storage");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `font-semibold text-[1rem] px-4 py-2 transition-all duration-300 relative flex items-center ${
      isActive ? "text-l3-gold font-bold" : "text-l3-muted hover:text-l3-paper"
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-[1000] bg-l3-card/95 border-b border-l3-border backdrop-blur-md shadow-[0_4px_20px_rgba(139,90,43,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[75px]">
          
          {/* SECCIÓN IZQUIERDA: Logo + nombre */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-3 md:gap-4 no-underline md:min-w-[200px]">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-[0_8px_16px_rgba(139,90,43,0.08)] border border-l3-border">
                <img src="/LogoNavbar.png" alt="L3" className="w-[80%] h-[80%] object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black text-l3-paper font-serif tracking-tight leading-none">
                  L3<span className="text-l3-gold">ttro</span>
                </span>
                <span className="text-[0.6rem] md:text-[0.7rem] text-l3-muted font-semibold tracking-wider mt-0.5">
                  BIBLIOTECA VIRTUAL
                </span>
              </div>
            </Link>
          </div>

          {/* MENÚ HAMBURGUESA MÓVIL */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-l3-paper hover:text-l3-gold focus:outline-none p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* SECCIÓN CENTRAL: Links de navegación (PC) */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/" className={navLinkClass} end>Inicio</NavLink>
            <NavLink to="/search" className={navLinkClass}>Explorar libros</NavLink>
            <NavLink to={user ? `/profile/${user.id}` : "/login"} className={navLinkClass}>Mi estantería</NavLink>
          </div>

          {/* SECCIÓN DERECHA: Botones de acción (PC) */}
          <div className="hidden md:flex items-center gap-5 justify-end min-w-[200px]">
            {!user ? (
              <>
                <Link to="/login" className="text-l3-muted hover:text-l3-paper text-sm font-semibold transition-colors">
                  Entrar
                </Link>
                <Link to="/register" className="bg-transparent border border-l3-gold text-l3-gold hover:bg-l3-gold hover:text-white px-5 py-2 rounded-lg text-sm font-bold transition-all">
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                <Link to={`/profile/${user.id}`} className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-l3-gold shadow-[0_4px_10px_rgba(217,160,91,0.15)] bg-white">
                    {user.photo ? (
                      <img src={user.photo.startsWith("http") ? user.photo : `${STORAGE_URL}/${user.photo}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-l3-gold font-bold bg-l3-bg">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="bg-transparent border border-l3-border text-l3-muted hover:border-l3-muted hover:text-l3-paper px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all"
                >
                  Salir
                </button>
              </>
            )}

            {user && (
              <Link
                to="/create-story"
                className="bg-l3-gold hover:bg-l3-goldHover text-l3-card px-5 py-2.5 rounded-lg text-sm font-extrabold no-underline flex items-center gap-2 shadow-[0_8px_16px_rgba(217,160,91,0.25)] transition-all transform hover:-translate-y-0.5"
              >
                <span className="text-lg leading-none">+</span> HISTORIA
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL (Desplegable) */}
      {isMenuOpen && (
        <div className="md:hidden bg-l3-card border-t border-l3-border absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col shadow-inner">
            <NavLink to="/" onClick={closeMenu} className={navLinkClass} end>Inicio</NavLink>
            <NavLink to="/search" onClick={closeMenu} className={navLinkClass}>Explorar libros</NavLink>
            <NavLink to={user ? `/profile/${user.id}` : "/login"} onClick={closeMenu} className={navLinkClass}>Mi estantería</NavLink>
            
            <div className="border-t border-l3-border my-4 pt-4 flex flex-col gap-4">
              {!user ? (
                <>
                  <Link to="/login" onClick={closeMenu} className="text-center text-l3-paper font-semibold py-2">
                    Entrar
                  </Link>
                  <Link to="/register" onClick={closeMenu} className="text-center bg-transparent border border-l3-gold text-l3-gold py-2 rounded-lg font-bold">
                    Registrarse
                  </Link>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-l3-gold bg-white">
                      {user.photo ? (
                        <img src={user.photo.startsWith("http") ? user.photo : `${STORAGE_URL}/${user.photo}`} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-l3-gold font-bold bg-l3-bg">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-l3-paper">{user.username}</span>
                  </div>
                  <Link to={`/profile/${user.id}`} onClick={closeMenu} className="text-l3-muted font-semibold hover:text-l3-paper">
                    Ver mi perfil
                  </Link>
                  <Link
                    to="/create-story"
                    onClick={closeMenu}
                    className="text-center bg-l3-gold text-l3-card py-3 rounded-lg font-extrabold flex items-center justify-center gap-2"
                  >
                    <span>+</span> CREAR HISTORIA
                  </Link>
                  <button
                    onClick={() => { logout(); navigate("/"); closeMenu(); }}
                    className="text-left text-l3-brown font-semibold py-2"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
