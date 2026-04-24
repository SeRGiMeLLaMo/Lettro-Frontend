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
    <div className="bg-l3-bg min-h-[calc(100vh-80px)] py-8 px-4 md:py-12 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Banner/Hero Header Principal */}
        <div className="text-center mb-10 md:mb-16 px-2">
          <h1 className="text-3xl md:text-5xl font-extrabold text-l3-paper mb-3 leading-tight tracking-tight">
            Bienvenido a <span className="text-l3-gold font-serif">L3ttro</span>
          </h1>
          <p className="text-base md:text-lg text-l3-muted max-w-2xl mx-auto font-medium leading-relaxed">
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
          <div className="flex flex-col items-center py-16 md:py-20 text-l3-gold">
            <div className="animate-spin mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <p className="text-lg font-semibold text-l3-brown">
              Abriendo estanterías...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="p-4 md:p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center mb-8 shadow-sm">
            <p className="font-medium text-sm md:text-base">{error}</p>
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className="text-center py-16 md:py-24 px-6 bg-l3-card border-2 border-dashed border-l3-gold/50 rounded-3xl text-l3-muted mx-4 md:mx-0 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-l3-gold opacity-60"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-5H20"/></svg>
            <p className="text-xl md:text-2xl font-bold text-l3-paper mb-2">Todavía no hay historias creadas.</p>
            <p className="text-base md:text-lg">¡Anímate a ser el primero en publicar una!</p>
          </div>
        )}

        {/* Carruseles por Género */}
        {!loading && !error && genres.map((genre) => {
          const genreStories = stories.filter(story => 
            story.genres?.some(g => g.id === genre.id)
          );

          if (genreStories.length === 0) return null;

          return (
            <div key={genre.id} className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-l3-gold/20">
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