"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { ApiUser } from "@/lib/api";

export function AuthHydrator({ user }: { user: ApiUser | null }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    console.log("User: ", user);
    if (user) setUser(user);
    else clearUser();
  }, [user, setUser, clearUser]);

  return null;
}
