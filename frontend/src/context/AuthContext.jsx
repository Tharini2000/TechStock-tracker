import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("techstock_auth");
    return stored ? JSON.parse(stored) : { token: "", user: null };
  });

  useEffect(() => {
    localStorage.setItem("techstock_auth", JSON.stringify(auth));
  }, [auth]);

  const login = (payload) => {
    setAuth({ token: payload.token, user: payload.user });
  };

  const logout = () => {
    setAuth({ token: "", user: null });
  };

  const value = useMemo(() => ({ auth, login, logout }), [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
