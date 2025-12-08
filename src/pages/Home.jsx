import { Link } from "react-router-dom";


export default function Home() {
return (
<div className="max-w-6xl mx-auto p-6">
<h1 className="text-3xl font-bold mb-6">Historias recientes</h1>
<div className="grid md:grid-cols-3 gap-6">
{[1,2,3,4,5,6].map((id) => (
<Link key={id} to={`/story/${id}`} className="bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
<h2 className="font-semibold text-xl mb-2">Historia #{id}</h2>
<p className="text-sm text-gray-600">Descripción corta de la historia...</p>
<div className="flex justify-between text-sm mt-4 text-gray-500">
<span>❤️ 120</span>
<span>💬 34</span>
</div>
</Link>
))}
</div>
</div>
);
}