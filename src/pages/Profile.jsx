/*
  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import axios from "axios";

  function Profile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
      axios
        .get(`http://localhost:8000/api/users/${id}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error(err));
    }, [id]);

    if (!user) return <p>Cargando perfil...</p>;

    const stories = user.stories || [];
    const followersCount = (user.followers || []).length;

    return (
      <div style={{ maxWidth: "900px", margin: "40px auto" }}>
*/
    
      {/* HEADER PERFIL */}
/*
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        
        <img
          src={user.profile_photo || "https://via.placeholder.com/120"}
          alt="Foto perfil"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />

        <div>
          <h1>{user.name}</h1>
          <p>{followersCount} seguidores</p>
          <p>{stories.length} stories</p>
        </div>
      </div>

      <hr style={{ margin: "30px 0" }} />
  */
      {/* LISTA DE STORIES */}
  /*
          <h2>Stories</h2>

          {stories.length === 0 ? (
            <p>Este usuario no tiene stories.</p>
          ) : (
            stories.map((story) => (
              <div
                key={story.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "10px"
                }}
              >
                <h3>{story.title}</h3>
                <p>{story.chapters.length} capítulos</p>
              </div>
            ))
          )}
        </div>
      );
    }

    export default Profile;
  */

    import { useEffect, useState } from "react";
    import { useParams, useNavigate } from "react-router-dom";
    import axios from "axios";
    import { useAuth } from "../hooks/useAuth.js";
    
    function Profile() {
      const { id } = useParams();
      const navigate = useNavigate();
      const { user: viewer, token } = useAuth();
    
      const [user, setUser] = useState(null);
      const [following, setFollowing] = useState(false);
      const [expandedStoryId, setExpandedStoryId] = useState(null);
    
      const API_BASE =
        import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
    
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
    
      if (!user) return <p>Cargando perfil...</p>;
    
      const stories = user.stories || [];
      const followersCount = user.followers_count ?? (user.followers || []).length;
    
      const toggleStoryDropdown = (storyId) => {
        setExpandedStoryId((current) => (current === storyId ? null : storyId));
      };
    
      const handleAddChapter = (storyId) => {
        // Solo el dueño del perfil puede añadir capítulos
        if (!viewer || viewer.id !== Number(id)) return;
        navigate(`/stories/${storyId}/new-chapter`);
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
        <div style={{ maxWidth: "900px", margin: "40px auto" }}>
          {/* HEADER PERFIL */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            <img
              src={user.photo ? `http://127.0.0.1:8000/storage/${user.photo}` : "/perfilpredeterminado.png"}
              alt="Foto perfil"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "20%",
                objectFit: "cover",
                border: "1px solid #7C3AED",
              }}
            />
            <div>
              <h1>
                {user.name}{" "}
                {viewer?.id !== Number(id) && following ? (
                  <span style={{ fontSize: "0.9rem", color: "#28a745" }}>· Siguiendo</span>
                ) : null}
              </h1>
              {user.description && (
                <p className="text-sm text-l3-muted max-w-md mt-1 italic">
                  {user.description}
                </p>
              )}
              <p>{followersCount} seguidores</p>
              <p>{stories.length} stories</p>
              {viewer?.id === Number(id) && (
                <button
                  type="button"
                  onClick={() => navigate("/edit-profile")}
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "1px solid #7C3AED",
                    background: "transparent",
                    color: "#7C3AED",
                    fontSize: "0.85rem",
                    fontWeight: "600"
                  }}
                  className="hover:bg-l3-purple hover:text-white transition"
                >
                  Editar Perfil
                </button>
              )}
              {viewer?.id !== Number(id) && (
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  style={{
                    marginTop: "10px",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #007bff",
                    background: following ? "#6c757d" : "#007bff",
                    color: "white",
                    fontSize: "0.85rem",
                  }}
                >
                  {following ? "Dejar de seguir" : "Seguir"}
                </button>
              )}
            </div>
          </div>
    
          <hr style={{ margin: "30px 0" }} />
    
          {/* LISTA DE STORIES */}
          <h2>Stories</h2>
    
          {stories.length === 0 ? (
            <p>Este usuario no tiene stories.</p>
          ) : (
            stories.map((story) => {
              const likesCount = story.likes_count || 0;
              const chapters = story.chapters || [];
              const isOpen = expandedStoryId === story.id;
    
              return (
                <div
                  key={story.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>
                      <h3>{story.title}</h3>
                      <p>{likesCount} me gustas</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {viewer?.id === Number(id) && (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/stories/${story.id}/edit`)}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "4px",
                              border: "1px solid #007bff",
                              background: "white",
                              color: "#007bff",
                              fontSize: "0.85rem",
                            }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm("¿Seguro que quieres eliminar esta historia?")) return;
                              try {
                                await axios.delete(`${API_BASE}/stories/${story.id}`, {
                                  headers: {
                                    Accept: "application/json",
                                    Authorization: token ? `Bearer ${token}` : "",
                                  },
                                  withCredentials: true,
                                });
                                setUser((prev) =>
                                  prev
                                    ? { ...prev, stories: (prev.stories || []).filter((s) => s.id !== story.id) }
                                    : prev
                                );
                              } catch (error) {
                                console.error(error);
                                alert("No se pudo eliminar la historia.");
                              }
                            }}
                            style={{
                              padding: "6px 10px",
                              borderRadius: "4px",
                              border: "1px solid #dc3545",
                              background: "#dc3545",
                              color: "white",
                              fontSize: "0.85rem",
                            }}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleStoryDropdown(story.id)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "4px",
                          border: "1px solid #6c757d",
                          background: isOpen ? "#6c757d" : "white",
                          color: isOpen ? "white" : "#6c757d",
                          fontSize: "0.85rem",
                        }}
                      >
                        {isOpen ? "Ocultar capítulos" : "Ver capítulos"}
                      </button>
                    </div>
                  </div>
    
                  {isOpen && (
                    <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
                      {chapters.length > 0 ? (
                        <ul
                          style={{
                            marginBottom: "10px",
                            maxHeight: "150px",
                            overflowY: "auto",
                          }}
                        >
                          {chapters.map((ch) => (
                            <li key={ch.id}>
                              {ch.order ? `${ch.order}. ` : ""}
                              {ch.title}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "8px" }}>
                          Esta historia aún no tiene capítulos.
                        </p>
                      )}
    
                      {viewer?.id === Number(id) && (
                        <button
                          type="button"
                          onClick={() => handleAddChapter(story.id)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "4px",
                            border: "1px solid #28a745",
                            background: "#28a745",
                            color: "white",
                            fontSize: "0.85rem",
                          }}
                        >
                          Añadir capítulo
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      );
    }
    
    export default Profile;   
