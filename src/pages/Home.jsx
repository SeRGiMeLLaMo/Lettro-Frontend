import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stories", {
          headers: {
            Accept: "application/json",
          },
        });
        setStories(response.data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las historias.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-l3-neon">
        Historias recientes
      </h1>

      {loading && (
        <p className="text-gray-400 mb-4">Cargando historias...</p>
      )}

      {!loading && error && (
        <p className="text-red-400 mb-4">{error}</p>
      )}

      {!loading && !error && stories.length === 0 && (
        <p className="text-gray-400 mb-4">
          Todavía no hay historias creadas.
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {!loading &&
          !error &&
          stories.map((story) => (
            <Link
              key={story.id}
              to={`/story/${story.id}`}
              className="bg-l3-card rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition border border-purple-900/30"
            >
              <div className="h-40 bg-purple-700/20 rounded-xl mb-4"></div>

              <h2 className="font-semibold text-xl text-white mb-2">
                {story.title}
              </h2>

              <p className="text-sm text-gray-400 mb-4">
                {story.description
                  ? `${story.description.slice(0, 120)}${
                      story.description.length > 120 ? "..." : ""
                    }`
                  : "Sin descripción."}
              </p>

              <div className="flex justify-between text-sm text-gray-300">
                <span>{story.author?.name || "Autor desconocido"}</span>
                <span>ID #{story.id}</span>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}