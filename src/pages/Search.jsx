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
    <div className="bg-l3-bg min-h-[calc(100vh-80px)] py-8 px-4 md:py-12 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* PANEL DE BÚSQUEDA Y FILTROS */}
        <div className="bg-l3-card border border-l3-border rounded-3xl p-6 md:p-8 shadow-[0_20px_40px_rgba(139,90,43,0.05)] mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-l3-paper mb-6 mt-0">
            Explorar libros
          </h1>

          <div className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-center">
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-grow min-w-[200px] md:min-w-[300px] px-5 py-3.5 border border-l3-border rounded-2xl bg-transparent text-l3-paper outline-none text-base transition-colors focus:border-l3-gold focus:ring-1 focus:ring-l3-gold"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="md:flex-none w-full md:w-48 px-5 py-3.5 border border-l3-border rounded-2xl bg-transparent text-l3-paper outline-none text-base cursor-pointer appearance-none bg-no-repeat focus:border-l3-gold"
              style={{
                backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%237b6f67\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                backgroundPosition: "right 16px center",
                paddingRight: "48px"
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-l3-card">
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={fetchStories}
              className="w-full md:w-auto px-8 py-3.5 bg-l3-gold hover:bg-l3-goldHover active:scale-95 text-l3-card rounded-2xl font-bold text-base cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Buscar
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => setOpenGenres((o) => !o)}
                className={`px-4 py-2 rounded-full border border-l3-gold font-semibold text-sm transition-colors duration-200 ${
                  openGenres ? "bg-l3-gold text-l3-card" : "bg-transparent text-l3-gold hover:bg-l3-gold/10"
                }`}
              >
                {openGenres ? "Ocultar géneros" : "Filtrar por géneros"}
              </button>
              
              <div className="flex flex-wrap gap-2">
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
                    className="text-xs px-3 py-1.5 rounded-full bg-l3-gold/15 text-l3-brown font-bold"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            {openGenres && (
              <div className="mt-5 p-5 md:p-6 rounded-2xl bg-l3-gold/5 border border-l3-gold/20">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from(new Map(genres.map((g) => [g.id, g])).values()).map((g) => {
                    const active = selected.includes(g.id);
                    return (
                      <label
                        key={g.id}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleGenre(g.id);
                        }}
                        className={`flex items-center gap-2 p-2 px-3 rounded-lg border cursor-pointer select-none transition-all duration-200 ${
                          active 
                            ? "border-l3-gold bg-l3-gold/10 text-l3-brown font-semibold" 
                            : "border-l3-border bg-transparent text-l3-muted hover:bg-white"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                          active ? "border-transparent bg-l3-gold" : "border-l3-border bg-transparent"
                        }`}>
                          {active && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </div>
                        <span className="text-sm truncate">{g.name}</span>
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
          <div className="text-center py-10 text-l3-gold">
            <div className="inline-block animate-spin mb-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <p className="m-0 font-medium text-l3-brown">Buscando las mejores historias...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center mb-8">
            {error}
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="text-center py-16 px-4 text-l3-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-l3-gold opacity-50"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20"/></svg>
            <p className="text-lg font-medium text-l3-paper mb-1">No se encontraron historias con esos criterios.</p>
            <p className="text-sm opacity-80">Prueba a usar menos filtros o cambiar tu búsqueda.</p>
          </div>
        )}

        {/* RESULTADOS (TARJETAS) */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((s) => (
              <div
                key={s.id}
                className="bg-l3-card border border-l3-border rounded-2xl p-5 md:p-6 flex flex-col shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
              >
                <div className="flex gap-4 mb-4 items-start">
                  <div className="w-20 h-[120px] shrink-0 rounded-lg overflow-hidden border border-l3-border bg-l3-bg flex items-center justify-center">
                    {s.cover_image ? (
                      <img 
                        src={s.cover_image.startsWith("http") ? s.cover_image : `${STORAGE_URL}/${s.cover_image}`} 
                        alt={s.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                       <span className="text-[0.65rem] text-l3-muted text-center p-1 font-medium leading-tight">Sin<br/>portada</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-xl font-bold text-l3-paper m-0 mb-1 leading-tight line-clamp-2">
                      {s.title}
                    </h2>
                    <p className="text-sm text-l3-muted m-0 mb-2 truncate">
                      Por <span className="font-semibold text-l3-brown">{s.author?.username || s.author?.name || "Autor desconocido"}</span>
                    </p>
                    <div className="flex items-center gap-1 text-l3-gold text-sm font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                      {s.likes_count || 0}
                    </div>
                  </div>
                </div>

                <div className="flex-1 mb-4">
                  <div className="flex flex-wrap gap-1.5 h-[3.5em] overflow-hidden">
                    {Array.from(
                      new Map((s.genres || []).map((g) => [g.id, g])).values()
                    ).slice(0,4).map((g) => (
                      <span
                        key={g.id}
                        className="text-[0.7rem] px-2.5 py-1 rounded-full border border-l3-border text-l3-muted whitespace-nowrap"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/story/${s.id}`}
                  className="block text-center p-3 text-l3-gold border-2 border-l3-gold rounded-xl no-underline font-bold text-sm transition-colors duration-200 hover:bg-l3-gold hover:text-l3-card"
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
