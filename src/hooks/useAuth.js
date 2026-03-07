import { useContext } from "react";
import AuthProvider, { AuthContext } from "../context/AuthContext.jsx";

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
