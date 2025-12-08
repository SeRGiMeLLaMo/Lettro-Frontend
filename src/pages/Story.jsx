import { useParams } from "react-router-dom";


export default function Story() {
const { id } = useParams();


return (
<div className="max-w-4xl mx-auto p-6">
<h1 className="text-4xl font-bold mb-4">Historia #{id}</h1>
<div className="bg-white rounded-2xl shadow p-6 mb-6">
<p className="text-gray-700">
Aquí irá el visor del PDF o el contenido de la historia.
</p>
</div>
<div className="flex gap-4 mb-6">
<button className="px-4 py-2 bg-red-500 text-white rounded-xl">❤️ Me gusta</button>
<button className="px-4 py-2 bg-indigo-500 text-white rounded-xl">⭐ Valorar</button>
<button className="px-4 py-2 bg-gray-200 rounded-xl">➕ Seguir</button>
</div>
<div className="bg-white rounded-2xl shadow p-4">
<h2 className="font-semibold mb-2">Comentarios</h2>
<p className="text-sm text-gray-500">Aún no hay comentarios.</p>
</div>
</div>
);
}