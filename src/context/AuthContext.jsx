import { useEffect, useMemo, useState } from "react";
import AuthContext from "./authContext.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("l3_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("l3_token") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("l3_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("l3_user");
    }
  }, [user]);
  useEffect(() => {
    if (token) {
      localStorage.setItem("l3_token", token);
    } else {
      localStorage.removeItem("l3_token");
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      logout: () => {
        setUser(null);
        setToken("");
      },
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

