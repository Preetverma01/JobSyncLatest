import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("jobsync-user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("jobsync-token") || "");

  useEffect(() => {
    if (user) {
      localStorage.setItem("jobsync-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("jobsync-user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("jobsync-token", token);
    } else {
      localStorage.removeItem("jobsync-token");
    }
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken("");
  };

  const value = useMemo(
    () => ({ user, setUser, token, setToken, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
