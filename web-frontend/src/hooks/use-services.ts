import { Service, type ServiceCreate } from "@/http/services/service.service";
import { Service as ServiceModel } from "@/types/service";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UseServicesOptions {
  byProvider?: boolean;
  serviceId?: string;
  queryOptions?: Omit<
    UseQueryOptions<ServiceModel[] | ServiceModel | null>,
    "queryKey" | "queryFn"
  >;
  mutationOptions?: UseMutationOptions<
    ServiceModel | null,
    Error,
    ServiceCreate
  >;
}

export default function useServices(options: UseServicesOptions = {}) {
  const { serviceId, queryOptions, mutationOptions } = options;
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const createServiceMutation = useMutation<
    ServiceModel | null,
    Error,
    ServiceCreate
  >({
    mutationFn: async (payload: ServiceCreate) => {
      if (!session?.accessToken) {
        throw new Error("Usuário não autenticado");
      }
      return Service.create(payload, session.accessToken ?? "");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    ...mutationOptions,
  });

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
    staleTime: 5 * 60 * 1000,
    ...queryOptions,
  });

  return {
    services: servicesQuery.data,
    isLoading: servicesQuery.isLoading,
    isError: servicesQuery.isError,
    error: servicesQuery.error,
    refetch: servicesQuery.refetch,
    user: session?.user,
    ...createServiceMutation,
    createService: createServiceMutation.mutateAsync,
  };
}
