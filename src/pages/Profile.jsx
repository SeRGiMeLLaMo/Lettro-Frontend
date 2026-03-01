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

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      
      {/* HEADER PERFIL */}
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
          <p>{user.followers.length} seguidores</p>
          <p>{user.stories.length} stories</p>
        </div>
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* LISTA DE STORIES */}
      <h2>Stories</h2>

      {user.stories.length === 0 ? (
        <p>Este usuario no tiene stories.</p>
      ) : (
        user.stories.map((story) => (
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