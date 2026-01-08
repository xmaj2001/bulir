"use client"; // Obrigatório se estiveres no App Router

import { AuthService } from "@/http/auth/auth.service";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  nif: string;
  role: "client" | "provider";
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>; // Para tentar recarregar o user/token do storage
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Carrega do localStorage ao iniciar (persistência)
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await AuthService.login(email, password);
      if (!data) {
        throw new Error("Login falhou: dados inválidos");
      }
      const { user, accessToken } = data;

      setUser(user);
      setAccessToken(accessToken);

      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  const refresh = async () => {
    // Esta função apenas recarrega do storage (útil após SSR ou refresh da página)
    // Se quiseres um refresh token real, implementa uma chamada à API aqui
    // const storedUser = localStorage.getItem("authUser");
    // const storedToken = localStorage.getItem("accessToken");
    // if (storedUser && storedToken) {
    //   setUser(JSON.parse(storedUser));
    //   setAccessToken(storedToken);
    // } else {
    //   setUser(null);
    //   setAccessToken(null);
    // }
  };
  console.log("AuthContext user:", user);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        login,
        logout,
        refresh,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
