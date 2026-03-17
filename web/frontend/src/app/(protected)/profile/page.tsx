"use client";

import {
  User as UserIcon,
  Mail,
  Shield,
  Hash,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMe } from "@/hooks/use-me";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: user, isLoading } = useMe();
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const infoItems = [
    { label: "Email", value: user?.email || "Sem email", icon: Mail },
    {
      label: "NIF",
      value: user?.nif || "Não fornecido",
      icon: Hash,
    },
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
              <UserIcon className="w-16 h-16 text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-background border border-border p-2 rounded-full">
              <BadgeCheck className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-primary">
            {user?.name}
          </p>
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
                onClick={() => router.push("/auth/change-password")}
              >
                <Hash className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span>Alterar Senha de Acesso</span>
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
