import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Search() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const STORAGE_URL = API_BASE.replace("/api", "/storage");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("newest");
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openGenres, setOpenGenres] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/genres`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const seen = new Set();
        const unique = list.filter((g) => {
          const key = String(g?.name || "").toLowerCase().trim();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setGenres(unique);
        const validIds = new Set(unique.map((g) => g.id));
        setSelected((curr) => Array.from(new Set(curr.filter((id) => validIds.has(id)))));
      })
      .catch(() => {});
  }, [API_BASE]);

  const fetchStories = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (sort) params.set("sort", sort);
      selected.forEach((g) => params.append("genres[]", g));
      const url = `${API_BASE}/stories?${params.toString()}`;
      const res = await axios.get(url, { headers: { Accept: "application/json" } });
      setResults(res.data || []);
    } catch {
      setError("No se pudieron cargar historias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleGenre = (id) => {
    setSelected((curr) => {
      if (curr.includes(id)) return curr.filter((x) => x !== id);
      return [...curr, id];
    });
  };

  const sortOptions = useMemo(
    () => [
      { value: "newest", label: "Más nuevo" },
      { value: "oldest", label: "Más antiguo" },
      { value: "alpha_asc", label: "A-Z" },
      { value: "alpha_desc", label: "Z-A" },
    ],
    []
  );

  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "calc(100vh - 80px)", padding: "2rem 1rem", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* PANEL DE BÚSQUEDA Y FILTROS */}
        <div style={{
          backgroundColor: "#fff7ec",
          border: "1px solid #e0d1c3",
          borderRadius: "1.5rem",
          padding: "2rem",
          boxShadow: "0 20px 40px rgba(139, 90, 43, 0.05)",
          marginBottom: "2.5rem"
        }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#3b2f2a", marginBottom: "1.5rem", marginTop: 0 }}>
            Explorar libros
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar por título o autor..."
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

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                flex: "0 1 200px",
                padding: "0.875rem 1.25rem",
                border: "1px solid #e0d1c3",
                borderRadius: "1rem",
                backgroundColor: "transparent",
                color: "#3b2f2a",
                outline: "none",
                fontSize: "1rem",
                cursor: "pointer",
                appearance: "none",
                backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%237b6f67\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                paddingRight: "40px"
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ backgroundColor: "#fff7ec" }}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={fetchStories}
              style={{
                padding: "0.875rem 2rem",
                backgroundColor: "#d9a05b",
                color: "#fff7ec",
                border: "none",
                borderRadius: "1rem",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = "#c68c4a" }}
              onMouseOut={(e) => { e.target.style.backgroundColor = "#d9a05b" }}
              onMouseDown={(e) => { e.target.style.transform = "scale(0.97)" }}
              onMouseUp={(e) => { e.target.style.transform = "scale(1)" }}
            >
              Buscar
            </button>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setOpenGenres((o) => !o)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "2rem",
                  border: "1px solid #d9a05b",
                  backgroundColor: openGenres ? "#d9a05b" : "transparent",
                  color: openGenres ? "#fff7ec" : "#d9a05b",
                  fontWeight: "600",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {openGenres ? "Ocultar géneros" : "Filtrar por géneros"}
              </button>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {Array.from(
                  new Map(
                    selected
                      .map((id) => {
                        const g = genres.find((x) => x.id === id);
                        return g ? [String(g.name).toLowerCase().trim(), g] : null;
                      })
                      .filter(Boolean)
                  ).values()
                ).map((g) => (
                  <span
                    key={g.id}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      backgroundColor: "rgba(217,160,91,0.15)",
                      color: "#8b5a2b",
                      fontWeight: "600"
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
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
                  {Array.from(new Map(genres.map((g) => [g.id, g])).values()).map((g) => {
                    const active = selected.includes(g.id);
                    return (
                      <label
                        key={g.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.5rem 0.75rem",
                          borderRadius: "0.5rem",
                          border: active ? "1px solid #d9a05b" : "1px solid #e0d1c3",
                          backgroundColor: active ? "rgba(217,160,91,0.1)" : "transparent",
                          color: active ? "#8b5a2b" : "#7b6f67",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontWeight: active ? "600" : "normal",
                          userSelect: "none"
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleGenre(g.id);
                        }}
                      >
                        <div style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "3px",
                          border: active ? "none" : "1px solid #e0d1c3",
                          backgroundColor: active ? "#d9a05b" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}>
                          {active && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </div>
                        <span style={{ fontSize: "0.875rem" }}>{g.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FEEDBACK CARGA / ERRORES */}
        {loading && (
          <div style={{ textAlign: "center", padding: "2rem", color: "#d9a05b" }}>
            <div style={{ display: "inline-block", animation: "spin 1s linear infinite", marginBottom: "0.5rem" }}>
               <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <p style={{ margin: 0, fontWeight: "500" }}>Buscando las mejores historias...</p>
          </div>
        )}
        
        {error && (
          <div style={{ padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "0.75rem", color: "#991b1b", textAlign: "center", marginBottom: "2rem" }}>
            {error}
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#7b6f67" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d9a05b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto", marginBottom: "1rem", opacity: 0.5 }}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20"/></svg>
            <p style={{ fontSize: "1.125rem" }}>No se encontraron historias con esos criterios.</p>
            <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>Prueba a usar menos filtros o cambiar tu búsqueda.</p>
          </div>
        )}

        {/* RESULTADOS (TARJETAS) */}
        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {results.map((s) => (
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
                  boxShadow: "0 4px 6px rgba(139, 90, 43, 0.05)",
                  cursor: "default"
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 20px rgba(139, 90, 43, 0.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 6px rgba(139, 90, 43, 0.05)"; }}
              >
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "flex-start" }}>
                  <div style={{
                    width: "70px",
                    height: "105px",
                    flexShrink: 0,
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "1px solid #e0d1c3",
                    backgroundColor: "#f5ebe0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {s.cover_image ? (
                      <img 
                        src={s.cover_image.startsWith("http") ? s.cover_image : `${STORAGE_URL}/${s.cover_image}`} 
                        alt={s.title} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                       <span style={{ fontSize: "0.65rem", color: "#a89f91", textAlign: "center", padding: "0.25rem" }}>Sin<br/>portada</span>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#3b2f2a", margin: "0 0 0.25rem 0", lineHeight: "1.3" }}>
                      {s.title}
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "#7b6f67", margin: "0 0 0.5rem 0" }}>
                      Por <span style={{ fontWeight: "600", color: "#8b5a2b" }}>{s.author?.username || s.author?.name || "Autor desconocido"}</span>
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#d9a05b", fontSize: "0.875rem", fontWeight: "600" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {s.likes_count || 0}
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                    {Array.from(
                      new Map((s.genres || []).map((g) => [g.id, g])).values()
                    ).map((g) => (
                      <span
                        key={g.id}
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "1rem",
                          border: "1px solid #e0d1c3",
                          color: "#7b6f67"
                        }}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/story/${s.id}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "0.75rem",
                    backgroundColor: "transparent",
                    color: "#d9a05b",
                    border: "1px solid #d9a05b",
                    borderRadius: "0.75rem",
                    textDecoration: "none",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.color = "#fff7ec"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#d9a05b"; }}
                >
                  Leer historia
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
