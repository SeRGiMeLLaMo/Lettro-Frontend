import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Search() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
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
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-l3-paper">Buscar historias</h1>

      <div className="bg-l3-card p-4 rounded-2xl border border-l3-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por título o usuario"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 text-white border border-purple-900/30"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 text-white border border-purple-900/30"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={fetchStories}
            className="px-4 py-3 bg-l3-gold text-l3-bg rounded-xl font-semibold hover:bg-yellow-400"
          >
            Buscar
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpenGenres((o) => !o)}
              className="px-4 py-2 rounded-xl border border-l3-border bg-gray-900 text-white hover:bg-l3-chip"
            >
              Temáticas
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
                  className="text-xs px-2 py-1 rounded-full border border-l3-border text-l3-muted"
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>
          {openGenres && (
            <div className="mt-3 p-3 rounded-2xl border border-l3-border bg-gray-900">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {Array.from(new Map(genres.map((g) => [g.id, g])).values()).map((g) => {
                  const active = selected.includes(g.id);
                  return (
                    <label
                      key={g.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer ${
                        active
                          ? "bg-purple-700/30 border-purple-500 text-white"
                          : "bg-gray-800 border-purple-900/30 text-gray-300"
                      }`}
                      onClick={() => toggleGenre(g.id)}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => {}}
                        className="accent-purple-500"
                      />
                      <span className="text-sm">{g.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && <p className="text-gray-400">Cargando...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((s) => (
          <div
            key={s.id}
            className="bg-l3-card p-4 rounded-2xl border border-l3-border"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-white">{s.title}</h2>
              <span className="text-sm text-l3-muted">
                {s.likes_count || 0} ❤️
              </span>
            </div>
            <p className="text-sm text-l3-muted mb-2">
              {s.author?.username || s.author?.name || "Autor desconocido"}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {Array.from(
                new Map((s.genres || []).map((g) => [g.id, g])).values()
              ).map((g) => (
                <span
                  key={g.id}
                  className="text-xs px-2 py-1 rounded-full border border-l3-border text-l3-muted"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <Link
              to={`/story/${s.id}`}
              className="inline-block px-3 py-2 bg-l3-purple text-white rounded-xl hover:bg-l3-light text-sm"
            >
              Ver historia
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
