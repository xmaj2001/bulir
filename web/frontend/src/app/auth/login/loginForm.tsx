"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const loginSchema = z.object({
  emailOrNif: z.string().min(1, "Email ou NIF é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      identifier: data.emailOrNif,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciais inválidas. Verifique o seu e-mail/NIF e senha.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden font-sans">
      {/* Left side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative bg-linear-to-b from-background via-background to-muted/10"
      >
        {/* Navigation Overlays */}
        <div className="absolute top-8 left-8 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="p-2 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-all">
              <Image src="/Logo.png" alt="Qcena Logo" width={24} height={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight">Qcena</h1>
          </motion.div>

          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-all px-2 py-1"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Voltar ao início</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-10">
          <div className="space-y-3 text-center lg:text-left">
            <h3 className="text-4xl font-black tracking-tighter text-glow-sm">
              Bem-vindo de Volta
            </h3>
            <p className="text-muted-foreground text-lg italic">
              Introduz as tuas credenciais para aceder ao teu espaço.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {justRegistered && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl p-4 text-emerald-400 text-sm font-medium flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Conta criada com sucesso! Já podes entrar.
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-destructive text-sm font-medium flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="emailOrNif"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Email ou NIF
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="emailOrNif"
                    placeholder="exemplo@email.com ou 123456789"
                    className="bg-muted/30 border-border rounded-2xl h-12 pl-12 transition-all focus:ring-2 focus:ring-primary/20 outline-none hover:bg-muted/50"
                    {...register("emailOrNif")}
                  />
                </div>
                {errors.emailOrNif && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-destructive text-[11px] font-bold ml-1"
                  >
                    {errors.emailOrNif.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    Senha
                  </Label>
                  <Link
                    href="#"
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                  >
                    Esqueceste a senha?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Introduza a sua senha"
                    className="bg-muted/30 border-border rounded-2xl h-12 pl-12 pr-12 transition-all focus:ring-2 focus:ring-primary/20 outline-none hover:bg-muted/50"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-destructive text-[11px] font-bold ml-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-muted/30 text-primary focus:ring-offset-background focus:ring-primary transition-all cursor-pointer"
                  />
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Lembrar sessão
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex gap-3"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Aceder à Plataforma
                    <LogIn className="w-5 h-5" />
                  </>
                )}
              </Button>

              <div className="text-center font-medium">
                <p className="text-muted-foreground">
                  Ainda não tens conta?{" "}
                  <Link
                    href="/auth/register"
                    className="text-primary font-black hover:underline underline-offset-4 decoration-2"
                  >
                    Registar agora
                  </Link>
                </p>
              </div>
            </div>
          </form>

          {/* Background Ambient Light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
      </motion.div>

      {/* Right side - Immersive Branding (Symmetrical to Register) */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        <Image
          src="/images/background1.jpg"
          alt="Premium background"
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-tl from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-background/40" />

        <div className="relative z-10 flex flex-col justify-center items-center p-16 w-full h-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mb-12 relative"
          >
            <div className="p-6 rounded-[40px] relative z-10">
              <Image
                src="/Logo.png"
                alt="Qcena Logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            {/* Spinning Glow Effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
          </motion.div>

          <div className="max-w-md space-y-6">
            <h2 className="text-5xl font-black text-white leading-tight">
              Excelência em cada{" "}
              <span className="text-primary italic">Cena</span>
            </h2>
            <p className="text-lg text-white/70 leading-relaxed font-medium">
              A maior rede de serviços especializados, desenhada para facilitar
              a tua vida e potenciar o teu crescimento.
            </p>

            <div className="flex justify-center gap-6 pt-8">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-white/50">
                  Seguro
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-3">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-white/50">
                  Instantâneo
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Hints */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-2xl">
            <p className="text-xs font-bold text-white/70">Novo por aqui?</p>
            <Link
              href="/auth/register"
              className="flex items-center gap-2 text-xs font-black text-primary hover:text-white transition-colors"
            >
              Cria uma conta <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
