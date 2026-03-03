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
    import { useParams, useNavigate, Link } from "react-router-dom";
    import axios from "axios";
    
    function Profile() {
      const { id } = useParams();
      const navigate = useNavigate();
    
      const [user, setUser] = useState(null);
      const [expandedStoryId, setExpandedStoryId] = useState(null); // historia con desplegable abierto
    
      useEffect(() => {
        axios
          .get(`http://localhost:8000/api/users/${id}`)
          .then((res) => setUser(res.data))
          .catch((err) => console.error(err));
      }, [id]);
    
      if (!user) return <p>Cargando perfil...</p>;
    
      const stories = user.stories || [];
      const followersCount = (user.followers || []).length;
    
      const toggleStoryDropdown = (storyId) => {
        setExpandedStoryId((current) => (current === storyId ? null : storyId));
      };
    
      const handleDeleteStory = async (storyId) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta historia?")) return;
    
        try {
          await axios.delete(`http://localhost:8000/api/stories/${storyId}`, {
            headers: {
              Accept: "application/json",
            },
          });
    
          // Actualizar estado en el frontend quitando la historia borrada
          setUser((prev) => ({
            ...prev,
            stories: (prev.stories || []).filter((s) => s.id !== storyId),
          }));
        } catch (error) {
          console.error(error);
          alert("No se pudo eliminar la historia.");
        }
      };
    
      const handleAddChapter = (storyId) => {
        // Aquí puedes navegar a una pantalla de creación de capítulo
        // ajusta la ruta a como la tengas en tu router:
        navigate(`/stories/${storyId}/new-chapter`);
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
              <h1>{user.name}</h1>
              <p>{followersCount} seguidores</p>
              <p>{stories.length} stories</p>
            </div>
          </div>
    
          <hr style={{ margin: "30px 0" }} />
    
          {/* LISTA DE STORIES */}
          <h2>Stories</h2>
    
          {stories.length === 0 ? (
            <p>Este usuario no tiene stories.</p>
          ) : (
            stories.map((story) => {
              const isOpen = expandedStoryId === story.id;
              const chapters = story.chapters || [];
    
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
                      <p>{chapters.length} capítulos</p>
                    </div>
    
                    <div style={{ display: "flex", gap: "8px" }}>
                      {/* Botón editar: ajusta la ruta a tu pantalla de edición */}
                      <Link
                        to={`/stories/${story.id}/edit`}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "4px",
                          border: "1px solid #007bff",
                          color: "#007bff",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                        }}
                      >
                        Editar
                      </Link>
    
                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => handleDeleteStory(story.id)}
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
    
                      {/* Botón desplegable capítulos */}
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
    
                  {/* DESPLEGABLE DE CAPÍTULOS */}
                  {isOpen && (
                    <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
                      {chapters.length > 0 && (
                        <ul style={{ marginBottom: "10px" }}>
                          {chapters.map((ch) => (
                            <li key={ch.id}>
                              {ch.order ? `${ch.order}. ` : ""}
                              {ch.title}
                            </li>
                          ))}
                        </ul>
                      )}
    
                      {/* Botón de añadir capítulo (siempre visible dentro del desplegable) */}
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