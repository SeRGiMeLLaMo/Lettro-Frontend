import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth.js";
import { toast } from "react-hot-toast";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, token, setUser } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const STORAGE_URL = API_BASE.replace("/api", "/storage");

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [errors, setErrors] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/me`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        setForm({
          name: data.name || "",
          email: data.email || "",
          description: data.description || "",
          photo: null,
        });
        if (data.photo) {
          let photoUrl = data.photo;
          if (!photoUrl.startsWith("http")) {
            const cleanStorageUrl = STORAGE_URL.endsWith("/") ? STORAGE_URL.slice(0, -1) : STORAGE_URL;
            const cleanPhotoPath = data.photo.startsWith("/") ? data.photo.slice(1) : data.photo;
            photoUrl = `${cleanStorageUrl}/${cleanPhotoPath}`;
          }
          setPreview(photoUrl);
        } else if (data.google_photo) {
          // Si no hay foto subida, usamos la de Google como preview inicial
          setPreview(data.google_photo);
        }
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar tu perfil.");
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchProfile();
  }, [user, token, navigate, API_BASE]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        photo: file,
      });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("description", form.description || "");
    if (form.photo) {
      data.append("photo", form.photo);
    }
    data.append("_method", "PUT");

    try {
      const res = await axios.post(`${API_BASE}/me`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Perfil actualizado correctamente 🎉");
      setUser(res.data); 
      navigate(`/profile/${res.data.id}`);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
        toast.error("Ocurrió un error al actualizar el perfil.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5ebe0" }}>
        <p style={{ color: "#7b6f67" }}>Cargando perfil...</p>
      </div>
    );
  }

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
          maxWidth: "600px", 
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
              Editar Perfil
            </h2>
            <p style={{ color: "#7b6f67", marginTop: "0.5rem", fontSize: "0.875rem" }}>
              Personaliza tu espacio en L3ttro
            </p>
          </div>

          {errors && (
            <div style={{ marginBottom: "1.5rem", padding: "0.75rem", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "0.5rem" }}>
              {Object.values(errors).flat().map((err, i) => (
                <div key={i} style={{ fontSize: "0.875rem", color: "#991b1b", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span>•</span> {err}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Foto de perfil */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20%",
                  overflow: "hidden",
                  border: "2px solid #d9a05b",
                  backgroundColor: "#f5ebe0",
                  boxShadow: "0 10px 25px rgba(217,160,91,0.2)"
                }}>
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Vista previa" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    onError={(e) => {
                      if (user?.google_photo && e.target.src !== user.google_photo) {
                        e.target.src = user.google_photo;
                      }
                    }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#7b6f67", fontSize: "0.7rem", textAlign: "center" }}>
                    Sin foto
                  </div>
                )}
              </div>
              <label style={{ 
                cursor: "pointer", 
                backgroundColor: "transparent", 
                border: "1px solid #d9a05b", 
                color: "#d9a05b", 
                padding: "0.4rem 1rem", 
                borderRadius: "2rem", 
                fontSize: "0.8rem", 
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#d9a05b"; e.currentTarget.style.color = "#fff7ec"; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#d9a05b"; }}>
                Cambiar foto
                <input type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
              </label>
            </div>

            {/* Nombre */}
            <div>
              <label style={labelStyle}>Nombre completo</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderBottomColor = "#d9a05b"}
                onBlur={(e) => e.target.style.borderBottomColor = "#e0d1c3"}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderBottomColor = "#d9a05b"}
                onBlur={(e) => e.target.style.borderBottomColor = "#e0d1c3"}
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label style={labelStyle}>Biografía / Descripción</label>
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
                  minHeight: "100px",
                  resize: "vertical",
                  transition: "border-color 0.2s ease",
                  marginTop: "0.25rem"
                }}
                onFocus={(e) => e.target.style.borderColor = "#d9a05b"}
                onBlur={(e) => e.target.style.borderColor = "#e0d1c3"}
                placeholder="Cuéntanos algo sobre ti..."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  flex: 1,
                  padding: "0.875rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #7b6f67",
                  backgroundColor: "transparent", 
                  color: "#7b6f67",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(123,111,103,0.1)" }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "0.875rem",
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
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
