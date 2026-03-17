"use client";

import { Search, Filter, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProviderBookings } from "@/hooks/use-bookings";
import BookingCard from "@/components/bookings/booking-card";

export default function OrdersPage() {
  const { data: providerBookings, isLoading: loadingProvider } =
    useProviderBookings();

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow">
            Pedidos de Serviços
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o estado dos pedidos de serviços dos seus clientes.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar pedidos..."
              className="pl-10 h-10 rounded-xl bg-card border-border"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="space-y-6">
        {loadingProvider ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonBookingCard key={i} />
            ))}
          </div>
        ) : providerBookings?.length === 0 ? (
          <EmptyState message="Ainda não recebeste nenhuna pedido de reserva." />
        ) : (
          <div className="space-y-4">
            {providerBookings?.map((booking, i) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                i={i}
                isProviderView={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonBookingCard() {
  return (
    <div className="h-32 rounded-[2rem] bg-card/50 animate-pulse border border-border/50" />
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-border rounded-[2rem]">
      <AlertCircle className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button variant="outline" className="rounded-xl font-bold">
        Explorar serviços
      </Button>
    </div>
  );
}
