import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, keepLoggedIn?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

const TOKEN_KEY = "atlas_token";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.userId, name: payload.name, email: payload.email };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (stored) {
        const decoded = decodeToken(stored);
        if (decoded) {
          setToken(stored);
          setUser(decoded);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(TOKEN_KEY);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, keepLoggedIn = true) => {
    const { data } = await axios.post(`${API_BASE}/api/auth/signin`, { email, password });
    const tok: string = data.token;
    if (keepLoggedIn) {
      localStorage.setItem(TOKEN_KEY, tok);
    } else {
      sessionStorage.setItem(TOKEN_KEY, tok);
    }
    setToken(tok);
    setUser(decodeToken(tok));
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await axios.post(`${API_BASE}/api/auth/signup`, { name, email, password });
    const tok: string = data.token;
    localStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
    setUser(decodeToken(tok));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
