import { useAuth } from "@/context/AuthContext";
import { UserService } from "@/http/user/user.service";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  const { accessToken, isLoading } = useAuth();
  
  const userQuery = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: () => UserService.getById(accessToken ?? ""),
    enabled: !!accessToken && !isLoading,
  });
  return { userQuery };
}
