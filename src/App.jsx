import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Story from "./pages/story/Story";
import Search from "./pages/Search";
import CreateStory from "./pages/story/CreateStory";
import EditStory from "./pages/story/EditStory";
import EditProfile from "./pages/profileloginregister/EditProfile";
import Profile from "./pages/profileloginregister/Profile";
import Login from "./pages/profileloginregister/Login";
import Register from "./pages/profileloginregister/Register";
import CreateChapter from "./pages/chapter/CreateChapter";
import EditChapter from "./pages/chapter/EditChapter";
import ChapterView from "./pages/chapter/ChapterView";



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
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/profile/:id" element={<Profile />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/stories/:id/new-chapter" element={<CreateChapter />} />
        <Route path="/stories/:storyId/chapters/:chapterId/edit" element={<EditChapter />} />
        <Route path="/chapters/:id" element={<ChapterView />} />

</Routes>
</div>
</Router>
);
}
