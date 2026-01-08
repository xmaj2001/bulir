import AuthContext from "@/context/auth-context";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("O useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}