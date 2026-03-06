import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth.js";

export default function Register() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000/api";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    try {
      const res = await axios.post(`${API_BASE}/register`, form, {
        withCredentials: true,
      });
      const newUser = res.data?.user;
      if (newUser) {
        setUser(newUser);
        navigate(`/profile/${newUser.id}`);
      }
      setStatus({ loading: false, error: "", success: "Registro exitoso" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error al registrar";
      setStatus({ loading: false, error: msg, success: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-l3-bg">
      <div className="bg-l3-card p-8 rounded-2xl w-96 border border-purple-900/30 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-l3-neon">
          Crear cuenta en L3ttro
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white border border-purple-900/30"
          />
          <input
            name="username"
            type="text"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white border border-purple-900/30"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white border border-purple-900/30"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full mb-3 p-2 rounded bg-gray-900 text-white border border-purple-900/30"
          />
          <input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar contraseña"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full mb-5 p-2 rounded bg-gray-900 text-white border border-purple-900/30"
          />
          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-l3-gold text-l3-bg py-2 rounded-xl font-semibold hover:bg-yellow-400 transition disabled:opacity-60"
          >
            {status.loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        {status.error && (
          <div className="mt-3 text-sm text-red-400">{status.error}</div>
        )}
        {status.success && (
          <div className="mt-3 text-sm text-green-400">{status.success}</div>
        )}
        <p className="mt-4 text-center text-sm text-l3-muted">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-l3-gold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
