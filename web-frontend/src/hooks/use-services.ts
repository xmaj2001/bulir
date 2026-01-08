import { Service } from "@/http/services/service.service";
import { Service as ServiceModel } from "@/types/service";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UseServicesOptions {
  byProvider?: boolean;
  serviceId?: string;
  queryOptions?: Omit<
    UseQueryOptions<ServiceModel[] | ServiceModel | null>,
    "queryKey" | "queryFn"
  >;
}

export default function useServices(options: UseServicesOptions = {}) {
  const { serviceId, queryOptions } = options;
  const { data: session, status } = useSession();

  const servicesQuery = useQuery<ServiceModel[] | ServiceModel | null>({
    queryKey: serviceId ? ["services", serviceId] : ["services"],
    queryFn: async () => {
      if (!session) return null;

      if (serviceId) {
        return Service.getById(serviceId, session.accessToken ?? "");
      }

      return Service.getAll(session.accessToken ?? "");
    },
    enabled: !!session && status === "authenticated",
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...queryOptions,
  });

  return {
    services: servicesQuery.data,
    isLoading: servicesQuery.isLoading,
    isError: servicesQuery.isError,
    error: servicesQuery.error,
    refetch: servicesQuery.refetch,
    user: session?.user,
  };
}
