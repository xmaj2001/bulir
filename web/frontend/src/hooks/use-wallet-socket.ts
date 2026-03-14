"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import type { ApiService, ApiUser } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

const WS_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(`${WS_URL}/user`, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}
interface Deposit {
  userId: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
}
export function useWalletSocket() {
  const { setUser, user } = useAuthStore();
  useEffect(() => {
    const ws = getSocket();

    ws.on("user:deposit", (deposit: Deposit) => {
      console.log("[ws] user:deposit", deposit);
      const newUser = {
        ...user,
        balance: deposit.balanceAfter,
      } as ApiUser;
      setUser(newUser);
    });

    ws.on("connect", () => {
      console.log("[ws] /user conectado");
    });

    ws.on("disconnect", (reason) => {
      console.warn("[ws] /user desconectado:", reason);
    });

    ws.on("connect_error", (err) => {
      console.error("[ws] /user erro de ligação:", err.message);
    });

    return () => {
      ws.off("user:deposit");
      ws.off("connect");
      ws.off("disconnect");
      ws.off("connect_error");
    };
  }, [user, setUser]);
}
