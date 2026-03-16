"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import type { ApiService, ApiUser } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { useSession } from "next-auth/react";

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

interface BookingCreated {
  userId: string;
  balanceAfter: number;
}

export function useWalletSocket() {
  const { data: session, update } = useSession();
  useEffect(() => {
    const ws = getSocket();

    ws.on("user:deposit", async (deposit: Deposit) => {
      console.log("[ws] user:deposit", deposit);

      if (session && session.user.id === deposit.userId) {
        await update({
          ...session,
          user: {
            ...session.user,
            balance: deposit.balanceAfter,
          },
        });
        console.log("[ws] user:deposit - atualizando saldo");
      }
    });

    ws.on("user:bookingCreated", async (bookingCreated: BookingCreated) => {
      console.log("[ws] user:bookingCreated", bookingCreated);

      if (session && session.user.id === bookingCreated.userId) {
        await update({
          ...session,
          user: {
            ...session.user,
            balance: bookingCreated.balanceAfter,
          },
        });
        console.log("[ws] user:bookingCreated - atualizando saldo");
      }
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
      ws.off("user:bookingCreated");
      ws.off("connect");
      ws.off("disconnect");
      ws.off("connect_error");
    };
  }, [session, update]);
}
