import { useQuery } from "@tanstack/react-query";
import { searchServices } from "@/lib/api";

interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export function useSearchServices(params: SearchParams = {}) {
  return useQuery({
    queryKey: ["services", "search", params],
    queryFn: async () => {
      const res = await searchServices(params);
      if (!res.success) throw new Error("Falha ao pesquisar serviços");
      return res.data;
    },
  });
}
