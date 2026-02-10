import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-l3-neon">
        Historias recientes
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((id) => (
          <Link
            key={id}
            to={`/story/${id}`}
            className="bg-l3-card rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition border border-purple-900/30"
          >
            <div className="h-40 bg-purple-700/20 rounded-xl mb-4"></div>

            <h2 className="font-semibold text-xl text-white mb-2">
              Historia #{id}
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Una aventura escrita por la comunidad...
            </p>

            <div className="flex justify-between text-sm text-gray-300">
              <span>❤️ 120</span>
              <span>💬 34</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}