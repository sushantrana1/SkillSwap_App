import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      console.error(
        "Authentication error:",
        error,
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();

    const handleAuthExpired = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
      setLoading(false);
    };

    window.addEventListener(
      "auth-expired",
      handleAuthExpired,
    );

    return () => {
      window.removeEventListener(
        "auth-expired",
        handleAuthExpired,
      );
    };
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify(userData),
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};