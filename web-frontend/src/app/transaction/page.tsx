"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserMe } from "@/hooks/use-user";

export function PageTransaction() {
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState<"idle" | "running" | "success" | "rollback">(
    "idle"
  );
  const { userQuery } = useUserMe();
  const [clientBalance, setClientBalance] = useState(
    userQuery.data?.balance ?? 0
  );
  const [providerBalance, setProviderBalance] = useState(800);

  console.log("User Data:", userQuery.data);
  const runTransaction = async () => {
    setIsRunning(true);
    setStep("running");

    // Simulate transaction steps
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update balances
    setClientBalance((prev) => prev - 75);
    setProviderBalance((prev) => prev + 75);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setStep("success");
    setIsRunning(false);
  };

  const rollback = async () => {
    setIsRunning(true);
    setStep("running");

    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStep("rollback");

    await new Promise((resolve) => setTimeout(resolve, 800));
    setClientBalance(250);
    setProviderBalance(800);
    setStep("idle");
    setIsRunning(false);
  };

  const reset = () => {
    setClientBalance(250);
    setProviderBalance(800);
    setStep("idle");
  };

  const formatBalance = (balance: string) => {
    const amount = parseFloat(balance);
    if (isNaN(amount)) {
      return "0 Kz";
    } else {
      return `${amount.toFixed(2)} Kz`;
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Client Side */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">👤 Cliente</h3>
          <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
            <p className="text-sm text-muted-foreground">Saldo Disponível</p>
            <p className="text-3xl font-bold text-primary transition-all duration-300">
              {clientBalance.toFixed(2)}kz
            </p>
            {step === "running" && (
              <div className="mt-3 space-y-1">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="animate-slideBalance h-full bg-primary"></div>
                </div>
                <p className="text-xs text-primary">Debitando 75.00€...</p>
              </div>
            )}
            {step === "success" && (
              <p className="text-xs text-emerald-500 mt-2">
                ✓ Debitado com sucesso
              </p>
            )}
          </div>
        </div>

        {/* Transaction Arrow */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 ${
                step === "running"
                  ? "bg-primary/20 scale-110"
                  : step === "success"
                  ? "bg-emerald-500/20"
                  : "bg-muted"
              }`}
            >
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </div>
            <p
              className={`text-sm font-semibold mt-3 transition-colors ${
                step === "running"
                  ? "text-primary animate-pulseGlow"
                  : step === "success"
                  ? "text-emerald-500"
                  : step === "rollback"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {step === "idle" && "Aguardando"}
              {step === "running" && "Transação em Andamento"}
              {step === "success" && "✓ Concluída"}
              {step === "rollback" && "↶ Revertendo"}
            </p>
          </div>
        </div>

        {/* Provider Side */}
        <div className="space-y-4 md:col-span-1 md:row-span-1">
          <h3 className="text-lg font-bold text-foreground">
            💼 Prestador de Serviço
          </h3>
          <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <p className="text-sm text-muted-foreground">Saldo Recebido</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 transition-all duration-300">
              {providerBalance.toFixed(2)}€
            </p>
            {step === "running" && (
              <div className="mt-3 space-y-1">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="animate-slideBalance h-full bg-emerald-500"></div>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Creditando 75.00€...
                </p>
              </div>
            )}
            {step === "success" && (
              <p className="text-xs text-emerald-500 mt-2">
                ✓ Creditado com sucesso
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status Message */}
      {step === "success" && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 animate-slideIn mb-6">
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ Transação Atômica Concluída com Sucesso!
          </p>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            Ambas as operações foram executadas atomicamente. Não houve
            inconsistências de dados.
          </p>
        </div>
      )}

      {step === "rollback" && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 animate-slideIn mb-6">
          <p className="text-sm font-semibold text-destructive">
            ↶ Transação Revertida - Nenhuma Alteração Aplicada
          </p>
          <p className="text-xs text-destructive/80 mt-1">
            Os saldos retornaram ao estado anterior. A integridade dos dados foi
            mantida.
          </p>
        </div>
      )}

      {/* Details */}
      <div className="space-y-3 p-4 rounded-lg bg-muted/30 mb-6">
        <h4 className="font-semibold text-foreground text-sm">
          Detalhes da Transação
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Serviço</p>
            <p className="font-medium text-foreground">
              Reparação de Encanamento
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Valor</p>
            <p className="font-medium text-primary">75.00€</p>
          </div>
          <div>
            <p className="text-muted-foreground">ID Transação</p>
            <p className="font-medium text-foreground">TXN-2026-0001</p>
          </div>
          <div>
            <p className="text-muted-foreground">Data</p>
            <p className="font-medium text-foreground">6 Jan 2026</p>
          </div>
          <div>
            <p className="text-muted-foreground">Hora</p>
            <p className="font-medium text-foreground">14:23:45</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p
              className={`font-medium ${
                step === "success"
                  ? "text-emerald-500"
                  : step === "rollback"
                  ? "text-destructive"
                  : step === "running"
                  ? "text-primary animate-pulseGlow"
                  : "text-muted-foreground"
              }`}
            >
              {step === "idle" && "Pendente"}
              {step === "running" && "Processando..."}
              {step === "success" && "Concluída"}
              {step === "rollback" && "Revertida"}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={runTransaction}
          disabled={isRunning || step === "success"}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Play className="w-4 h-4 mr-2" />
          {step === "success" ? "Transação Realizada" : "Executar Transação"}
        </Button>

        {step === "success" && (
          <Button
            onClick={rollback}
            disabled={isRunning}
            className="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Simular Falha (Rollback)
          </Button>
        )}

        {(step === "success" || step === "rollback") && (
          <Button
            onClick={reset}
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <PageTransaction />;
}
