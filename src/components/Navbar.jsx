import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
    <nav style={{
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
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "1rem", minWidth: 200 }}>
        <div style={{
          width: "50px",
          height: "50px",
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
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <NavLink to="/" style={navLinkStyle} end>
          Inicio
        </NavLink>
        <NavLink to="/search" style={navLinkStyle}>
          Explorar libros
        </NavLink>
        <NavLink to={user ? `/profile/${user.id}` : "/login"} style={navLinkStyle}>
          Mi estantería
        </NavLink>
      </div>

      {/* SECCIÓN DERECHA: Botones de acción */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", justifyContent: "flex-end", minWidth: 200 }}>
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
                {user.photo ? (
                  <img src={user.photo.startsWith("http") ? user.photo : `${STORAGE_URL}/${user.photo}`} alt="P" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d9a05b", fontWeight: "bold", backgroundColor: "#f5ebe0" }}>
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
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
    </nav>
  );
}
