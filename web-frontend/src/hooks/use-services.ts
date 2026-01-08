import { useAuth } from "@/context/AuthContext";
import { Service } from "@/http/services/service.service";
import { Service as ServiceModel } from "@/types/service";
import { useQuery } from "@tanstack/react-query";

export default function useServices() {
  const { accessToken, isLoading, user } = useAuth();
  const servicesQuery = useQuery<ServiceModel[]>({
    queryKey: ["services"],
    queryFn: () => Service.getAll(accessToken ?? ""),
    enabled: !!accessToken && !isLoading,
  });
  return { servicesQuery, user };
}
