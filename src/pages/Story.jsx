import { useParams } from "react-router-dom";

export default function Story() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4 text-l3-neon">
        Historia #{id}
      </h1>

      <div className="bg-l3-card rounded-2xl shadow p-6 mb-6 border border-purple-900/30">
        <p className="text-gray-300">
          Aquí irá el visor del PDF o el contenido de la historia.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
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