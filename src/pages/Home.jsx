import { useEffect, useState } from "react";
import axios from "axios";
import StoryCarousel from "../components/StoryCarousel";

export default function Home() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesRes, genresRes] = await Promise.all([
          axios.get(`${API_BASE}/stories`, {
            headers: { Accept: "application/json" },
          }),
          axios.get(`${API_BASE}/genres`, {
            headers: { Accept: "application/json" },
          }),
        ]);

        setStories(storiesRes.data || []);
        setGenres(genresRes.data || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las historias.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "calc(100vh - 80px)", padding: "3rem 1rem", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Banner/Hero Header Principal */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#3b2f2a", marginBottom: "0.5rem" }}>
            Bienvenido a <span style={{ color: "#d9a05b" }}>L3ttro</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#7b6f67", maxWidth: "600px", margin: "0 auto" }}>
            Explora un mundo infinito de historias. Descubre los últimos libros publicados por la comunidad y sumérgete en tus géneros favoritos.
          </p>
        </div>

        {/* Sección de Historias Recientes */}
        <StoryCarousel
          title="Novedades destacadas"
          description="Lecturas recién salidas del horno"
          stories={stories}
        />

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 0", color: "#d9a05b" }}>
            <div style={{ animation: "spin 1s linear infinite", marginBottom: "1rem" }}>
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <p style={{ fontSize: "1.1rem", fontWeight: "500", color: "#8b5a2b" }}>
              Abriendo estanterías...
            </p>
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: "1.5rem", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "1rem", color: "#991b1b", textAlign: "center", marginBottom: "2rem" }}>
            {error}
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 2rem", backgroundColor: "#fff7ec", border: "1px dashed #d9a05b", borderRadius: "1.5rem", color: "#7b6f67" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d9a05b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto", marginBottom: "1rem", opacity: 0.5 }}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20"/></svg>
            <p style={{ fontSize: "1.25rem", fontWeight: "500", color: "#3b2f2a", marginBottom: "0.5rem" }}>Todavía no hay historias creadas.</p>
            <p style={{ fontSize: "1rem" }}>¡Anímate a ser el primero en publicar una!</p>
          </div>
        )}

        {/* Carruseles por Género */}
        {!loading && !error && genres.map((genre) => {
          const genreStories = stories.filter(story => 
            story.genres?.some(g => g.id === genre.id)
          );

          if (genreStories.length === 0) return null;

          return (
            <div key={genre.id} style={{ marginTop: "3rem", borderTop: "1px solid rgba(217,160,91,0.2)", paddingTop: "3rem" }}>
              <StoryCarousel
                title={`Explora: ${genre.name}`}
                description={`Lo mejor del género ${genre.name.toLowerCase()}`}
                stories={genreStories}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}