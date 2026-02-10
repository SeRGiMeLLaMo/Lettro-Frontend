import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-l3-card border-b border-purple-900/30 px-6 py-4 flex justify-between items-center backdrop-blur-md">
      <Link to="/" className="text-2xl font-bold text-l3-neon tracking-wide">
        L3ttro
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/search" className="text-gray-300 hover:text-l3-neon transition">
          Explorar
        </Link>

        <Link
            to="/create-story"
            className="bg-l3-purple text-white px-5 py-2 rounded-xl hover:bg-l3-light transition shadow-lg shadow-purple-500/20"
        >
            + Crear Story
        </Link>
      </div>
    </nav>
  );
}