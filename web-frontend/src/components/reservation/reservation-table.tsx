"use client";

import { Reservation } from "@/http/reservation/reservation.service";
import { useClientReservations } from "@/hooks/use-client-reservations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, RefreshCw, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useReservation } from "@/hooks/use-reservation";
import { useState } from "react";

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-800 border-yellow-200"
        >
          Pendente
        </Badge>
      );
    case "confirmed":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-800 border-green-200"
        >
          Confirmada
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-800 border-blue-200"
        >
          Concluída
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-800 border-red-200"
        >
          Cancelada
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

interface ReservationRowProps {
  reservation: Reservation;
  onCancel: (id: string) => Promise<void>;
  isCancelling: boolean;
}

function ReservationRow({
  reservation,
  onCancel,
  isCancelling,
}: ReservationRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancel = async () => {
    await onCancel(reservation.id);
    setIsOpen(false);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <span className="text-sm">#{reservation.id.slice(0, 8).toUpperCase()}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{reservation.service?.name}</span>
      </TableCell>
      <TableCell>
        <span className="font-semibold">{reservation.price.toFixed(2)} Kz</span>
      </TableCell>
      <TableCell>{getStatusBadge(reservation.status)}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(reservation.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleCancel}
              disabled={isCancelling}
              className="text-destructive"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelando...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar reserva
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export function ReservationTable() {
  const { reservations, isLoading, isError, error, refetch } =
    useClientReservations();
  const { cancelReservation, isCancelling } = useReservation();

  const handleCancel = async (reservationId: string) => {
    await cancelReservation(reservationId);
    refetch();
  };

  if (isError) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-destructive">
              Erro ao carregar reservas
            </p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Tente novamente mais tarde"}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-0.5">
          <CardTitle>Minhas Reservas</CardTitle>
          <CardDescription>
            {reservations.length === 0
              ? "Nenhuma reserva realizada"
              : `${reservations.length} reserva${
                  reservations.length !== 1 ? "s" : ""
                }`}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Ainda não tens nenhuma reserva
            </p>
            <p className="text-xs text-muted-foreground">
              Explora serviços e cria uma reserva para começar
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID Reserva</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <ReservationRow
                    key={reservation.id}
                    reservation={reservation}
                    onCancel={handleCancel}
                    isCancelling={isCancelling}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
