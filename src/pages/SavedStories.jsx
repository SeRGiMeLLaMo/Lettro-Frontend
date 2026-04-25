import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function SavedStories() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const STORAGE_URL = API_BASE.replace("/api", "/storage");

  const [q, setQ] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [allSavedStories, setAllSavedStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openGenres, setOpenGenres] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Cargar géneros para el filtro
    axios.get(`${API_BASE}/genres`)
      .then(res => setGenres(res.data))
      .catch(() => {});

    // Cargar historias guardadas
    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE}/me/liked-stories`, {
          headers: { 
            Accept: "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        setAllSavedStories(res.data || []);
        setFilteredStories(res.data || []);
      } catch (err) {
        setError("No se pudieron cargar tus historias guardadas.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [token, navigate, API_BASE]);

  // Lógica de filtrado local
  useEffect(() => {
    let results = allSavedStories;

    // Filtrar por texto (título o autor)
    if (q) {
      const search = q.toLowerCase();
      results = results.filter(s => 
        s.title.toLowerCase().includes(search) || 
        s.author?.username?.toLowerCase().includes(search)
      );
    }

    // Filtrar por géneros
    if (selectedGenres.length > 0) {
      results = results.filter(s => 
        s.genres?.some(g => selectedGenres.includes(g.id))
      );
    }

    setFilteredStories(results);
  }, [q, selectedGenres, allSavedStories]);

  const toggleGenre = (id) => {
    setSelectedGenres(curr => 
      curr.includes(id) ? curr.filter(x => x !== id) : [...curr, id]
    );
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5ebe0" }}>
      <p style={{ color: "#d9a05b", fontWeight: "600" }}>Abriendo tu biblioteca personal...</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "calc(100vh - 80px)", padding: "2rem 1rem", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* PANEL SUPERIOR */}
        <div style={{
          backgroundColor: "#fff7ec",
          border: "1px solid #e0d1c3",
          borderRadius: "1.5rem",
          padding: "2rem",
          boxShadow: "0 20px 40px rgba(139, 90, 43, 0.05)",
          marginBottom: "2.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🔒</span>
            <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#3b2f2a", margin: 0 }}>
              Mis Historias Guardadas
            </h1>
          </div>
          <p style={{ color: "#7b6f67", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
            Tu colección privada de lecturas favoritas. Solo tú puedes ver esta página.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar en mis guardados..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{
                flex: "1 1 300px",
                padding: "0.875rem 1.25rem",
                border: "1px solid #e0d1c3",
                borderRadius: "1rem",
                backgroundColor: "transparent",
                color: "#3b2f2a",
                outline: "none",
                fontSize: "1rem",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#d9a05b"}
              onBlur={(e) => e.target.style.borderColor = "#e0d1c3"}
            />

            <button
              type="button"
              onClick={() => setOpenGenres((o) => !o)}
              style={{
                padding: "0.875rem 1.5rem",
                borderRadius: "1rem",
                border: "1px solid #d9a05b",
                backgroundColor: openGenres ? "#d9a05b" : "transparent",
                color: openGenres ? "#fff7ec" : "#d9a05b",
                fontWeight: "600",
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {openGenres ? "Cerrar Filtros" : "Filtrar por Género"}
            </button>
          </div>

          {openGenres && (
            <div style={{
              marginTop: "1rem",
              padding: "1.5rem",
              borderRadius: "1rem",
              backgroundColor: "rgba(217,160,91,0.05)",
              border: "1px solid rgba(217,160,91,0.2)"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
                {genres.map((g) => {
                  const active = selectedGenres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGenre(g.id)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.5rem",
                        border: active ? "1px solid #d9a05b" : "1px solid #e0d1c3",
                        backgroundColor: active ? "rgba(217,160,91,0.1)" : "transparent",
                        color: active ? "#8b5a2b" : "#7b6f67",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        transition: "all 0.2s"
                      }}
                    >
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* LISTADO DE RESULTADOS */}
        {filteredStories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#7b6f67" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: "600" }}>
              {allSavedStories.length === 0 
                ? "Aún no has guardado ninguna historia." 
                : "No hay historias que coincidan con tu búsqueda."}
            </p>
            {allSavedStories.length === 0 && (
              <Link to="/search" style={{ color: "#d9a05b", textDecoration: "none", fontWeight: "700" }}>
                ¡Explora historias y guarda tus favoritas!
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {filteredStories.map((s) => (
              <div
                key={s.id}
                style={{
                  backgroundColor: "#fff7ec",
                  border: "1px solid #e0d1c3",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 4px 6px rgba(139, 90, 43, 0.05)"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 20px rgba(139, 90, 43, 0.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px rgba(139, 90, 43, 0.05)"; }}
              >
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{
                    width: "70px",
                    height: "100px",
                    flexShrink: 0,
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "1px solid #e0d1c3",
                    backgroundColor: "#f5ebe0"
                  }}>
                    {s.cover_image && (
                      <img 
                        src={s.cover_image.startsWith("http") ? s.cover_image : `${STORAGE_URL}/${s.cover_image}`} 
                        alt={s.title} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#3b2f2a", margin: "0 0 0.25rem 0" }}>{s.title}</h2>
                    <p style={{ fontSize: "0.85rem", color: "#7b6f67", margin: 0 }}>Por {s.author?.username}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                      {s.genres?.slice(0, 2).map(g => (
                        <span key={g.id} style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem", borderRadius: "1rem", border: "1px solid #e0d1c3", color: "#8b5a2b" }}>
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/story/${s.id}`}
                  style={{
                    marginTop: "auto",
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem",
                    backgroundColor: "#d9a05b",
                    color: "#fff",
                    borderRadius: "0.75rem",
                    textDecoration: "none",
                    fontWeight: "700",
                    fontSize: "0.9rem"
                  }}
                >
                  Continuar leyendo
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
