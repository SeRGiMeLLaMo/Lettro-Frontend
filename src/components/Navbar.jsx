import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const STORAGE_URL = API_BASE.replace("/api", "/storage");

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "#d9a05b" : "#7b6f67",
    fontWeight: isActive ? "700" : "500",
    textDecoration: "none",
    fontSize: "1rem",
    padding: "0.5rem 1rem",
    transition: "all 0.3s ease",
    position: "relative",
    display: "flex",
    alignItems: "center"
  });

  return (
    <>
      <style>{`
        /* RESPONSIVE OVERRIDES - Solo se activan en pantallas pequeñas */
        @media (max-width: 1024px) {
          .navbar-container {
            grid-template-columns: 1fr auto !important; /* Solo logo y hamburguesa */
            padding: 0.5rem 1.25rem !important;
          }
          .navbar-center {
            display: none !important; /* Ocultar links centrales en el nav */
          }
          .navbar-right {
            display: none !important; /* Ocultar botones derechos en el nav */
          }
          .mobile-menu-btn {
            display: flex !important; /* Mostrar botón hamburguesa */
          }
          .navbar-left {
            min-width: auto !important;
          }
          .navbar-left span {
            display: none; /* Ocultar texto en móviles muy pequeños si es necesario */
          }
          @media (min-width: 640px) {
            .navbar-left span { display: flex; }
          }
        }

        /* Menú Móvil Overlay */
        .mobile-overlay {
          position: fixed;
          top: 75px;
          left: 0;
          width: 100%;
          height: calc(100vh - 75px);
          background-color: #fffaf4;
          z-index: 999;
          display: flex;
          flex-direction: column;
          padding: 2rem;
          box-sizing: border-box; /* CRITICO para el centrado */
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-top: 1px solid #e0d1c3;
          overflow-y: auto;
          box-shadow: -10px 0 30px rgba(139, 90, 43, 0.05);
        }
        .mobile-overlay.open {
          transform: translateX(0);
        }
        .mobile-link {
          font-size: 1.25rem;
          color: #3b2f2a;
          text-decoration: none;
          font-weight: 600;
          padding: 1.25rem 0;
          width: 100%;
          display: block;
          text-align: center;
          border-bottom: 1px solid rgba(224, 209, 195, 0.4);
          transition: all 0.2s;
        }
        .mobile-link:active {
          background-color: rgba(217, 160, 91, 0.05);
          color: #d9a05b;
        }
      `}</style>

      <nav className="navbar-container" style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "rgba(255, 247, 236, 0.98)", // #fff7ec con ligera transparencia
        borderBottom: "1px solid #e0d1c3",
        padding: "0.5rem 2rem",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr", // Esto asegura que el centro esté realmente centrado
        alignItems: "center",
        minHeight: "75px",
        backdropBlur: "blur(10px)",
        boxShadow: "0 4px 20px rgba(139, 90, 43, 0.04)"
      }}>
        
        {/* SECCIÓN IZQUIERDA: Logo + nombre */}
        <Link to="/" className="navbar-left" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "1rem", minWidth: 200 }}>
          <div style={{
            width: "50px",
            height: "50px",
            flexShrink: 0,
            borderRadius: "12px",
            overflow: "hidden",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 16px rgba(139, 90, 43, 0.08)",
            border: "1px solid #e0d1c3"
          }}>
            <img src="/LogoNavbar.png" alt="L3" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ 
              fontSize: "1.5rem", 
              fontWeight: "900", 
              color: "#3b2f2a", 
              fontFamily: "serif",
              letterSpacing: "-0.5px",
              lineHeight: 1
            }}>
              L3<span style={{ color: "#d9a05b" }}>ttro</span>
            </span>
            <span style={{ fontSize: "0.7rem", color: "#7b6f67", fontWeight: "600", letterSpacing: "0.5px", marginTop: "2px" }}>
              BIBLIOTECA VIRTUAL
            </span>
          </div>
        </Link>

        {/* SECCIÓN CENTRAL: Links de navegación (PERFECTAMENTE CENTRADOS) */}
        <div className="navbar-center" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <NavLink to="/" style={navLinkStyle} end>
            Inicio
          </NavLink>
          <NavLink to="/search" style={navLinkStyle}>
            Explorar libros
          </NavLink>
          {user && (
            <NavLink to="/saved-stories" style={navLinkStyle}>
              Mis Guardados
            </NavLink>
          )}
          <NavLink to={user ? `/profile/${user.id}` : "/login"} style={navLinkStyle}>
            Mi estantería
          </NavLink>
        </div>

        {/* SECCIÓN DERECHA: Botones de acción */}
        <div className="navbar-right" style={{ display: "flex", alignItems: "center", gap: "1.25rem", justifyContent: "flex-end", minWidth: 200 }}>
          {!user ? (
            <>
              <Link to="/login" style={{ color: "#7b6f67", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" }}>
                Entrar
              </Link>
              <Link to="/register" style={{ 
                backgroundColor: "transparent", 
                border: "1px solid #d9a05b", 
                color: "#d9a05b", 
                padding: "0.5rem 1.25rem", 
                borderRadius: "0.5rem", 
                textDecoration: "none", 
                fontSize: "0.9rem", 
                fontWeight: "700" 
              }}>
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Link to={`/profile/${user.id}`} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "2px solid #d9a05b",
                  boxShadow: "0 4px 10px rgba(217,160,91,0.15)",
                  backgroundColor: "#fff"
                }}>
                  {(() => {
                    let photoUrl = "";
                    if (user.photo) {
                      photoUrl = user.photo;
                      if (!photoUrl.startsWith("http")) {
                        const cleanStorageUrl = STORAGE_URL.endsWith("/") ? STORAGE_URL.slice(0, -1) : STORAGE_URL;
                        const cleanPhotoPath = user.photo.startsWith("/") ? user.photo.slice(1) : user.photo;
                        photoUrl = `${cleanStorageUrl}/${cleanPhotoPath}`;
                      }
                    }
                    return user.photo ? (
                      <img 
                        src={photoUrl} 
                        alt="P" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        onError={(e) => {
                          console.error("NAVBAR - Error loading image:", photoUrl);
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#d9a05b;fontWeight:bold;backgroundColor:#f5ebe0">${user.username?.charAt(0).toUpperCase()}</div>`;
                        }}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d9a05b", fontWeight: "bold", backgroundColor: "#f5ebe0" }}>
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    );
                  })()}
                </div>
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                style={{
                  background: "transparent",
                  border: "1px solid #e0d1c3",
                  color: "#7b6f67",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = "#7b6f67"; e.currentTarget.style.color = "#3b2f2a"; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e0d1c3"; e.currentTarget.style.color = "#7b6f67"; }}
              >
                Salir
              </button>
            </>
          )}

          {user && (
            <Link
              to="/create-story"
              style={{
                backgroundColor: "#d9a05b",
                color: "#fff7ec",
                padding: "0.6rem 1.25rem",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "800",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 8px 16px rgba(217, 160, 91, 0.25)",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#c68c4a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span style={{ fontSize: "1.2rem", lineHeight: 0 }}>+</span>
              HISTORIA
            </Link>
          )}
        </div>

        {/* BOTÓN HAMBURGUESA (Solo visible en móvil por CSS) */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            color: "#d9a05b",
            cursor: "pointer",
            padding: "0.5rem"
          }}
        >
          {isMenuOpen ? (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </nav>

      {/* OVERLAY DEL MENÚ MÓVIL */}
      <div className={`mobile-overlay ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(false)}>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: "2rem", width: "100%" }}>
          <NavLink to="/" className="mobile-link" end>Inicio</NavLink>
          <NavLink to="/search" className="mobile-link">Explorar libros</NavLink>
          {user && <NavLink to="/saved-stories" className="mobile-link">Mis Guardados</NavLink>}
          <NavLink to={user ? `/profile/${user.id}` : "/login"} className="mobile-link">Mi estantería</NavLink>
        </div>
        
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingBottom: "2rem", width: "100%" }}>
          {!user ? (
            <>
              <Link to="/login" style={{ 
                textAlign: "center", 
                border: "1px solid #d9a05b", 
                color: "#d9a05b",
                padding: "1rem",
                borderRadius: "0.75rem",
                textDecoration: "none",
                fontWeight: "700",
                fontSize: "1.1rem",
                backgroundColor: "transparent",
                width: "100%",
                display: "block",
                boxSizing: "border-box"
              }}>
                Entrar
              </Link>
              <Link to="/register" style={{ 
                textAlign: "center", 
                backgroundColor: "#d9a05b", 
                color: "#fff",
                padding: "1.1rem",
                borderRadius: "0.75rem",
                textDecoration: "none",
                fontWeight: "800",
                fontSize: "1.1rem",
                boxShadow: "0 8px 16px rgba(217, 160, 91, 0.2)",
                width: "100%",
                display: "block",
                boxSizing: "border-box"
              }}>
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Link to="/create-story" style={{ 
                textAlign: "center", 
                backgroundColor: "#d9a05b", 
                color: "#fff",
                padding: "1.1rem",
                borderRadius: "0.75rem",
                textDecoration: "none",
                fontWeight: "800",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: "0 8px 16px rgba(217, 160, 91, 0.2)",
                width: "100%",
                boxSizing: "border-box"
              }}>
                <span style={{ fontSize: "1.5rem", lineHeight: 0 }}>+</span> Nueva Historia
              </Link>
              <button 
                onClick={() => { logout(); navigate("/"); }}
                style={{ 
                  background: "transparent", 
                  border: "1px solid #e0d1c3", 
                  color: "#7b6f67", 
                  padding: "1.1rem", 
                  borderRadius: "0.75rem", 
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "0.5rem",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
