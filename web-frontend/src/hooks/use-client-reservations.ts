import { useAuth } from "@/context/AuthContext";
import { ReservationService, Reservation } from "@/http/reservation/reservation.service";
import { useQuery } from "@tanstack/react-query";

export function useClientReservations() {
  const { accessToken, isLoading: authLoading } = useAuth();

  const reservationsQuery = useQuery({
    queryKey: ["reservations"],
    queryFn: () => ReservationService.getReservations(accessToken ?? ""),
    enabled: !!accessToken && !authLoading,
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
