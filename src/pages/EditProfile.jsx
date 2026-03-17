import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth.js";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, token, setUser } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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
          setPreview(`http://127.0.0.1:8000/storage/${data.photo}`);
        }
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar tu perfil.");
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
    // Laravel necesita _method=PUT para procesar FormData como PUT
    data.append("_method", "PUT");

    try {
      const res = await axios.post(`${API_BASE}/me`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Perfil actualizado correctamente 🎉");
      setUser(res.data); // Actualizar usuario en el contexto
      navigate(`/profile/${res.data.id}`);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
        alert("Ocurrió un error al actualizar el perfil.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-l3-bg text-white flex justify-center items-center">
        <p className="text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-l3-bg text-white flex justify-center p-8">
      <div className="bg-l3-card p-8 rounded-2xl w-full max-w-2xl border border-purple-900/30 shadow-xl">
        <h1 className="text-3xl font-bold text-l3-neon mb-6 text-center">
          Editar Perfil
        </h1>

        {errors && (
          <div className="bg-red-500/20 border border-red-500 p-3 rounded mb-4">
            {Object.values(errors).flat().map((err, i) => (
              <p key={i} className="text-red-400 text-sm">{err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* FOTO DE PERFIL */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div 
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "20%",
                overflow: "hidden",
                border: "1px solid #7C3AED",
                background: "#0F0B1E"
              }}
              className="shadow-lg shadow-purple-500/20"
            >
              {preview ? (
                <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-[10px]">
                  Sin foto
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-gray-800 border border-l3-purple px-4 py-1.5 rounded-full hover:bg-l3-purple transition text-xs font-semibold text-gray-300">
              Cambiar foto
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          {/* NOMBRE */}
          <div>
            <label className="block mb-1 text-gray-300">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-purple-900/30 text-white focus:outline-none focus:border-l3-purple"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-purple-900/30 text-white focus:outline-none focus:border-l3-purple"
              required
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block mb-1 text-gray-300">Biografía / Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-purple-900/30 text-white h-32 focus:outline-none focus:border-l3-purple"
              placeholder="Cuéntanos algo sobre ti..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-700 text-white py-3 rounded-xl hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-l3-purple text-white py-3 rounded-xl hover:bg-l3-light transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
