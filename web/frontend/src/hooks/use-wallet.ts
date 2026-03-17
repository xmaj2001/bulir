import { useQuery } from "@tanstack/react-query";
import { getWalletMe, listTransactions, getTransactionDetail } from "@/lib/api";

export function useWalletSummary() {
  return useQuery({
    queryKey: ["wallet", "summary"],
    queryFn: async () => {
      const res = await getWalletMe();
      if (!res.success) throw new Error("Falha ao carregar a carteira");
      return res.data;
    },
  });
}

export function useWalletTransactions(
  params: {
    page?: number;
    limit?: number;
    type?: string;
    reason?: string;
  } = {},
) {
  return useQuery({
    queryKey: ["wallet", "transactions", params],
    queryFn: async () => {
      const res = await listTransactions(params);
      if (!res.success) throw new Error("Falha ao carregar as transações");
      return res.data;
    },
  });
}

export function useTransactionDetail(id: string) {
  return useQuery({
    queryKey: ["wallet", "transactions", id],
    queryFn: async () => {
      const res = await getTransactionDetail(id);
      if (!res.success)
        throw new Error("Falha ao carregar os detalhes da transação");
      return res.data;
    },
    enabled: !!id,
  });
}
