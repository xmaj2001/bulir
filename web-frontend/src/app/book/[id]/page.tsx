"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import useUser from "@/hooks/use-user"
import { useParams } from "next/navigation"
import { useReservation } from "@/hooks/use-reservation"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function Page() {
  const { id } = useParams()
  const serviceId = useMemo(() => (Array.isArray(id) ? id[0] : id), [id])
  const { userQuery } = useUser()
  const {
    bookReservation,
    cancelReservation,
    reservation,
    isBooking,
    isCancelling,
  } = useReservation(serviceId)

  const handleBook = async () => {
    try {
      await bookReservation()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao reservar"
      toast.error(message)
    }
  }

  const handleCancel = async () => {
    const reservationId = reservation?.id || (reservation as any)?.reservationId
    if (!reservationId) {
      toast.error("Nenhuma reserva ativa para cancelar")
      return
    }

    try {
      await cancelReservation(reservationId as string)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao cancelar"
      toast.error(message)
    }
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Reservar serviço</h2>
        <p className="text-muted-foreground">
          Confirme os dados e crie a reserva para o serviço selecionado.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Serviço</p>
            <p className="text-lg font-semibold text-foreground">{serviceId}</p>
          </div>
          <Badge variant="secondary">Reserva</Badge>
        </div>

        <Separator />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Cliente</p>
            <p className="font-medium text-foreground">{userQuery.data?.name ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{userQuery.data?.email ?? ""}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Estado</p>
            <p className="font-medium text-foreground">
              {reservation?.status ?? "Pendente"}
            </p>
            {reservation?.id && (
              <p className="text-xs text-muted-foreground">ID da reserva: {reservation.id}</p>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1"
            onClick={handleBook}
            disabled={isBooking || userQuery.isLoading}
          >
            {isBooking ? "A reservar..." : "Reservar agora"}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
            disabled={isCancelling || !reservation}
          >
            {isCancelling ? "A cancelar..." : "Cancelar reserva"}
          </Button>
        </div>

        {reservation && (
          <div className="rounded-md border bg-muted/40 p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Resumo</p>
            <p className="text-sm text-muted-foreground">
              Reserva confirmada para o serviço {reservation.serviceId ?? serviceId}.
            </p>
            {reservation.createdAt && (
              <p className="text-xs text-muted-foreground">Criada em: {reservation.createdAt}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}