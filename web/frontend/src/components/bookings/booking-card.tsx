"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  MoreHorizontal,
  Check,
  X,
  ShoppingBagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiBooking, ApiBookingStatus } from "@/lib/api";
import { useCancelBooking, useCompleteBooking } from "@/hooks/use-bookings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const statusConfig = {
  [ApiBookingStatus.PENDING]: {
    label: "Pendente",
    icon: Clock,
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  },
  [ApiBookingStatus.CONFIRMED]: {
    label: "Confirmado",
    icon: CheckCircle2,
    color: "text-green-500 bg-green-500/10 border-green-500/20",
  },
  [ApiBookingStatus.COMPLETED]: {
    label: "Concluído",
    icon: CheckCircle2,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  [ApiBookingStatus.CANCELLED]: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-red-500 bg-red-500/10 border-red-500/20",
  },
};

interface BookingCardProps {
  booking: ApiBooking;
  i: number;
  isProviderView?: boolean;
}

export default function BookingCard({
  booking,
  i,
  isProviderView,
}: BookingCardProps) {
  const config =
    statusConfig[booking.status] || statusConfig[ApiBookingStatus.PENDING];
  const StatusIcon = config.icon;

  const { mutate: complete, isPending: isCompleting } = useCompleteBooking();
  const { mutate: cancel, isPending: isCancelling } = useCancelBooking();

  const handleComplete = () => complete(booking.id);
  const handleCancel = () => cancel({ id: booking.id });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
      className="group bg-card border border-border p-6 rounded-[2rem] hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6"
    >
      <div className="relative w-full md:w-32 aspect-square rounded-2xl overflow-hidden border border-border group-hover:border-primary/50 transition-colors shrink-0">
        {booking.service.imageUrl ? (
          <Image
            src={booking.service.imageUrl}
            alt={booking.service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ShoppingBagIcon className="w-10 h-10 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
              {booking.service.name}
            </h3>
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest",
                config.color,
              )}
            >
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 italic">
            {booking.service.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-xl">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Data Agendada
              </p>
              <p className="text-sm font-bold">
                {booking.scheduledAt
                  ? new Date(booking.scheduledAt).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Por definir"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-xl">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {isProviderView ? "Cliente" : "Prestador"}
              </p>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5 border border-border">
                  <AvatarImage
                    src={
                      (isProviderView
                        ? booking.client?.avatarUrl
                        : booking.service.provider.avatarUrl) || ""
                    }
                  />
                  <AvatarFallback className="text-[10px] font-bold">
                    {(isProviderView
                      ? booking.client?.name
                      : booking.service.provider.name
                    )
                      ?.substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold">
                  {isProviderView
                    ? booking.client?.name
                    : booking.service.provider.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {booking.notes && (
          <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
              Notas do Pedido
            </p>
            <p className="text-xs italic text-muted-foreground/80 line-clamp-2">
              &quot;{booking.notes}&quot;
            </p>
          </div>
        )}
        {booking.status === ApiBookingStatus.CANCELLED && (
          <p className="text-xs text-muted-foreground/70 italic line-clamp-1">
            Motivo do cancelamento:{" "}
            <span className="text-primary">
              {booking.cancelReason || "N/A"}
            </span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
        <div className="flex flex-col md:items-end">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
            Preço Total
          </span>
          <span className="text-2xl font-black text-glow-sm leading-tight">
            {new Intl.NumberFormat("pt-AO", {
              style: "currency",
              currency: "AOA",
            }).format(booking.totalPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isProviderView &&
            (booking.status === ApiBookingStatus.PENDING ||
              booking.status === ApiBookingStatus.CONFIRMED) && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-8 bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white font-bold"
                  onClick={handleComplete}
                  disabled={isCompleting}
                >
                  {isCompleting ? "..." : <Check className="w-4 h-4 mr-1" />}
                  Concluir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-8 bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? "..." : <X className="w-4 h-4 mr-1" />}
                  Cancelar
                </Button>
              </>
            )}

          {!isProviderView && booking.status === ApiBookingStatus.PENDING && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs font-bold h-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              Cancelar
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-8 w-8"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="rounded-lg font-medium">
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg font-medium">
                Contactar {isProviderView ? "cliente" : "provider"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
