"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiBooking, ApiBookingStatus } from "@/lib/api";

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
}

export default function BookingCard({ booking, i }: BookingCardProps) {
  const config =
    statusConfig[booking.status] || statusConfig[ApiBookingStatus.PENDING];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
      className="group bg-card border border-border p-6 rounded-[2rem] hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6"
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {booking.service.name}
          </h3>
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold",
              config.color,
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {booking.scheduledAt
              ? new Date(booking.scheduledAt).toLocaleDateString("pt-PT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Data não definida"}
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{booking.service.provider.name}</span>
          </div>
        </div>

        {booking.notes && (
          <p className="text-xs text-muted-foreground/70 italic line-clamp-1">
            {booking.notes}
          </p>
        )}
        {booking.status === ApiBookingStatus.CANCELLED && (
          <p className="text-xs text-muted-foreground/70 italic line-clamp-1">
            Motivo do cancelamento:{" "}
            <span className="text-primary">{booking.cancelReason}</span>
          </p>
        )}
      </div>

      <div className="flex items-center justify-between md:flex-col md:items-end gap-2 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
        <div className="flex flex-col md:items-end">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
            Preço Total
          </span>
          <span className="text-2xl font-black text-glow-sm">
            {new Intl.NumberFormat("pt-AO", {
              style: "currency",
              currency: "AOA",
            }).format(booking.totalPrice)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl text-xs font-bold h-8"
        >
          Ver detalhes
        </Button>
      </div>
    </motion.div>
  );
}
