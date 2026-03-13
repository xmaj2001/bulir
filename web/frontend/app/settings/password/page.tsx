"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import OTPVerification from "@/components/security/OTPVerification";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowOtp(true);
    }, 1000);
  };

  const onVerify = (otp: string) => {
    alert("Senha alterada com sucesso!");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-24 flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-5">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 mb-8 -ml-4">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
            </Button>
          </Link>

          <h1 className="text-5xl font-black tracking-tight mb-6 italic leading-none">
            Segurança em <span className="text-primary">primeiro</span> lugar.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-12">
            Mantenha sua conta protegida. Recomendamos alterar sua senha a cada
            90 dias para garantir a máxima segurança dos seus dados.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Criptografia de ponta", icon: Lock },
              { label: "Verificação em duas etapas", icon: Lock },
              { label: "Monitoramento 24/7", icon: Lock },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <AnimatePresence mode="wait">
            {!showOtp ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full max-w-lg bg-card border border-border p-10 rounded-[3rem] shadow-2xl"
              >
                <h2 className="text-2xl font-bold mb-8">Alterar Senha</h2>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Senha Atual</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 border-2"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 border-2"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Confirmar Nova Senha</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-12 border-2"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 font-bold text-lg mt-8"
                    disabled={loading}
                  >
                    {loading ? "Processando..." : "Confirmar Alteração"}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex justify-center"
              >
                <OTPVerification
                  onVerify={onVerify}
                  onCancel={() => setShowOtp(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
