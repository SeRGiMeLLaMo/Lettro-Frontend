import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth.js";
export default function Login() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const API_BASE =
    import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });
    try {
      const res = await axios.post(`${API_BASE}/login`, form, {
        withCredentials: true,
      });
      const user = res.data?.user;
      const token = res.data?.token;
      if (user) {
        setUser(user);
        if (token) setToken(token);
        setStatus({ loading: false, error: "", success: "Inicio de sesión exitoso" });
        navigate(`/profile/${user.id}`);
        return;
      }
      setStatus({ loading: false, error: "Respuesta inválida", success: "" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Error al iniciar sesión";
      setStatus({ loading: false, error: msg, success: "" });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-l3-bg">
      <div className="bg-l3-card p-8 rounded-2xl w-96 border border-purple-900/30 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-l3-neon">
          Iniciar sesión en L3ttro
        </h2>
        <form onSubmit={handleSubmit}>
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
            className="w-full mb-5 p-2 rounded bg-gray-900 text-white border border-purple-900/30"
          />
          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-l3-purple text-white py-2 rounded-xl hover:bg-l3-light transition disabled:opacity-60"
          >
            {status.loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {status.error && (
          <div className="mt-3 text-sm text-red-400">{status.error}</div>
        )}
        {status.success && (
          <div className="mt-3 text-sm text-green-400">{status.success}</div>
        )}
        <p className="mt-4 text-center text-sm text-l3-muted">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-l3-gold hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}