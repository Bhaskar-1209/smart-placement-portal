"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import API from "../services/api";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("spp_user");
    return stored ? JSON.parse(stored) : null;
  });
  const loading = false;

  const login = useCallback((data) => {
    localStorage.setItem("spp_token", data.token);
    localStorage.setItem("spp_refresh", data.refreshToken);
    localStorage.setItem("spp_user", JSON.stringify(data));
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("spp_token");
    localStorage.removeItem("spp_refresh");
    localStorage.removeItem("spp_user");
    setUser(null);
  }, []);

  const refreshMe = useCallback(async () => {
    const { data } = await API.get("/auth/me");
    setUser((current) => ({ ...current, ...data.user }));
    return data;
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, refreshMe }), [user, loading, login, logout, refreshMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
