import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Power, Trash2, MoreVertical, Plus } from "lucide-react";
import { ApiService } from "@/lib/api";

import { useCreateBooking } from "@/hooks/use-bookings";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  service: ApiService;
  buttonBooking?: boolean;
  providerId: string;
  i: number;
}

export default function ServiceCard({
  service,
  i,
  buttonBooking,
  providerId,
}: ServiceCardProps) {
  const { mutate: createBooking, isPending } = useCreateBooking();

  const handleBooking = () => {
    createBooking(
      { serviceId: service.id },
      {
        onSuccess: () => {
          alert("Reserva efetuada com sucesso!");
        },
        onError: (error) => {
          alert(
            error instanceof Error ? error.message : "Erro ao efetuar reserva",
          );
        },
      },
    );
  };
  return (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.05 }}
      className="group relative bg-card border border-border p-6 rounded-[2rem] hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        {providerId == service.providerId && (
          <div className="flex-1">
            <Badge variant={service.isActive ? "default" : "secondary"}>
              {service.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>
        )}

        {providerId === service.providerId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2">
                <Edit2 className="w-4 h-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Power className="w-4 h-4" />{" "}
                {service.isActive ? "Desativar" : "Ativar"}
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-destructive">
                <Trash2 className="w-4 h-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {service.imageUrl && (
        <div className="relative aspect-video mb-4 overflow-hidden rounded-2xl border border-border">
          <Image
            width={500}
            height={500}
            src={service.imageUrl || "/placeholder.jpg"}
            alt={service.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}

      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
        {service.name}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
        {service.description}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
            Preço
          </span>
          <span className="text-2xl font-black text-glow-sm">
            {new Intl.NumberFormat("pt-AO", {
              style: "currency",
              currency: "AOA",
            }).format(service.price)}
          </span>
        </div>

        <div className="flex -space-x-2">
          {buttonBooking && providerId !== service.providerId && (
            <Button
              className="rounded-xl gap-2 h-10 px-6 font-bold shadow-glow hover:shadow-glow-lg transition-all"
              onClick={handleBooking}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {isPending ? "Reservando..." : "Reservar"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
