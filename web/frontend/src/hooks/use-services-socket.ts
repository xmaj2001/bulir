"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import type { ApiService } from "@/lib/api";

const WS_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(`${WS_URL}/services`, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}

export function useServicesSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = getSocket();

    // Quando um novo serviço é criado pelo PROVIDER
    // injecta directamente no cache — sem refetch
    ws.on("service:created", (newService: ApiService) => {
      queryClient.setQueryData<ApiService[]>(["services"], (prev) => {
        if (!prev) return [newService];
        // Evita duplicados se por algum motivo chegar duas vezes
        const exists = prev.some((s) => s.id === newService.id);
        if (exists) return prev;
        return [newService, ...prev]; // mais recente primeiro
      });
    });

    // Quando um serviço é desactivado
    // remove-o do cache ou marca como inactivo
    ws.on("service:deactivated", ({ id }: { id: string }) => {
      queryClient.setQueryData<ApiService[]>(
        ["services"],
        (prev) => prev?.filter((s) => s.id !== id) ?? [],
      );
    });

    ws.on("connect", () => {
      console.log("[ws] /services conectado");
    });

    ws.on("disconnect", (reason) => {
      console.warn("[ws] /services desconectado:", reason);
    });

    ws.on("connect_error", (err) => {
      console.error("[ws] /services erro de ligação:", err.message);
    });

    return () => {
      ws.off("service:created");
      ws.off("service:deactivated");
      ws.off("connect");
      ws.off("disconnect");
      ws.off("connect_error");
    };
  }, [queryClient]);
}
