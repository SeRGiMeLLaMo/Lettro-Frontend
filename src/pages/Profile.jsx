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
      // sin desplegable de capítulos
      const [following, setFollowing] = useState(false);
    
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
    
      // eliminado: ya no se usa desplegable de capítulos
    
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
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={user.profile_photo || "/perfilpredeterminado.png"}
              alt="Foto perfil"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <h1>
                {user.name}{" "}
                {viewer?.id !== Number(id) && following ? (
                  <span style={{ fontSize: "0.9rem", color: "#28a745" }}>· Siguiendo</span>
                ) : null}
              </h1>
              <p>{followersCount} seguidores</p>
              <p>{stories.length} stories</p>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                    <div>
                      <h3>{story.title}</h3>
                      <p>{likesCount} me gustas</p>
                    </div>
                    {viewer?.id === Number(id) && (
                      <div style={{ display: "flex", gap: "8px" }}>
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
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      );
    }
    
    export default Profile;   
