"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Shield,
  Clock,
  Star,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useCreateBooking } from "@/hooks/use-bookings";
import { ApiRequestError } from "@/lib/api";
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
import { motion } from "framer-motion";
import { useService } from "@/hooks/use-services";
import { useSession } from "next-auth/react";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const providerId = session?.user?.id;
  const { data: service, isLoading, error } = useService(id as string);
  const { mutate: createBooking, isPending } = useCreateBooking();

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBooking = () => {
    createBooking(
      { serviceId: service!.id },
      {
        onSuccess: () => {
          router.push("/bookings");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold">Serviço não encontrado</h1>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group mb-4"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Voltar para serviços
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Image and Description */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-border bg-card shadow-2xl"
          >
            <Image
              src={service.imageUrl || "/placeholder.jpg"}
              alt={service.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <Badge className="mb-4 bg-primary text-primary-foreground font-bold px-4 py-1 rounded-full border-none">
                {service.isActive ? "Disponível" : "Indisponível"}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black text-white text-glow-lg">
                {service.name}
              </h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-[2.5rem] space-y-6"
          >
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Sobre o Serviço
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {service.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-border">
              <div className="flex flex-col items-center p-4 rounded-3xl bg-background/50 border border-border">
                <Shield className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  Garantia
                </span>
                <span className="text-sm font-black">Bulir Safe</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-3xl bg-background/50 border border-border">
                <Clock className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  Duração
                </span>
                <span className="text-sm font-black">Flexível</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-3xl bg-background/50 border border-border">
                <MapPin className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  Tipo
                </span>
                <span className="text-sm font-black">Presencial</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-3xl bg-background/50 border border-border">
                <Star className="w-6 h-6 text-amber-400 mb-2" />
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  Avaliação
                </span>
                <span className="text-sm font-black">5.0</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Pricing and Provider */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border p-8 rounded-[2.5rem] shadow-xl sticky top-24"
          >
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1 block">
                Investimento
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-glow-sm">
                  {new Intl.NumberFormat("pt-AO", {
                    style: "currency",
                    currency: "AOA",
                  }).format(service.price)}
                </span>
              </div>
            </div>

            {providerId !== service.providerId && (
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

            <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
              Ao reservar, os fundos ficarão retidos com segurança até a
              conclusão do serviço.
            </p>

            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary border border-primary/20">
                  {service.providerId.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    Prestador
                  </span>
                  <h4 className="font-bold">{service.provider.name}</h4>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AlertDialog open={errorModalOpen} onOpenChange={setErrorModalOpen}>
        <AlertDialogContent className="rounded-[2rem] border-border bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Não foi possível efetuar a reserva
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-xl font-bold h-12 shadow-glow hover:shadow-glow-lg transition-all">
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
