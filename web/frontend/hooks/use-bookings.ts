import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBookings, createBooking } from "@/lib/api";
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

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingInput) => {
      const res = await createBooking(data);
      if (!res.success) throw new Error("Falha ao criar reserva");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
