import { UserService } from "@/http/user/user.service";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useUser() {
  const {data: session, status} = useSession();

  const userQuery = useQuery<User | null>({
    queryKey: ["user-me", session?.accessToken],
    queryFn: () => UserService.me(session!.accessToken!),
    enabled: !!session?.accessToken && status === "authenticated",
    initialData: null,
  });
  return { userQuery };
}

export function useUserMe() {
  const {data: session, status} = useSession();
  
  const userQuery = useQuery<User | null>({
    queryKey: ["user-me", session?.accessToken],
    queryFn: () => UserService.me(session!.accessToken!),
    enabled: !!session?.accessToken && status === "authenticated",
    initialData: null,
  });
  return { userQuery };
}