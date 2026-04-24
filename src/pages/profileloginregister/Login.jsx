import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth.js";
import { GoogleLogin } from "@react-oauth/google";

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

  const handleGoogleSuccess = async (credentialResponse) => {
    setStatus({ loading: true, error: "", success: "" });
    try {
      const res = await axios.post(`${API_BASE}/auth/google`, {
        token: credentialResponse.credential,
      });
      const { user, token } = res.data;
      if (user && token) {
        setUser(user);
        setToken(token);
        setStatus({ loading: false, error: "", success: "Inicio de sesión con Google exitoso" });
        navigate(`/profile/${user.id}`);
      }
    } catch (err) {
      console.error(err);
      setStatus({ 
        loading: false, 
        error: "Error al iniciar sesión con Google", 
        success: "" 
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4 md:p-8 bg-l3-bg font-sans">
      <div className="w-full max-w-[450px] mx-auto p-6 md:p-10 bg-l3-card border border-l3-border rounded-3xl shadow-[0_20px_40px_rgba(139,90,43,0.08)] relative overflow-hidden">
        {/* Decoración circular de fondo */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-l3-gold/15 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-l3-brown/10 rounded-full blur-[40px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-l3-paper m-0">
              Iniciar sesión
            </h2>
            <p className="text-l3-muted mt-2 text-sm md:text-base">
              Bienvenido de nuevo a L3ttro
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
            
            {/* Email */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-l3-muted group-focus-within:text-l3-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                className="w-full box-border py-3 pl-10 pr-4 bg-transparent border-none border-b-2 border-l3-border outline-none text-l3-paper text-base transition-colors duration-200 focus:border-l3-gold placeholder:text-l3-muted/70"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-l3-muted group-focus-within:text-l3-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                className="w-full box-border py-3 pl-10 pr-4 bg-transparent border-none border-b-2 border-l3-border outline-none text-l3-paper text-base transition-colors duration-200 focus:border-l3-gold placeholder:text-l3-muted/70"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className={`w-full py-3.5 mt-4 rounded-xl border-none bg-l3-gold text-l3-card font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 ${
                status.loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:bg-l3-goldHover active:scale-[0.98]"
              }`}
            >
              {status.loading && (
                <div className="animate-spin">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </div>
              )}
              {status.loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="my-6 md:my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-l3-border"></div>
            <span className="text-xs text-l3-muted font-semibold uppercase tracking-wider">O CONTINÚA CON</span>
            <div className="flex-1 h-px bg-l3-border"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setStatus({ loading: false, error: "Error en la autenticación de Google", success: "" })}
              theme="outline"
              shape="pill"
              text="signin_with"
              locale="es"
            />
          </div>

          {status.error && (
            <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div className="text-sm font-medium text-red-800">{status.error}</div>
            </div>
          )}

          {status.success && (
            <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div className="text-sm font-medium text-green-800">{status.success}</div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-l3-muted">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="font-bold text-l3-brown no-underline hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}