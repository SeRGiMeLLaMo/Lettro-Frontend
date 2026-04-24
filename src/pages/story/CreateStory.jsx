import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import axios from "axios";
import { toast } from "react-hot-toast";

const genresList = [
  { id: 1, name: "Fantasía" },
  { id: 2, name: "Ciencia ficción" },
  { id: 3, name: "Romance" },
  { id: 4, name: "Terror" },
  { id: 5, name: "Misterio" },
  { id: 6, name: "Aventura" },
  { id: 7, name: "Drama" },
  { id: 8, name: "Comedia" },
  { id: 9, name: "Histórica" },
  { id: 10, name: "Juvenil" },
];

export default function CreateStory() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_image: null,
    genres: [], 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ 
      ...form, 
      [e.target.name]: e.target.value 
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ 
        ...form, 
        cover_image: file
      });
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleGenre = (id) => {
    if (form.genres.includes(id)) {
      setForm({
        ...form,
        genres: form.genres.filter((g) => g !== id),
      });
    } else {
      setForm({
        ...form,
        genres: [...form.genres, id],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!user || !token) {
      toast.error("Debes iniciar sesión para crear historias.");
      navigate("/login");
      return;
    }

    setLoading(true);
    setErrors(null);

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);

    if (form.cover_image) {
      data.append("cover_image", form.cover_image);
    }
    form.genres.forEach((id) => {
      data.append("genre_id[]", id);
    });

    try {
      const response = await axios.post(`${API_BASE}/stories`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        withCredentials: true,
      });

      toast.success("Story creada correctamente 🎉");
      navigate(user?.id ? `/profile/${user.id}` : "/");
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
        console.log("Errores de validación:", error.response.data.errors);
      } else {
        console.error("Error al crear historia:", error.response?.data || error.message);
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.75rem 0.5rem",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid #e0d1c3",
    outline: "none",
    color: "#3b2f2a",
    fontSize: "1rem",
    transition: "border-color 0.2s ease",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.25rem",
    color: "#7b6f67",
    fontSize: "0.875rem",
    fontWeight: "500"
  };

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "calc(100vh - 80px)", 
      padding: "2rem 1rem",
      backgroundColor: "#f5ebe0",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div 
        style={{ 
          width: "100%",
          maxWidth: "700px", 
          margin: "0 auto", 
          padding: "2.5rem 2rem", 
          backgroundColor: "#fff7ec",
          border: "1px solid #e0d1c3",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 40px rgba(139, 90, 43, 0.08)",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "absolute", top: "-2.5rem", right: "-2.5rem", width: "10rem", height: "10rem", backgroundColor: "rgba(217,160,91,0.15)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", bottom: "-2.5rem", left: "-2.5rem", width: "10rem", height: "10rem", backgroundColor: "rgba(139,90,43,0.1)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }}></div>
        
        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "800", color: "#3b2f2a", margin: 0 }}>
              Crear nueva Story
            </h2>
            <p style={{ color: "#7b6f67", marginTop: "0.5rem", fontSize: "0.875rem" }}>
              Comparte tu imaginación con el mundo
            </p>
          </div>

          {errors && (
            <div style={{ marginBottom: "1.5rem", padding: "0.75rem", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "0.5rem" }}>
              {Object.entries(errors).map(([key, messages], i) => (
                <div key={i} style={{ fontSize: "0.875rem", color: "#991b1b", marginBottom: "0.25rem" }}>
                  <strong>{key}:</strong> {Array.isArray(messages) ? messages.join(", ") : messages}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Portada */}
            <div>
              <label style={labelStyle}>Imagen de portada</label>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "0.5rem" }}>
                <div style={{
                  width: "90px",
                  height: "135px",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  border: "1px dashed #d9a05b",
                  backgroundColor: "rgba(217,160,91,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 20px rgba(139,90,43,0.05)"
                }}>
                  {preview ? (
                    <img src={preview} alt="Portada" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ color: "#7b6f67", fontSize: "0.7rem", textAlign: "center", padding: "0.5rem" }}>Sin<br/>portada</span>
                  )}
                </div>
                <label style={{ 
                  cursor: "pointer", 
                  backgroundColor: "transparent", 
                  border: "1px solid #d9a05b", 
                  color: "#d9a05b", 
                  padding: "0.5rem 1rem", 
                  borderRadius: "2rem", 
                  fontSize: "0.875rem", 
                  fontWeight: "600",
                  transition: "all 0.2s ease"
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.color = "#fff7ec"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#d9a05b"; }}>
                  Subir imagen
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                </label>
              </div>
            </div>

            {/* Título */}
            <div>
              <label style={labelStyle}>Título</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderBottomColor = "#d9a05b"}
                onBlur={(e) => e.target.style.borderBottomColor = "#e0d1c3"}
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label style={labelStyle}>Descripción / Sinopsis</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem",
                  backgroundColor: "transparent",
                  border: "1px solid #e0d1c3",
                  borderRadius: "0.75rem",
                  outline: "none",
                  color: "#3b2f2a",
                  fontSize: "1rem",
                  minHeight: "120px",
                  resize: "vertical",
                  transition: "border-color 0.2s ease",
                  marginTop: "0.25rem"
                }}
                onFocus={(e) => e.target.style.borderColor = "#d9a05b"}
                onBlur={(e) => e.target.style.borderColor = "#e0d1c3"}
                required
              />
            </div>

            {/* Géneros */}
            <div>
              <label style={labelStyle}>Géneros (puedes elegir varios)</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.5rem", marginTop: "0.5rem" }}>
                {genresList.map((genre) => {
                  const isSelected = form.genres.includes(genre.id);
                  return (
                    <div 
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        borderRadius: "0.5rem",
                        border: isSelected ? "1px solid #d9a05b" : "1px solid #e0d1c3",
                        backgroundColor: isSelected ? "rgba(217,160,91,0.1)" : "transparent",
                        color: isSelected ? "#8b5a2b" : "#7b6f67",
                        fontSize: "0.875rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: isSelected ? "600" : "400",
                        userSelect: "none"
                      }}
                    >
                      <div style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "3px",
                        border: isSelected ? "none" : "1px solid #e0d1c3",
                        backgroundColor: isSelected ? "#d9a05b" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                      {genre.name}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                marginTop: "1rem",
                borderRadius: "0.75rem",
                border: "none",
                backgroundColor: "#d9a05b", 
                color: "#fff7ec",
                fontWeight: "bold",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "transform 0.1s ease",
              }}
              onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = "scale(0.98)" }}
              onMouseUp={(e) => { if (!loading) e.currentTarget.style.transform = "scale(1)" }}
            >
              {loading ? "Creando..." : "Publicar Story"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
