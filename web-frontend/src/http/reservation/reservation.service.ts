import { Reservation } from "@/types/reservation";
import { API } from "../config";

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

class ReservationError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public originalError?: ApiError
  ) {
    super(message);
    this.name = "ReservationError";
  }
}

const parseErrorMessage = (data: any): string => {
  if (typeof data?.message === "string") {
    return data.message;
  }
  if (Array.isArray(data?.message)) {
    return data.message[0] || "Erro ao processar pedido";
  }
  return data?.error || "Erro desconhecido";
};

const handleErrorResponse = async (response: Response): Promise<never> => {
  const data: ApiError = await response.json().catch(() => ({}));
  const message = parseErrorMessage(data);
  throw new ReservationError(response.status, message, data);
};

export const ReservationService = {
  async book(serviceId: string, accessToken: string): Promise<Reservation> {
    const response = await fetch(`${API.BASE_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ serviceId }),
    });

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return response.json();
  },

  async cancel(reservationId: string, accessToken: string): Promise<Reservation> {
    const response = await fetch(
      `${API.BASE_URL}/reservations/${reservationId}/cancel`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return response.json();
  },

  async getReservations(accessToken: string): Promise<Reservation[]> {
    const response = await fetch(`${API.BASE_URL}/reservations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return response.json();
  },

  async getReservationDetails(
    reservationId: string,
    accessToken: string
  ): Promise<Reservation> {
    const response = await fetch(
      `${API.BASE_URL}/reservations/${reservationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return response.json();
  },
};
