import { useEffect, useState } from "react";
import axios from "axios";
import StoryCarousel from "../components/StoryCarousel";

export default function Home() {
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesRes, genresRes] = await Promise.all([
          axios.get("http://localhost:8000/api/stories", {
            headers: { Accept: "application/json" },
          }),
          axios.get("http://localhost:8000/api/genres", {
            headers: { Accept: "application/json" },
          }),
        ]);

        // Limitar a 25 historias máximo en total si fuera necesario, 
        // pero aquí las usaremos para filtrar por género.
        setStories(storiesRes.data.slice(0, 25));
        setGenres(genresRes.data);
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
    <div className="max-w-7xl mx-auto p-6">
      {/* Sección de Historias Recientes */}
      <StoryCarousel
        title="Historias recientes"
        description="Descubre los últimos libros publicados por la comunidad."
        stories={stories}
      />

      {loading && (
        <div className="flex justify-center py-20">
          <p className="text-l3-muted animate-pulse font-medium text-lg">
            Cargando biblioteca...
          </p>
        </div>
      )}

      {!loading && error && (
        <p className="text-red-400 mb-4 text-center bg-red-50 py-4 rounded-xl border border-red-100">
          {error}
        </p>
      )}

      {!loading && !error && stories.length === 0 && (
        <p className="text-gray-400 mb-4 text-center py-20 bg-l3-card/30 rounded-3xl border border-dashed border-l3-border">
          Todavía no hay historias creadas.
        </p>
      )}

      {/* Carruseles por Género */}
      {!loading && !error && genres.map((genre) => {
        // Filtrar historias que tengan este género
        const genreStories = stories.filter(story => 
          story.genres?.some(g => g.id === genre.id)
        );

        return (
          <StoryCarousel
            key={genre.id}
            title={`Historias de ${genre.name}`}
            description={`Sumérgete en lo mejor del género ${genre.name.toLowerCase()}.`}
            stories={genreStories}
          />
        );
      })}
    </div>
  );
}