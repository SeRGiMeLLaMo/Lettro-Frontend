import { useContext } from "react";
import AuthProvider from "../context/AuthContext.jsx";
import AuthContext from "../context/authContext.js";

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
