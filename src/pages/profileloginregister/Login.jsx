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
  
  const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
    
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

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.75rem 0.5rem 0.75rem 2.25rem", // pl-9
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "2px solid #e0d1c3",
    outline: "none",
    color: "#3b2f2a",
    fontSize: "1rem",
    transition: "border-color 0.2s ease",
  };

  const iconStyle = {
    position: "absolute",
    left: "0.25rem",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    opacity: 0.6,
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
          maxWidth: "450px", 
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
        {/* Decoración circular de fondo */}
        <div style={{ position: "absolute", top: "-2.5rem", right: "-2.5rem", width: "10rem", height: "10rem", backgroundColor: "rgba(217,160,91,0.15)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }}></div>
        <div style={{ position: "absolute", bottom: "-2.5rem", left: "-2.5rem", width: "10rem", height: "10rem", backgroundColor: "rgba(139,90,43,0.1)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }}></div>
        
        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.875rem", fontWeight: "800", color: "#3b2f2a", margin: 0 }}>
              Iniciar sesión
            </h2>
            <p style={{ color: "#7b6f67", marginTop: "0.5rem", fontSize: "0.875rem" }}>
              Bienvenido de nuevo a L3ttro
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Email */}
            <div style={{ position: "relative" }}>
              <div style={iconStyle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7b6f67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input
                name="email"
                type="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderBottomColor = "#d9a05b"}
                onBlur={(e) => e.target.style.borderBottomColor = "#e0d1c3"}
              />
            </div>

            {/* Password */}
            <div style={{ position: "relative" }}>
              <div style={iconStyle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7b6f67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <input
                name="password"
                type="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => e.target.style.borderBottomColor = "#d9a05b"}
                onBlur={(e) => e.target.style.borderBottomColor = "#e0d1c3"}
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
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
                gap: "0.5rem",
                cursor: status.loading ? "not-allowed" : "pointer",
                opacity: status.loading ? 0.7 : 1,
                transition: "background-color 0.2s ease, transform 0.1s ease",
              }}
              onMouseOver={(e) => { if (!status.loading) e.currentTarget.style.backgroundColor = "#c68c4a" }}
              onMouseOut={(e) => { if (!status.loading) e.currentTarget.style.backgroundColor = "#d9a05b" }}
              onMouseDown={(e) => { if (!status.loading) e.currentTarget.style.transform = "scale(0.98)" }}
              onMouseUp={(e) => { if (!status.loading) e.currentTarget.style.transform = "scale(1)" }}
            >
              {status.loading && (
                <div style={{ animation: "spin 1s linear infinite" }}>
                  <style>
                    {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
                  </style>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </div>
              )}
              {status.loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e0d1c3" }}></div>
            <span style={{ fontSize: "0.8rem", color: "#7b6f67", fontWeight: "600" }}>O CONTINÚA CON</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e0d1c3" }}></div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
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
            <div style={{ marginTop: "1.5rem", padding: "0.75rem", backgroundColor: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "0.5rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "#991b1b" }}>{status.error}</div>
            </div>
          )}

          {status.success && (
            <div style={{ marginTop: "1.5rem", padding: "0.75rem", backgroundColor: "#f0fdf4", border: "1px solid #dcfce3", borderRadius: "0.5rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div style={{ fontSize: "0.875rem", fontWeight: "500", color: "#166534" }}>{status.success}</div>
            </div>
          )}

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.875rem", color: "#7b6f67" }}>
              ¿No tienes una cuenta?{" "}
              <Link to="/register" style={{ fontWeight: "600", color: "#8b5a2b", textDecoration: "none" }} onMouseOver={(e) => e.target.style.textDecoration = "underline"} onMouseOut={(e) => e.target.style.textDecoration = "none"}>
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}