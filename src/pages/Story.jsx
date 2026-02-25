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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2 text-l3-neon">
        {story.title}
      </h1>

      <p className="text-gray-400 mb-4">
        {story.author?.name ? `Por ${story.author.name}` : "Autor desconocido"}
      </p>

      <div className="bg-l3-card rounded-2xl shadow p-6 mb-6 border border-purple-900/30">
        <p className="text-gray-300 whitespace-pre-line">
          {story.description || "Esta historia aún no tiene descripción."}
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
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