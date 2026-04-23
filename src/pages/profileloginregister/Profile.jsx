import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth.js";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: viewer, token } = useAuth();

  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [expandedStoryId, setExpandedStoryId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const STORAGE_URL = API_BASE.replace("/api", "/storage");

  useEffect(() => {
    axios
      .get(`${API_BASE}/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, [id, API_BASE]);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_BASE}/users/${id}/follow/status`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      })
      .then((res) => {
        const isFollowing = !!res.data?.following;
        const count = res.data?.followers_count;
        setFollowing(isFollowing);
        if (typeof count === "number") {
          setUser((prev) => (prev ? { ...prev, followers_count: count } : prev));
        }
      })
      .catch(() => {});
  }, [id, API_BASE, token]);

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", color: "#d9a05b" }}>
        Cargando perfil...
      </div>
    );
  }

  const stories = user.stories || [];
  const followersCount = user.followers_count ?? (user.followers || []).length;

  const toggleStoryDropdown = (storyId) => {
    setExpandedStoryId((current) => (current === storyId ? null : storyId));
  };

  const handleAddChapter = (storyId) => {
    if (!viewer || viewer.id !== Number(id)) return;
    navigate(`/stories/${storyId}/new-chapter`);
  };

  const handleDeleteChapter = async (storyId, chapterId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este capítulo?")) return;
    
    try {
      await axios.delete(`${API_BASE}/chapters/${chapterId}`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      });

      setUser((prev) => {
        if (!prev) return prev;
        const updatedStories = (prev.stories || []).map((s) => {
          if (s.id === storyId) {
            return {
              ...s,
              chapters: (s.chapters || []).filter((ch) => ch.id !== chapterId),
            };
          }
          return s;
        });
        return { ...prev, stories: updatedStories };
      });
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el capítulo.");
    }
  };

  const handleToggleFollow = async () => {
    if (!viewer) {
      navigate("/register");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/users/${id}/follow/toggle`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          withCredentials: true,
        }
      );
      setFollowing(!!res.data?.following);
      if (typeof res.data?.followers_count === "number") {
        setUser((prev) => ({ ...prev, followers_count: res.data.followers_count }));
      }
    } catch (error) {
      console.error(error);
      alert("Debes iniciar sesión para seguir autores.");
    }
  };

  return (
    <div style={{ backgroundColor: "#f5ebe0", minHeight: "calc(100vh - 80px)", padding: "2rem 1rem", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "#fff7ec", border: "1px solid #e0d1c3", borderRadius: "1.5rem", padding: "2.5rem 2rem", boxShadow: "0 20px 40px rgba(139, 90, 43, 0.05)" }}>
        
        {/* HEADER TIPO INSTAGRAM */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", marginBottom: "2rem" }}>
          
          {/* FOTO (Izquierda) */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              width: "120px", height: "120px", 
              borderRadius: "50%", 
              padding: "4px",
              background: "linear-gradient(45deg, #d9a05b, #e0d1c3)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <img
                src={user.photo ? (user.photo.startsWith("http") ? user.photo : `${STORAGE_URL}/${user.photo}`) : "/perfilpredeterminado.png"}
                alt="Foto perfil"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #fff7ec",
                  backgroundColor: "#fff7ec"
                }}
              />
            </div>
          </div>

          {/* DATOS (Derecha) */}
          <div style={{ flex: 1, paddingTop: "0.5rem" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "300", color: "#3b2f2a" }}>
                {user.name}
              </h1>
              {viewer?.id !== Number(id) && following ? (
                <span style={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: "600", padding: "0.2rem 0.5rem", borderRadius: "1rem", backgroundColor: "rgba(34,197,94,0.1)" }}>
                  Siguiendo
                </span>
              ) : null}

              {/* Botones de acción */}
              {viewer?.id === Number(id) ? (
                <button
                  type="button"
                  onClick={() => navigate("/edit-profile")}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d9a05b",
                    background: "transparent",
                    color: "#d9a05b",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.color = "#fff7ec"; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#d9a05b"; }}
                >
                  Editar Perfil
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    background: following ? "#e0d1c3" : "#d9a05b",
                    color: following ? "#3b2f2a" : "#fff7ec",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.opacity = "0.8"; }}
                  onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  {following ? "Dejar de seguir" : "Seguir"}
                </button>
              )}
            </div>

            {/* Contadores */}
            <div style={{ display: "flex", gap: "2.5rem", marginBottom: "1rem" }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ display: "block", fontSize: "1.25rem", fontWeight: "600", color: "#3b2f2a" }}>{followersCount}</span>
                <span style={{ fontSize: "0.9rem", color: "#7b6f67" }}>Seguidores</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ display: "block", fontSize: "1.25rem", fontWeight: "600", color: "#3b2f2a" }}>{stories.length}</span>
                <span style={{ fontSize: "0.9rem", color: "#7b6f67" }}>Historias</span>
              </div>
            </div>

            {/* Biografía */}
            {user.description && (
              <p style={{ margin: 0, fontSize: "0.95rem", color: "#3b2f2a", lineHeight: "1.5", maxWidth: "90%" }}>
                {user.description}
              </p>
            )}
          </div>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #e0d1c3", margin: "2rem 0" }} />

        {/* LISTA DE STORIES DEL USUARIO */}
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#3b2f2a", marginBottom: "1.5rem", letterSpacing: "1px", textTransform: "uppercase" }}>
          Mis historias
        </h2>

        {stories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", border: "1px dashed #e0d1c3", borderRadius: "1rem", color: "#7b6f67" }}>
            Este usuario aún no ha publicado historias.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {stories.map((story) => {
              const likesCount = story.likes_count || 0;
              const chapters = story.chapters || [];
              const isOpen = expandedStoryId === story.id;

              return (
                <div
                  key={story.id}
                  style={{
                    border: "1px solid #e0d1c3",
                    padding: "1.5rem",
                    borderRadius: "1rem",
                    backgroundColor: "#fff7ec",
                    boxShadow: "0 2px 8px rgba(139, 90, 43, 0.03)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                      <div style={{
                        width: "60px", height: "90px",
                        borderRadius: "0.5rem", overflow: "hidden",
                        border: "1px solid #e0d1c3", backgroundColor: "#f5ebe0"
                      }}>
                        {story.cover_image ? (
                          <img 
                            src={story.cover_image.startsWith("http") ? story.cover_image : `${STORAGE_URL}/${story.cover_image}`} 
                            alt={story.title} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#a89f91", textAlign: "center", padding: "5px" }}>
                            Sin portada
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", color: "#3b2f2a", fontWeight: "700" }}>{story.title}</h3>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#7b6f67", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" color="#d9a05b"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                          {likesCount} Me gustas
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {viewer?.id === Number(id) && (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/stories/${story.id}/edit`)}
                            style={{ padding: "0.4rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #d9a05b", background: "transparent", color: "#d9a05b", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.color = "#fff7ec"; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#d9a05b"; }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm("¿Estás seguro de que quieres eliminar esta historia?")) return;
                              try {
                                await axios.delete(`${API_BASE}/stories/${story.id}`, { headers: { Accept: "application/json", Authorization: token ? `Bearer ${token}` : "" }, withCredentials: true });
                                setUser((prev) => prev ? { ...prev, stories: (prev.stories || []).filter((s) => s.id !== story.id) } : prev);
                              } catch (error) { console.error(error); alert("No se pudo eliminar la historia."); }
                            }}
                            style={{ padding: "0.4rem 0.8rem", borderRadius: "0.5rem", border: "none", background: "#ef4444", color: "#fff", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#dc2626"; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; }}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleStoryDropdown(story.id)}
                        style={{ padding: "0.4rem 0.8rem", borderRadius: "0.5rem", border: "1px solid #e0d1c3", background: isOpen ? "#e0d1c3" : "transparent", color: "#3b2f2a", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease" }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#e0d1c3"; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = isOpen ? "#e0d1c3" : "transparent"; }}
                      >
                        {isOpen ? "Ocultar capítulos" : "Ver capítulos"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "rgba(217,160,91,0.05)", borderRadius: "0.75rem", border: "1px solid #e0d1c3" }}>
                      {chapters.length > 0 ? (
                        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem 0" }}>
                          {chapters.map((ch, index) => (
                            <li 
                              key={ch.id}
                              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: index < chapters.length - 1 ? "1px dashed #e0d1c3" : "none" }}
                            >
                              <span style={{ fontSize: "0.9rem", color: "#3b2f2a" }}>
                                <strong style={{ color: "#8b5a2b", marginRight: "0.5rem" }}>#{ch.order || index + 1}</strong>
                                {ch.title}
                              </span>

                              {viewer?.id === Number(id) && (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button
                                    onClick={() => navigate(`/stories/${story.id}/chapters/${ch.id}/edit`)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", border: "1px solid #d9a05b", background: "transparent", color: "#d9a05b", cursor: "pointer", fontWeight: "600" }}
                                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.color = "#fff7ec"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#d9a05b"; }}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteChapter(story.id, ch.id)}
                                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "0.25rem", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: "600" }}
                                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#dc2626"; }}
                                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#ef4444"; }}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "0.85rem", color: "#7b6f67", margin: "0 0 1rem 0", fontStyle: "italic" }}>Esta historia aún no tiene capítulos.</p>
                      )}

                      {viewer?.id === Number(id) && (
                        <button
                          type="button"
                          onClick={() => handleAddChapter(story.id)}
                          style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", border: "none", background: "#8b5a2b", color: "#fff7ec", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#6a4420"; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#8b5a2b"; }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Añadir capítulo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
