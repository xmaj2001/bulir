"use client";

import { createContext } from "react";
import type { User } from "@/types/user";

interface AuthContextData {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData
);

export default AuthContext;