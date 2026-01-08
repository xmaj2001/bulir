"use client";
import { Button } from "@/components/ui/button";
import { useClientReservations } from "@/hooks/use-client-reservations";
import { useReservation } from "@/hooks/use-reservation";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Page() {
  const { reservations } = useClientReservations();
  const {
    bookReservation,
    cancelReservation,
    reservation,
    isBooking,
    isCancelling,
  } = useReservation();
  const statusTextColors: Record<string, string> = {
    pending: "text-yellow-500",
    confirmed: "text-green-500",
    canceled: "text-red-500",
  };

  const statusBgColors: Record<string, string> = {
    pending: "bg-yellow-100",
    confirmed:
      "bg-green-100 hover:bg-green-300/50 hover:border-green-300 duration-200 transition-colors hover:animation-bounce",
    canceled:
      "border-red-100 hover:bg-red-300/50 hover:border-red-300 duration-200 transition-colors",
  };
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards /> */}
          <div className="space-y-3 mx-8 p-4 rounded-lg bg-muted/30 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Historico de <span className="gradient-text">Reservas</span>
              </h1>
            </div>
            <div className="p-4">
              {reservations.map((reservation) => {
                return (
                  <div
                    key={reservation.id}
                    className={`mb-6 p-4 border rounded-[4px] bg-gray-100`}
                  >
                    <h4 className="font-semibold text-foreground text-sm">
                      Detalhes das Reservas
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Serviço</p>
                        <p className="font-medium text-foreground">
                          {reservation.service.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valor</p>
                        <p className="font-medium text-primary">
                          {formatCurrency(reservation.service.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Descrição</p>
                        <p className="font-medium text-foreground">
                          {reservation.service.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Data</p>
                        <p className="font-medium text-foreground">
                          {formatDate(reservation.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium text-foreground">
                          {reservation.status}
                        </p>
                      </div>
                      {reservation.status.toLowerCase() === "confirmed" && (
                        <Button
                          disabled={
                            isCancelling ||
                            isBooking ||
                            reservation.id !== reservation.id
                          }
                          onClick={() => cancelReservation(reservation.id)}
                          size={"sm"}
                          variant="default"
                          className="w-[120px] text-black border border-red-200 mt-4 bg-transparent hover:bg-red-500 hover:border-red-500 shadow-none"
                        >
                          {isCancelling && reservation.id === reservation.id
                            ? "Cancelando..."
                            : "Cancelar"}
                        </Button>
                      )}

                      {reservation.status.toLowerCase() === "canceled" && (
                        <Button
                          disabled={
                            isCancelling ||
                            isBooking ||
                            reservation.id !== reservation.id
                          }
                          onClick={() => bookReservation(reservation.serviceId)}
                          size={"sm"}
                          variant="glass"
                          className="max-w-1/3 text-black"
                        >
                          {isBooking && reservation.id === reservation.id
                            ? "Reservando..."
                            : "Reservar Novamente"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
