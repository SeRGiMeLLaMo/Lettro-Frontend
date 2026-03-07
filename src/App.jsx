import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Search from "./pages/Search";
import CreateStory from "./pages/CreateStory";
import EditStory from "./pages/EditStory"; 
import Profile from "./pages/Profile";
import Login from "./pages/login";
import Register from "./pages/Register";
import CreateChapter from "./pages/CreateChapter";
import ChapterView from "./pages/ChapterView";



export default function App() {
return (
<Router>
<div className="min-h-screen bg-l3-bg text-l3-ink">
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/story/:id" element={<Story />} />
<Route path="/search" element={<Search />} />
<Route path="/create-story" element={<CreateStory />} />
<Route path="/stories/:id/edit" element={<EditStory />} />
<Route path="/profile/:id" element={<Profile />} /> 
<Route path="/profile/:id" element={<Profile />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/stories/:id/new-chapter" element={<CreateChapter />} />
<Route path="/chapters/:id" element={<ChapterView />} />

</Routes>
</div>
</Router>
);
}
