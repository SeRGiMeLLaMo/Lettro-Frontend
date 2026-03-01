import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Search from "./pages/Search";
import CreateStory from "./pages/CreateStory";
import Profile from "./pages/Profile";


export default function App() {
return (
<Router>
<div className="min-h-screen bg-l3-bg text-white">
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/story/:id" element={<Story />} />
<Route path="/search" element={<Search />} />
<Route path="/create-story" element={<CreateStory />} />
<Route path="/profile/:id" element={<Profile />} />
</Routes>
</div>
</Router>
);
}