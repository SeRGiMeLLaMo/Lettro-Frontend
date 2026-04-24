import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth.js";
import { toast } from "react-hot-toast";

export default function Story() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const STORAGE_URL = API_BASE.replace("/api", "/storage");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`${API_BASE}/stories/${id}`, {
          headers: { Accept: "application/json" },
        });
        const s = response.data;
        setStory(s);
        setLikesCount(s.likes_count || 0);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la historia.");
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id, API_BASE]);

  useEffect(() => {
    const authorId = story?.author?.id;
    if (!authorId) return;
    axios
      .get(`${API_BASE}/users/${authorId}/follow/status`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      })
      .then((res) => {
        setFollowing(!!res.data?.following);
      })
      .catch(() => {
        setFollowing(false);
      });
  }, [story?.author?.id, API_BASE, token]);

  const handleToggleLike = async () => {
    if (!user) { navigate("/register"); return; }
    if (user?.id && story?.author?.id && user.id === story.author.id) return;
    try {
      const res = await axios.post(
        `${API_BASE}/likes/toggle`,
        { story_id: Number(id) },
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          withCredentials: true,
        }
      );
      const nowLiked = !!res.data?.liked;
      setLiked(nowLiked);
      setLikesCount((c) => c + (nowLiked ? 1 : -1));
    } catch (err) {
      console.error(err);
      toast.error("Necesitas iniciar sesión para dar me gusta.");
    }
  };

  const handleToggleFollow = async () => {
    if (!user) { navigate("/register"); return; }
    const authorId = story?.author?.id;
    if (!authorId || user?.id === authorId) return;
    try {
      const res = await axios.post(`${API_BASE}/users/${authorId}/follow/toggle`, {}, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      });
      setFollowing(!!res.data?.following);
    } catch (err) {
      console.error(err);
      toast.error("Debes iniciar sesión para seguir autores.");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este capítulo?")) return;
    try {
      await axios.delete(`${API_BASE}/chapters/${chapterId}`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      });
      setStory((prev) => ({
        ...prev,
        chapters: prev.chapters.filter((ch) => ch.id !== chapterId),
      }));
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el capítulo.");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-l3-bg">
      <div className="animate-spin text-l3-gold mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
    </div>
  );

  if (error || !story) return (
    <div className="text-center py-16 bg-l3-bg min-h-[calc(100vh-80px)]">
      <p className="text-red-600 font-bold">{error || "Historia no encontrada."}</p>
    </div>
  );

  const chapters = (story.chapters || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  const isAuthor = user?.id && story?.author?.id && Number(user.id) === Number(story.author.id);

  return (
    <div className="bg-l3-bg min-h-screen py-8 px-4 md:py-12 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER: Cover + Info */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10 items-center md:items-start mb-10 md:mb-12">
          {/* Cover */}
          <div className="w-[200px] h-[300px] md:w-[240px] md:h-[360px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(139,90,43,0.15)] border-2 border-white bg-l3-card flex items-center justify-center shrink-0">
            {story.cover_image ? (
              <img 
                src={story.cover_image.startsWith("http") ? story.cover_image : `${STORAGE_URL}/${story.cover_image}`} 
                alt={story.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <span className="text-l3-gold text-sm font-semibold">Sin Portada</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-[300px] flex flex-col gap-4 w-full text-center md:text-left items-center md:items-start">
            <div className="flex gap-2 flex-wrap mb-1 justify-center md:justify-start">
              {story.genres?.map(g => (
                <span key={g.id} className="text-[0.7rem] font-bold text-l3-gold bg-l3-gold/10 px-3 py-1 rounded-full uppercase">
                  {g.name}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-l3-paper m-0 font-serif leading-[1.1]">
              {story.title}
            </h1>
            
            <div className="flex items-center gap-2">
              <span className="text-l3-muted">por</span>
              <Link to={`/profile/${story.author?.id}`} className="text-l3-gold font-bold no-underline hover:underline">
                {story.author?.username}
              </Link>
            </div>

            <div className="flex gap-8 mt-4">
              <div className="text-center md:text-left">
                <div className="text-2xl font-extrabold text-l3-paper">{likesCount}</div>
                <div className="text-xs text-l3-muted uppercase font-semibold">Lectores</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-extrabold text-l3-paper">{chapters.length}</div>
                <div className="text-xs text-l3-muted uppercase font-semibold">Capítulos</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 mt-6">
              {!isAuthor && (
                <>
                  <button 
                    onClick={handleToggleLike}
                    className={`flex-1 sm:flex-none min-w-[140px] px-6 py-3 rounded-xl font-bold cursor-pointer transition-all duration-200 ${
                      liked 
                        ? "bg-l3-gold text-l3-card border-none shadow-md" 
                        : "bg-transparent text-l3-gold border border-l3-gold hover:bg-l3-gold hover:text-l3-card"
                    }`}
                  >
                    {liked ? "♥ Siguiendo" : "♡ Me gusta"}
                  </button>
                  <button 
                    onClick={handleToggleFollow}
                    className={`flex-1 sm:flex-none min-w-[140px] px-6 py-3 rounded-xl font-bold cursor-pointer border-none shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-200 ${
                      following 
                        ? "bg-l3-paper text-l3-card" 
                        : "bg-white text-l3-paper hover:bg-gray-50"
                    }`}
                  >
                    {following ? "✓ Siguiendo autor" : "+ Seguir autor"}
                  </button>
                </>
              )}
              {isAuthor && (
                <button 
                  onClick={() => navigate(`/stories/${id}/create-chapter`)}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl border-none bg-l3-gold text-white font-bold cursor-pointer hover:bg-l3-goldHover transition-colors shadow-md"
                >
                  + Nuevo Capítulo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sinopsis Card */}
        <div className="bg-l3-card p-6 md:p-10 rounded-3xl border border-l3-border mb-10 shadow-[0_10px_30px_rgba(139,90,43,0.05)]">
          <h3 className="text-xs text-l3-gold uppercase tracking-[2px] m-0 mb-4 font-bold">Sinopsis</h3>
          <p className="text-l3-paper leading-relaxed m-0 text-base md:text-lg">
            {story.description || "Esta obra aguarda un resumen..."}
          </p>
        </div>

        {/* Chapters List */}
        <div>
          <h3 className="text-2xl font-extrabold text-l3-paper mb-6">Tabla de contenidos</h3>
          <div className="flex flex-col gap-3">
            {chapters.length === 0 ? (
              <p className="text-l3-muted text-center py-8">Aún no hay capítulos publicados.</p>
            ) : (
              chapters.map((ch, idx) => (
                <div key={ch.id} 
                  className="bg-l3-card px-5 md:px-8 py-4 md:py-5 rounded-2xl border border-l3-border flex items-center justify-between transition-all duration-200 cursor-pointer hover:border-l3-gold hover:translate-x-1 group shadow-sm"
                  onClick={() => navigate(`/chapters/${ch.id}`)}
                >
                  <div className="flex items-center gap-4 md:gap-6 w-full">
                    <span className="text-l3-gold font-extrabold text-lg md:text-xl min-w-[2rem]">
                      {(ch.order || idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-l3-paper font-semibold text-base md:text-lg truncate mr-auto">
                      {ch.title}
                    </span>
                  </div>
                  
                  {isAuthor && (
                    <div className="flex gap-2 shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => navigate(`/stories/${id}/chapters/${ch.id}/edit`)}
                        className="border-none bg-transparent text-l3-muted hover:text-l3-gold cursor-pointer p-2 transition-colors"
                        title="Editar capítulo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteChapter(ch.id)}
                        className="border-none bg-transparent text-red-400 hover:text-red-600 cursor-pointer p-2 transition-colors"
                        title="Eliminar capítulo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
