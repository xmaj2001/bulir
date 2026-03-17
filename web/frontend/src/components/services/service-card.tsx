import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit2, Power, Trash2, MoreVertical, Plus, X } from "lucide-react";
import { ApiService, ApiRequestError } from "@/lib/api";

import { useCreateBooking } from "@/hooks/use-bookings";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBooking = () => {
    createBooking(
      { serviceId: service.id },
      {
        onSuccess: () => {
          alert("Reserva efetuada com sucesso!");
        },
        onError: (error) => {
          if (error instanceof ApiRequestError) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("Ocorreu um erro inesperado ao tentar reservar.");
          }
          setErrorModalOpen(true);
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

      <Link href={`/services/${service.id}`} className="block space-y-4">
        {service.imageUrl && (
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border">
            <Image
              width={500}
              height={500}
              src={service.imageUrl || "/placeholder.jpg"}
              alt={service.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}

        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
          {service.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
      </Link>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
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
      <AlertDialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <AlertDialogContent className="rounded-[1rem] border-border bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <div className="flex items-center justify-center mb-4 w-full py-4">
              <div className="bg-amber-300/10 p-3 rounded-full">
                <X className="w-6 h-6 text-amber-300" />
              </div>
            </div>
            <AlertDialogTitle className="text-xl font-bold">
              {"Não foi possível efetuar a reserva"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-center">
            <AlertDialogAction className="rounded-lg font-bold h-10 shadow-glow hover:shadow-glow-lg transition-all">
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
