"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Receipt,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useWalletSummary,
  useWalletTransactions,
  useTransactionDetail,
} from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export default function WalletPage() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string | undefined>(undefined);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(false);

  const { data: summary, isLoading: isLoadingSummary } = useWalletSummary();
  const { data: transactionsData, isLoading: isLoadingTransactions } =
    useWalletTransactions({
      page,
      type: type === "ALL" ? undefined : type,
    });

  const currencyFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  });

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      BOOKING_PAYMENT: "Pagamento de Reserva",
      BOOKING_REFUND: "Reembolso de Reserva",
      BOOKING_RECEIPT: "Recebimento de Serviço",
      MANUAL_ADJUSTMENT: "Ajuste Manual",
    };
    return labels[reason] || reason;
  };

  const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl tracking-tighter text-glow mb-2 uppercase flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            Minha Carteira
          </h1>
          <p className="text-muted-foreground">
            Monitoriza o teu saldo e histórico de transações em tempo real.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-card border border-border p-8 rounded-[3rem] relative overflow-hidden group flex flex-col justify-between min-h-[250px]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-32 h-32 text-primary" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Saldo Disponível
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="h-8 w-8 rounded-full hover:bg-primary/10"
              >
                {showBalance ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <div className="text-4xl font-black text-glow-sm tracking-tighter break-all">
              {currencyFormatter.format(summary?.balance || 0)}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-sm py-2 border-b border-border/50">
              <span className="text-muted-foreground">Total de Transações</span>
              <span className="font-bold">{summary?.totalTx || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats/Quick Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border p-6 rounded-[2.5rem] flex items-center gap-5 hover:border-primary/30 transition-colors"
          >
            <div className="p-4 bg-green-500/10 rounded-2xl">
              <ArrowUpRight className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">
                Ganhos Totais
              </p>
              <p className="text-xl font-black">---</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border p-6 rounded-[2.5rem] flex items-center gap-5 hover:border-primary/30 transition-colors"
          >
            <div className="p-4 bg-red-500/10 rounded-2xl">
              <ArrowDownLeft className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">
                Gastos Totais
              </p>
              <p className="text-xl font-black">---</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-primary/5 border border-primary/20 p-6 rounded-[2.5rem] flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Relatório Mensal</h3>
                <p className="text-xs text-muted-foreground">
                  Visualiza o teu desempenho financeiro detalhado.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </div>

      {/* Transactions Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
            Histórico <span className="text-primary">Recente</span>
          </h2>

          <div className="flex items-center gap-2">
            <div className="flex bg-muted p-1 rounded-xl">
              {["ALL", "CREDIT", "DEBIT"].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    setPage(1);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    type === t || (t === "ALL" && !type)
                      ? "bg-card shadow-sm text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "ALL"
                    ? "Todos"
                    : t === "CREDIT"
                      ? "Crédito"
                      : "Débito"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {isLoadingTransactions ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-full bg-card animate-pulse border border-border rounded-2xl"
              />
            ))
          ) : transactionsData?.items.length === 0 ? (
            <div className="bg-card border border-dashed border-border p-12 rounded-[3rem] text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  Sem transações encontradas
                </h3>
                <p className="text-muted-foreground">
                  Ainda não realizaste nenhuma operação financeira.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {transactionsData?.items.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedTxId(tx.id)}
                  className="bg-card border border-border p-4 md:p-6 rounded-[2rem] hover:border-primary/30 transition-all group flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-3 rounded-2xl",
                        tx.type === "CREDIT"
                          ? "bg-green-500/10"
                          : "bg-red-500/10",
                      )}
                    >
                      {tx.type === "CREDIT" ? (
                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold group-hover:text-primary transition-colors">
                        {getReasonLabel(tx.reason)}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateFormatter.format(new Date(tx.createdAt))}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={cn(
                        "text-lg font-black tracking-tighter",
                        tx.type === "CREDIT" ? "text-green-500" : "text-white",
                      )}
                    >
                      {tx.type === "CREDIT" ? "+" : "-"}
                      {currencyFormatter.format(tx.amount)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                      Saldo: {currencyFormatter.format(tx.balanceAfter)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Pagination */}
        {transactionsData && transactionsData.meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-xl font-bold"
            >
              Anterior
            </Button>
            <span className="text-xs font-bold px-4">
              Página {page} de {transactionsData.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === transactionsData.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl font-bold"
            >
              Próxima
            </Button>
          </div>
        )}
      </section>

      <TransactionDetailsSheet
        id={selectedTxId}
        open={!!selectedTxId}
        onOpenChange={(open) => !open && setSelectedTxId(null)}
      />
    </div>
  );
}

function TransactionDetailsSheet({
  id,
  open,
  onOpenChange,
}: {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: tx, isLoading } = useTransactionDetail(id || "");

  const currencyFormatter = new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  });

  const dateFormatter = new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md border-l border-border bg-card/95 backdrop-blur-xl px-4">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
            Detalhes da <span className="text-primary">Transação</span>
          </SheetTitle>
          <SheetDescription>
            Informações detalhadas sobre a operação financeira.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-24 bg-muted rounded-3xl" />
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded-xl w-3/4" />
              <div className="h-10 bg-muted rounded-xl w-1/2" />
              <div className="h-10 bg-muted rounded-xl w-2/3" />
            </div>
          </div>
        ) : tx ? (
          <div className="space-y-8">
            <div
              className={cn(
                "p-6 rounded-[2rem] border border-border bg-linear-to-br",
                tx.type === "CREDIT"
                  ? "from-green-500/10 to-transparent"
                  : "from-primary/5 to-transparent",
              )}
            >
              <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                Montante
              </p>
              <p
                className={cn(
                  "text-3xl font-black tracking-tighter",
                  tx.type === "CREDIT" ? "text-green-500" : "text-white",
                )}
              >
                {tx.type === "CREDIT" ? "+" : "-"}
                {currencyFormatter.format(tx.amount)}
              </p>
            </div>

            <div className="space-y-4">
              <DetailItem label="ID da Transação" value={tx.id} isCode />
              <DetailItem
                label="Tipo"
                value={tx.type === "CREDIT" ? "Crédito" : "Débito"}
              />
              <DetailItem label="Motivo" value={tx.reason.replace(/_/g, " ")} />
              <DetailItem
                label="Data e Hora"
                value={dateFormatter.format(new Date(tx.createdAt))}
              />
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Saldo Anterior</span>
                <span className="font-bold">
                  {currencyFormatter.format(tx.balanceBefore)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Saldo Posterior</span>
                <span className="font-bold text-primary">
                  {currencyFormatter.format(tx.balanceAfter)}
                </span>
              </div>
            </div>

            {tx.booking && (
              <div className="mt-8 p-6 bg-muted/30 border border-border rounded-[2rem] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold">Serviço Relacionado</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Serviço</span>
                    <span className="font-bold">{tx.booking.service.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Status Reserva
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0">
                      {tx.booking.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Não foi possível carregar os detalhes.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({
  label,
  value,
  isCode,
}: {
  label: string;
  value: string;
  isCode?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "text-sm font-bold",
          isCode &&
            "font-mono text-[11px] bg-muted px-2 py-1 rounded-md break-all",
        )}
      >
        {value}
      </p>
    </div>
  );
}
