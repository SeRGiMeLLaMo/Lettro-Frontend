// Tarjeta de historia
export default function StoryCard({ title, author, rating }) {
  return (
    /*
      max-w-sm  -> evita que la tarjeta sea demasiado ancha
      w-full    -> ocupa todo el espacio disponible en móvil
    */
    <div className="bg-zinc-800 text-white rounded-2xl p-6 shadow-lg 
                    w-full max-w-sm hover:scale-105 transition duration-300">
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>

      <p className="text-sm text-gray-400 mb-4">
        Autor: {author}
      </p>

      <div className="flex items-center gap-2 text-yellow-400 mb-5">
        Valoración: <span className="text-white">{rating}</span> / 5
      </div>

      <button className="w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700">
        Leer historia
      </button>
    </div>
  );
}

