import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await getMe();
      if (!res.success) throw new Error("Falha ao carregar os teus dados");
      return res.data;
    },
    // Opcional: manter os dados por algum tempo ou revalidar em certas condições
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
