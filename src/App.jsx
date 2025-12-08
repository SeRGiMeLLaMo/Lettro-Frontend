import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Search from "./pages/Search";


export default function App() {
return (
<Router>
<div className="min-h-screen bg-gray-100 text-gray-900">
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/story/:id" element={<Story />} />
<Route path="/search" element={<Search />} />
</Routes>
</div>
</Router>
);
}