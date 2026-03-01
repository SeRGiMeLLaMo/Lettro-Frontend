import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Story() {
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/stories/${id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        setStory(response.data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la historia.");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-400">Cargando historia...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-400">
          {error || "La historia no existe o ha sido eliminada."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Portada */}
        <div className="w-full max-w-md md:w-[480px] mx-auto md:mx-0">
          <div className="w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-md border border-l3-border bg-gradient-to-br from-l3-gold/40 to-l3-brown/30 flex items-center justify-center">
            {story.cover_image ? (
              <img
                src={`http://localhost:8000/storage/${story.cover_image}`}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-l3-muted px-4 text-center">
                Esta historia aún no tiene portada.
              </span>
            )}
          </div>
        </div>

        {/* Información principal */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-l3-paper">
            {story.title}
          </h1>

          <p className="text-sm md:text-base text-l3-muted mb-4">
            {story.author?.name ? `Por ${story.author.name}` : "Autor desconocido"}
          </p>

          <div className="bg-l3-card rounded-2xl shadow p-5 mb-6 border border-l3-border">
            <p className="text-sm md:text-base text-l3-paper whitespace-pre-line">
              {story.description || "Esta historia aún no tiene descripción."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 my-6">
        <button className="px-4 py-2 bg-red-500 text-white rounded-xl hover:opacity-90">
          ❤️ Me gusta
        </button>

        <button className="px-4 py-2 bg-l3-purple text-white rounded-xl hover:bg-l3-light">
          ⭐ Valorar
        </button>

        <button className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600">
          ➕ Seguir autor
        </button>
      </div>

      <div className="bg-l3-card rounded-2xl shadow p-4 border border-purple-900/30">
        <h2 className="font-semibold mb-2 text-white">Comentarios</h2>
        <p className="text-sm text-gray-400">Aún no hay comentarios.</p>
      </div>
    </div>
  );
}