"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export type ServiceStatus = "PENDING" | "IN_PROCESS" | "FINISHED" | "CANCELED";

interface StatusAtomProps {
  status: ServiceStatus;
  reason?: string;
}

const statusConfig = {
  PENDING: {
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    label: "Pendente",
    icon: Clock,
    description: "Aguardando confirmação do prestador.",
  },
  IN_PROCESS: {
    color: "text-primary",
    bg: "bg-primary/10",
    label: "Em Processo",
    icon: PlayCircle,
    description: "O serviço está sendo executado no momento.",
  },
  FINISHED: {
    color: "text-green-500",
    bg: "bg-green-500/10",
    label: "Finalizado",
    icon: CheckCircle2,
    description: "Serviço concluído com sucesso.",
  },
  CANCELED: {
    color: "text-destructive",
    bg: "bg-destructive/10",
    label: "Cancelado",
    icon: XCircle,
    description: "O serviço foi interrompido.",
  },
};

export default function StatusAtom({ status, reason }: StatusAtomProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col gap-4 p-6 bg-card border border-border rounded-3xl relative overflow-hidden group">
      <motion.div layout className="flex items-center gap-4 z-10">
        <div
          className={`p-3 rounded-2xl ${config.bg} ${config.color} group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold uppercase tracking-wider text-xs ${config.color}`}
            >
              {config.label}
            </span>
            {status === "IN_PROCESS" && (
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <h3 className="font-bold text-lg mt-0.5">{config.description}</h3>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {status === "CANCELED" && reason && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-start gap-3 p-4 bg-destructive/5 border border-destructive/10 rounded-2xl"
          >
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-destructive">Motivo: </span>
              <span className="text-muted-foreground">{reason}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Line */}
      <div className="absolute left-0 bottom-0 h-1 bg-border w-full overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: status === "FINISHED" ? "0%" : "-50%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className={`h-full w-full ${status === "FINISHED" ? "bg-green-500" : status === "CANCELED" ? "bg-destructive" : "bg-primary"}`}
        />
      </div>

      {/* Background Micro-animation */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl -z-0 ${config.bg}`}
      />
    </div>
  );
}
