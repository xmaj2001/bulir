import { ReservationService } from "@/http/reservation/reservation.service";
import { Reservation } from "@/types/reservation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ReservationError extends Error {
  statusCode?: number;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const reservationError = error as ReservationError;

    switch (reservationError.statusCode) {
      case 403:
        return "Não tens permissão para esta ação. Apenas clientes podem fazer reservas.";
      case 409:
        if (error.message.includes("próprio")) {
          return "Não podes reservar um serviço teu próprio.";
        }
        if (error.message.includes("Saldo insuficiente")) {
          return "Saldo insuficiente para fazer esta reserva.";
        }
        return error.message;
      case 404:
        if (error.message.includes("Serviço")) {
          return "O serviço selecionado não foi encontrado.";
        }
        if (error.message.includes("Reserva")) {
          return "A reserva não foi encontrada.";
        }
        return "Recurso não encontrado.";
      case 401:
        return "Sessão expirada. Por favor, faz login novamente.";
      default:
        return error.message || "Erro ao processar pedido.";
    }
  }

  return "Erro desconhecido. Por favor, tenta novamente.";
};

export function useReservation(serviceId?: string) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const bookMutation = useMutation<Reservation, Error, string | undefined>({
    mutationKey: ["reservation", serviceId, "book"],
    mutationFn: async (id?: string) => {
      if (serviceId) id = serviceId;
      if (!id) {
        throw new Error("Serviço não informado");
      }
      if (!session?.accessToken) {
        throw new Error("Utilizador não autenticado");
      }
      return ReservationService.book(id, session?.accessToken);
    },
    onSuccess: (data) => {
      toast.success(
        `Reserva criada com sucesso! ID: ${data.id.slice(0, 8)}...`
      );
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.setQueryData(["reservation", data.id], data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });

  const cancelMutation = useMutation<Reservation, Error, string>({
    mutationKey: ["reservation", "cancel"],
    mutationFn: async (reservationId: string) => {
      if (!session?.accessToken) {
        throw new Error("Utilizador não autenticado");
      }
      return ReservationService.cancel(reservationId, session.accessToken);
    },
    onSuccess: (data) => {
      toast.success("Reserva cancelada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.removeQueries({ queryKey: ["reservation", data.id] });
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });

  const bookReservation = (id?: string) => bookMutation.mutateAsync(id);
  const cancelReservation = (reservationId: string) =>
    cancelMutation.mutateAsync(reservationId);

  return {
    bookReservation,
    cancelReservation,
    isBooking: bookMutation.isPending,
    isCancelling: cancelMutation.isPending,
    reservation: bookMutation.data,
    bookingError: bookMutation.error,
    cancelError: cancelMutation.error,
  };
}
