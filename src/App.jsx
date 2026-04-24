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
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff7ec",
            color: "#3b2f2a",
            border: "1px solid #e0d1c3",
            borderRadius: "1rem",
            boxShadow: "0 10px 25px rgba(139, 90, 43, 0.1)",
            padding: "1rem",
            fontSize: "0.95rem",
          },
          success: {
            iconTheme: {
              primary: "#d9a05b",
              secondary: "#fff7ec",
            },
          },
          error: {
            iconTheme: {
              primary: "#8b5a2b",
              secondary: "#fff7ec",
            },
          },
        }}
      />
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
    </GoogleOAuthProvider>
  );
}
