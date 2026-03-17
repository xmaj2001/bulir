"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ApiBooking, ApiBookingStatus } from "@/lib/api";
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BookingDetailsSheetProps {
  booking: ApiBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isProviderView?: boolean;
}

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

export default function BookingDetailsSheet({
  booking,
  open,
  onOpenChange,
  isProviderView,
}: BookingDetailsSheetProps) {
  if (!booking) return null;

  const config =
    statusConfig[booking.status] || statusConfig[ApiBookingStatus.PENDING];
  const StatusIcon = config.icon;

  const currencyFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  });

  const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md border-l border-border bg-card/95 backdrop-blur-xl px-0 overflow-y-auto">
        <SheetHeader className="px-6 mb-8">
          <SheetTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            Detalhes da <span className="text-primary">Reserva</span>
          </SheetTitle>
          <SheetDescription>
            Informações completas sobre o pedido de serviço.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 px-6 pb-8">
          {/* Status Badge */}
          <div
            className={cn(
              "flex items-center gap-3 p-4 rounded-3xl border",
              config.color,
            )}
          >
            <StatusIcon className="w-6 h-6" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black tracking-widest opacity-70">
                Status Atual
              </span>
              <span className="font-bold">{config.label}</span>
            </div>
          </div>

          {/* Service Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Serviço Kontratado
            </h4>
            <div className="flex gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-border shrink-0">
                {booking.service.imageUrl ? (
                  <Image
                    src={booking.service.imageUrl}
                    alt={booking.service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg truncate">
                  {booking.service.name}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 italic">
                  {booking.service.description}
                </p>
                <p className="text-primary font-black mt-1">
                  {currencyFormatter.format(booking.totalPrice)}
                </p>
              </div>
            </div>
          </section>

          <Separator className="bg-border/50" />

          {/* Schedule Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Agendamento & Localização
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-xl text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Data e Hora
                  </p>
                  <p className="text-sm font-bold">
                    {booking.scheduledAt
                      ? dateFormatter.format(new Date(booking.scheduledAt))
                      : "A definir pelo prestador"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-xl text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Local das Operações
                  </p>
                  <p className="text-sm font-bold">
                    Remoto / No cliente (a combinar)
                  </p>
                </div>
              </div>
            </div>
          </section>

          <Separator className="bg-border/50" />

          {/* Participant Section */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {isProviderView
                ? "Informações do Cliente"
                : "Informações do Prestador"}
            </h4>
            <div className="flex items-center gap-4 p-4 rounded-3xl bg-muted/30 border border-border/50">
              <Avatar className="w-12 h-12 border-2 border-primary/20">
                <AvatarImage
                  src={
                    isProviderView
                      ? booking.client?.avatarUrl || ""
                      : booking.service.provider.avatarUrl || ""
                  }
                />
                <AvatarFallback className="font-bold text-lg">
                  {(isProviderView
                    ? booking.client?.name
                    : booking.service.provider.name
                  )
                    ?.substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold">
                  {isProviderView
                    ? booking.client?.name
                    : booking.service.provider.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {isProviderView
                    ? booking.client?.email
                    : booking.service.provider.email}
                </p>
              </div>
            </div>
          </section>

          {/* Notes Section */}
          {booking.notes && (
            <section className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Notas do Pedido
              </h4>
              <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 flex gap-3">
                <MessageSquare className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm italic text-muted-foreground/90">
                  &quot;{booking.notes}&quot;
                </p>
              </div>
            </section>
          )}

          {/* Cancellation Section */}
          {booking.status === ApiBookingStatus.CANCELLED && (
            <section className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500">
                Motivo do Cancelamento
              </h4>
              <div className="p-4 rounded-3xl bg-red-500/5 border border-red-500/10 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm italic text-red-500/90 leading-relaxed">
                  {booking.cancelReason || "Nenhum motivo fornecido."}
                </p>
              </div>
            </section>
          )}

          <div className="pt-8 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-black opacity-30">
            ID: {booking.id}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
