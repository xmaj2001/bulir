"use client";

import { useState } from "react";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  UpdateBalance,
  UpdateBalanceForm,
} from "@/components/balance/update-balance";
import { toast } from "sonner";
import { useUserMe } from "@/hooks/use-user";
import { formatCurrency } from "@/lib/utils";

export function PageTransaction() {
  const [isRunning, setIsRunning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { userQuery } = useUserMe();
  const [clientBalance, setClientBalance] = useState(0);

  const handleCloseUpdateBalance = () => {
    setIsOpen(false);
  };

  const handleSuccessUpdateBalance = (data: UpdateBalanceForm) => {
    setClientBalance(
      data.amount ? clientBalance + parseFloat(data.amount) : clientBalance
    );
    setIsSuccess(true);
    toast.success("Saldo atualizado com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseUpdateBalance}>
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Client Side */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              {userQuery.data?.name}
            </h3>
            <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
              <p className="text-sm text-muted-foreground">Saldo Disponível</p>
              <p className="text-3xl font-bold text-primary transition-all duration-300">
                {formatCurrency(userQuery.data?.balance || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-4xl text-muted-foreground animate-bounce">
              <Wallet className="md:size-3/1" />
            </div>
          </div>
        </div>

        {/* Status Message */}
        {isSuccess && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 animate-slideIn mb-6">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Saldo atualizado com Sucesso!
            </p>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
              Ambas as operações foram executadas atomicamente. Não houve
              inconsistências de dados.
            </p>
          </div>
        )}

        {/* Recentes transações */}
        <div className="space-y-3 p-4 rounded-lg bg-muted/30 mb-6">
          <h4 className="font-semibold text-foreground text-sm">
            Detalhes Perfil
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Perfil</p>
              <p className="font-medium text-foreground">
                {userQuery.data?.role === "client" ? "Cliente" : "Prestador"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">email</p>
              <p className="font-medium text-primary">
                {userQuery.data?.email}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">NIF</p>
              <p className="font-medium text-foreground">
                {userQuery.data?.nif}
              </p>
            </div>

            <Button
              variant="link"
              className="flex flex-col items-start p-0 w-1/5"
            >
              <p className="text-muted-foreground">Alterar senha</p>
            </Button>
          </div>
        </div>
        <UpdateBalance
          onClose={handleCloseUpdateBalance}
          onSuccess={handleSuccessUpdateBalance}
          setLoading={setIsRunning}
        />
        {/* Controls */}
        {/* <div className="flex gap-3">
          <Button
            onClick={() => setIsOpen(true)}
            disabled={isRunning || step === "success"}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Atualizar Saldo
          </Button>
        </div> */}
      </div>
    </Dialog>
  );
}

export default function Page() {
  return <PageTransaction />;
}
