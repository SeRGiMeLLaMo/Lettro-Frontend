import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth.js";
import { toast } from "react-hot-toast";

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
      toast.error("No se pudo eliminar el capítulo.");
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
      toast.error("Debes iniciar sesión para seguir autores.");
    }
  };

  return (
    <div className="bg-l3-bg min-h-[calc(100vh-80px)] py-8 px-4 md:py-12 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-l3-card border border-l3-border rounded-3xl p-6 md:p-10 shadow-[0_20px_40px_rgba(139,90,43,0.05)]">
        
        {/* HEADER TIPO INSTAGRAM */}
        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center sm:items-start mb-8 md:mb-10">
          
          {/* FOTO (Izquierda) */}
          <div className="shrink-0">
            <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full p-1 bg-gradient-to-tr from-l3-gold to-l3-border flex items-center justify-center">
              <img
                src={user.photo ? (user.photo.startsWith("http") ? user.photo : `${STORAGE_URL}/${user.photo}`) : "/perfilpredeterminado.png"}
                alt="Foto perfil"
                className="w-full h-full rounded-full object-cover border-4 border-l3-card bg-l3-card"
              />
            </div>
          </div>

          {/* DATOS (Derecha) */}
          <div className="flex-1 pt-0 sm:pt-2 text-center sm:text-left w-full">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-wrap mb-4 md:mb-5">
              <h1 className="m-0 text-2xl md:text-3xl font-light text-l3-paper">
                {user.name}
              </h1>
              {viewer?.id !== Number(id) && following && (
                <span className="text-xs md:text-sm text-green-600 font-bold px-3 py-1 rounded-full bg-green-500/10">
                  Siguiendo
                </span>
              )}

              {/* Botones de acción */}
              <div className="mt-2 sm:mt-0 w-full sm:w-auto flex justify-center sm:justify-start">
                {viewer?.id === Number(id) ? (
                  <button
                    type="button"
                    onClick={() => navigate("/edit-profile")}
                    className="px-5 py-2 rounded-xl border border-l3-gold bg-transparent text-l3-gold text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-l3-gold hover:text-l3-card w-full sm:w-auto"
                  >
                    Editar Perfil
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    className={`px-5 py-2 rounded-xl border-none text-sm font-bold cursor-pointer transition-all duration-200 w-full sm:w-auto ${
                      following 
                        ? "bg-l3-border text-l3-paper hover:opacity-80" 
                        : "bg-l3-gold text-l3-card hover:opacity-90"
                    }`}
                  >
                    {following ? "Dejar de seguir" : "Seguir"}
                  </button>
                )}
              </div>
            </div>

            {/* Contadores */}
            <div className="flex justify-center sm:justify-start gap-8 md:gap-10 mb-5">
              <div className="text-center">
                <span className="block text-xl md:text-2xl font-bold text-l3-paper">{followersCount}</span>
                <span className="text-sm md:text-base text-l3-muted">Seguidores</span>
              </div>
              <div className="text-center">
                <span className="block text-xl md:text-2xl font-bold text-l3-paper">{stories.length}</span>
                <span className="text-sm md:text-base text-l3-muted">Historias</span>
              </div>
            </div>

            {/* Biografía */}
            {user.description && (
              <p className="m-0 text-sm md:text-base text-l3-paper leading-relaxed max-w-full sm:max-w-[90%]">
                {user.description}
              </p>
            )}
          </div>
        </div>

        <hr className="border-none border-t border-l3-border my-8 md:my-10" />

        {/* LISTA DE STORIES DEL USUARIO */}
        <h2 className="text-lg md:text-xl font-bold text-l3-paper mb-6 tracking-wide uppercase text-center sm:text-left">
          Mis historias
        </h2>

        {stories.length === 0 ? (
          <div className="text-center p-8 md:p-12 border border-dashed border-l3-border rounded-2xl text-l3-muted">
            Este usuario aún no ha publicado historias.
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            {stories.map((story) => {
              const likesCount = story.likes_count || 0;
              const chapters = story.chapters || [];
              const isOpen = expandedStoryId === story.id;

              return (
                <div
                  key={story.id}
                  className="border border-l3-border p-4 md:p-6 rounded-2xl bg-l3-card shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start flex-wrap gap-4">
                    
                    <div className="flex gap-4 items-start w-full sm:w-auto">
                      <div className="w-16 h-24 shrink-0 rounded-lg overflow-hidden border border-l3-border bg-l3-bg">
                        {story.cover_image ? (
                          <img 
                            src={story.cover_image.startsWith("http") ? story.cover_image : `${STORAGE_URL}/${story.cover_image}`} 
                            alt={story.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-l3-muted text-center p-1">
                            Sin portada
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="m-0 mb-1 text-lg font-bold text-l3-paper leading-tight">{story.title}</h3>
                        <p className="m-0 text-sm text-l3-muted font-bold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-l3-gold"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                          {likesCount} Me gustas
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                      {viewer?.id === Number(id) && (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/stories/${story.id}/edit`)}
                            className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-l3-gold bg-transparent text-l3-gold text-xs md:text-sm font-bold cursor-pointer transition-colors duration-200 hover:bg-l3-gold hover:text-l3-card flex-1 sm:flex-none text-center"
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
                              } catch (error) { console.error(error); toast.error("No se pudo eliminar la historia."); }
                            }}
                            className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg border-none bg-red-500 text-white text-xs md:text-sm font-bold cursor-pointer transition-colors duration-200 hover:bg-red-600 flex-1 sm:flex-none text-center"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleStoryDropdown(story.id)}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-l3-border text-l3-paper text-xs md:text-sm font-bold cursor-pointer transition-colors duration-200 flex-1 sm:flex-none text-center ${
                          isOpen ? "bg-l3-border" : "bg-transparent hover:bg-l3-border/50"
                        }`}
                      >
                        {isOpen ? "Ocultar capítulos" : "Ver capítulos"}
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="mt-4 p-4 bg-l3-gold/5 rounded-xl border border-l3-border">
                      {chapters.length > 0 ? (
                        <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-2">
                          {chapters.map((ch, index) => (
                            <li 
                              key={ch.id}
                              className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2 ${
                                index < chapters.length - 1 ? "border-b border-dashed border-l3-border" : ""
                              }`}
                            >
                              <span className="text-sm md:text-base text-l3-paper font-medium">
                                <strong className="text-l3-brown mr-2">#{ch.order || index + 1}</strong>
                                {ch.title}
                              </span>

                              {viewer?.id === Number(id) && (
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => navigate(`/stories/${story.id}/chapters/${ch.id}/edit`)}
                                    className="px-3 py-1 text-xs rounded border border-l3-gold bg-transparent text-l3-gold font-bold cursor-pointer transition-colors duration-200 hover:bg-l3-gold hover:text-l3-card"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteChapter(story.id, ch.id)}
                                    className="px-3 py-1 text-xs rounded border-none bg-red-500 text-white font-bold cursor-pointer transition-colors duration-200 hover:bg-red-600"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-l3-muted m-0 mb-4 italic">Esta historia aún no tiene capítulos.</p>
                      )}

                      {viewer?.id === Number(id) && (
                        <button
                          type="button"
                          onClick={() => handleAddChapter(story.id)}
                          className="px-4 py-2 rounded-lg border-none bg-l3-brown text-l3-card text-sm font-bold cursor-pointer flex items-center gap-2 transition-colors duration-200 hover:bg-l3-brown/90 w-full sm:w-auto justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
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
