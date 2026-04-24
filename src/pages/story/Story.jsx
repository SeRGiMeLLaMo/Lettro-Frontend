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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5ebe0" }}>
      <p style={{ color: "#7b6f67" }}>Cargando historia...</p>
    </div>
  );

  if (error || !story) return (
    <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#f5ebe0", minHeight: "100vh" }}>
      <p style={{ color: "#991b1b" }}>{error || "Historia no encontrada."}</p>
    </div>
  );

  const chapters = (story.chapters || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  const isAuthor = user?.id && story?.author?.id && Number(user.id) === Number(story.author.id);

  return (
    <div style={{ 
      backgroundColor: "#f5ebe0", 
      minHeight: "100vh", 
      padding: "3rem 1rem",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* HEADER: Cover + Info */}
        <div style={{ 
          display: "flex", 
          gap: "2.5rem", 
          alignItems: "flex-start", 
          marginBottom: "3rem",
          flexWrap: "wrap"
        }}>
          {/* Cover */}
          <div style={{ 
            width: "240px", 
            height: "360px",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(139, 90, 43, 0.15)",
            border: "2px solid #fff",
            backgroundColor: "#fff7ec",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            {story.cover_image ? (
              <img 
                src={story.cover_image.startsWith("http") ? story.cover_image : `${STORAGE_URL}/${story.cover_image}`} 
                alt={story.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <span style={{ color: "#d9a05b", fontSize: "0.875rem", fontWeight: "600" }}>Sin Portada</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
              {story.genres?.map(g => (
                <span key={g.id} style={{ fontSize: "0.7rem", fontWeight: "700", color: "#d9a05b", backgroundColor: "rgba(217,160,91,0.1)", padding: "0.25rem 0.75rem", borderRadius: "2rem", textTransform: "uppercase" }}>
                  {g.name}
                </span>
              ))}
            </div>
            
            <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#3b2f2a", margin: 0, fontFamily: "serif", lineHeight: 1.1 }}>
              {story.title}
            </h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "#7b6f67" }}>por</span>
              <Link to={`/profile/${story.author?.id}`} style={{ color: "#d9a05b", fontWeight: "700", textDecoration: "none" }}>
                {story.author?.username}
              </Link>
            </div>

            <div style={{ display: "flex", gap: "2rem", marginTop: "1rem" }}>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "#3b2f2a" }}>{likesCount}</div>
                <div style={{ fontSize: "0.75rem", color: "#7b6f67", textTransform: "uppercase", fontWeight: "600" }}>Lectores</div>
              </div>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "#3b2f2a" }}>{chapters.length}</div>
                <div style={{ fontSize: "0.75rem", color: "#7b6f67", textTransform: "uppercase", fontWeight: "600" }}>Capítulos</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              {!isAuthor && (
                <>
                  <button 
                    onClick={handleToggleLike}
                    style={{ 
                      flex: 1, 
                      padding: "0.8rem", 
                      borderRadius: "0.75rem", 
                      border: liked ? "none" : "1px solid #d9a05b", 
                      backgroundColor: liked ? "#d9a05b" : "transparent",
                      color: liked ? "#fff7ec" : "#d9a05b",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {liked ? "♥ Siguiendo" : "♡ Me gusta"}
                  </button>
                  <button 
                    onClick={handleToggleFollow}
                    style={{ 
                      flex: 1, 
                      padding: "0.8rem", 
                      borderRadius: "0.75rem", 
                      border: "none", 
                      backgroundColor: following ? "#3b2f2a" : "#fff",
                      color: following ? "#fff7ec" : "#3b2f2a",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    {following ? "✓ Siguiendo autor" : "+ Seguir autor"}
                  </button>
                </>
              )}
              {isAuthor && (
                <button 
                  onClick={() => navigate(`/stories/${id}/create-chapter`)}
                  style={{ 
                    flex: 1, 
                    padding: "0.8rem", 
                    borderRadius: "0.75rem", 
                    border: "none", 
                    backgroundColor: "#d9a05b", 
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  + Nuevo Capítulo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sinopsis Card */}
        <div style={{ 
          backgroundColor: "#fff7ec", 
          padding: "2.5rem", 
          borderRadius: "1.5rem", 
          border: "1px solid #e0d1c3",
          marginBottom: "3rem",
          boxShadow: "0 10px 30px rgba(139, 90, 43, 0.05)"
        }}>
          <h3 style={{ fontSize: "0.75rem", color: "#d9a05b", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 1rem 0" }}>Sinopsis</h3>
          <p style={{ color: "#3b2f2a", lineHeight: 1.8, margin: 0, fontSize: "1.1rem" }}>
            {story.description || "Esta obra aguarda un resumen..."}
          </p>
        </div>

        {/* Chapters List */}
        <div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#3b2f2a", marginBottom: "1.5rem" }}>Tabla de contenidos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {chapters.length === 0 ? (
              <p style={{ color: "#7b6f67", textAlign: "center", padding: "2rem" }}>Aún no hay capítulos publicados.</p>
            ) : (
              chapters.map((ch, idx) => (
                <div key={ch.id} style={{ 
                  backgroundColor: "#fff7ec", 
                  padding: "1.25rem 2rem", 
                  borderRadius: "1rem", 
                  border: "1px solid #e0d1c3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = "#d9a05b"; e.currentTarget.style.transform = "translateX(5px)"; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e0d1c3"; e.currentTarget.style.transform = "translateX(0)"; }}
                onClick={() => navigate(`/chapters/${ch.id}`)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <span style={{ color: "#d9a05b", fontWeight: "800", fontSize: "1.1rem", minWidth: "2rem" }}>
                      {(ch.order || idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span style={{ color: "#3b2f2a", fontWeight: "600", fontSize: "1rem" }}>{ch.title}</span>
                  </div>
                  
                  {isAuthor && (
                    <div style={{ display: "flex", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => navigate(`/stories/${id}/chapters/${ch.id}/edit`)}
                        style={{ border: "none", background: "none", color: "#7b6f67", cursor: "pointer", padding: "0.5rem" }}
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => handleDeleteChapter(ch.id)}
                        style={{ border: "none", background: "none", color: "#991b1b", cursor: "pointer", padding: "0.5rem" }}
                      >
                        ✕
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
