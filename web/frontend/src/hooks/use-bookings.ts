import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyBookings,
  createBooking,
  getProviderBookings,
  completeBooking,
  cancelBooking,
} from "@/lib/api";
import { CreateBookingInput } from "@/schemas/service.schema";

export function useMyBookings() {
  return useQuery({
    queryKey: ["bookings", "mine"],
    queryFn: async () => {
      const res = await getMyBookings();
      if (!res.success) throw new Error("Falha ao carregar as tuas reservas");
      return res.data;
    },
  });
}

export function useProviderBookings() {
  return useQuery({
    queryKey: ["bookings", "provider"],
    queryFn: async () => {
      const res = await getProviderBookings();
      if (!res.success) throw new Error("Falha ao carregar reservas recebidas");
      return res.data;
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingInput) => {
      const res = await createBooking(data);
      if (!res.success) throw res;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCompleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await completeBooking(id);
      if (!res.success) throw res;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine", "auth"] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await cancelBooking(id, reason);
      if (!res.success) throw res;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
