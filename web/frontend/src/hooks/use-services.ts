import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  getMyServices,
  createService,
  getService,
} from "@/lib/api";
import { CreateServiceInput } from "@/schemas/service.schema";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await getServices();
      if (!res.success) throw new Error("Falha ao carregar serviços");
      return res.data;
    },
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: async () => {
      const res = await getService(id);
      if (!res.success) throw new Error("Falha ao carregar serviço");
      return res.data;
    },
  });
}

export function useMyServices() {
  return useQuery({
    queryKey: ["services", "mine"],
    queryFn: async () => {
      const res = await getMyServices();
      if (!res.success) throw new Error("Falha ao carregar os teus serviços");
      return res.data;
    },
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServiceInput) => {
      const res = await createService(data);
      if (!res.success) throw new Error("Falha ao criar serviço");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
