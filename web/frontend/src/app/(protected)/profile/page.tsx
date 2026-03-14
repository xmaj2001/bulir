"use client";

import {
  User as UserIcon,
  Mail,
  Shield,
  Wallet,
  Hash,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useWalletSocket } from "@/hooks/use-wallet-socket";

export default function ProfilePage() {
  const { user } = useAuth();
  useWalletSocket();
  const infoItems = [
    { label: "Email", value: user?.email || "Sem email", icon: Mail },
    {
      label: "NIF",
      value: (user as { nif?: string })?.nif || "Não fornecido",
      icon: Hash,
    },
    {
      label: "Cargo",
      value:
        (user as { role?: string })?.role === "PROVIDER"
          ? "Prestador de Serviços"
          : "Cliente",
      icon: Shield,
    },
    { label: "ID de Conta", value: user?.id || "N/A", icon: BadgeCheck },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl tracking-tighter text-glow mb-2 uppercase">
          Perfil de Utilizador
        </h1>
        <p className="text-muted-foreground">
          Gere as tuas informações pessoais e visualiza as estatísticas da tua
          conta.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 bg-card border border-border p-8 rounded-[3rem] flex flex-col items-center text-center space-y-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-primary/20 bg-primary/10 flex items-center justify-center overflow-hidden shadow-glow-sm">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name || "Avatar"}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16 text-primary" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-background border border-border p-2 rounded-full">
              <BadgeCheck className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <Badge
              variant="outline"
              className="mt-2 border-primary/50 text-primary uppercase tracking-widest text-[10px]"
            >
              {(user as { role?: string })?.role}
            </Badge>
          </div>

          <div className="w-full pt-6 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Saldo Atual
              </span>
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-black text-glow-sm tracking-tighter">
              {new Intl.NumberFormat("pt-AO", {
                style: "currency",
                currency: "AOA",
              }).format((user as { balance?: number })?.balance || 0)}
            </div>
            <Button
              size="sm"
              className="w-full mt-4 rounded-xl font-bold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            >
              Carregar Saldo
            </Button>
          </div>
        </motion.div>

        {/* Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border p-6 rounded-[2rem] hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
                <p className="text-lg font-bold truncate">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border p-8 rounded-[3.5rem] relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Segurança da Conta</h3>
                <p className="text-sm text-muted-foreground">
                  Gerencie a segurança e as permissões da sua conta Bulir.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start rounded-2xl h-12 gap-3 group"
              >
                <Hash className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Alterar Senha de Acesso</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-2xl h-12 gap-3 group"
              >
                <BadgeCheck className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Configurar Verificação em Duas Etapas</span>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-2 p-4 bg-muted/50 rounded-2xl text-xs text-muted-foreground border border-border/30">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Sempre mantenha os seus dados atualizados para garantir a
              segurança dos pagamentos.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
