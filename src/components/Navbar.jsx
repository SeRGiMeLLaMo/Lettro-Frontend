import { Link } from "react-router-dom";


export default function Navbar() {
return (
<nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
<Link to="/" className="text-2xl font-bold text-indigo-600">L3ttro</Link>
<div className="flex gap-6 items-center">
<Link to="/search" className="hover:text-indigo-600">Buscar</Link>
<button className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700">
Subir historia
</button>
</div>
</nav>
);
}