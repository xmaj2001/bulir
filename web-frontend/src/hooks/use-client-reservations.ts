import { ReservationService } from "@/http/reservation/reservation.service";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useClientReservations() {
  const { data: session, status } = useSession();
  console.log("Booking reservation with user:", session?.user);
  const reservationsQuery = useQuery({
    queryKey: ["reservations", session?.accessToken],
    queryFn: () =>
      ReservationService.getReservations(session?.accessToken ?? ""),
    enabled: !!session?.accessToken && status === "authenticated",
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  return {
    reservations: reservationsQuery.data ?? [],
    isLoading: reservationsQuery.isLoading,
    isError: reservationsQuery.isError,
    error: reservationsQuery.error,
    refetch: reservationsQuery.refetch,
  };
}
