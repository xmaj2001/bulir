"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex dark:bg-zinc-900">
      {/* Left side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative"
      >
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Image src="/Logo.png" alt="Qcena Logo" width={20} height={20} />
            <h1 className="text-3xltext-white">
              Q<span>cena</span>
            </h1>
          </div>
          <Link
            href="/"
            className="ml-4 animate-pulse text-sm text-foreground/70 border border-foreground/30 rounded-full px-4 py-1 hover:bg-foreground/10 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={20} className="text-primary" />{" "}
            <span className="text-primary">Voltar ao site</span>
          </Link>
        </div>
        <div className="w-full max-w-md space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence>
              {justRegistered && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-400 text-sm"
                >
                  ✅ Conta criada com sucesso! Podes iniciar sessão agora.
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="emailOrNif">Email ou NIF</Label>
              <Input
                id="emailOrNif"
                placeholder="exemplo@email.com ou NIF"
                className="dark:input-dark h-12"
                {...register("emailOrNif")}
              />
              {errors.emailOrNif && (
                <p className="text-destructive text-sm">
                  {errors.emailOrNif.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Introduza a sua senha"
                  className="dark:input-dark h-12 pr-12"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-border dark:bg-zinc-900"
                />
                <span className="text-muted-foreground">Lembrar-me</span>
              </label>
              <Link href="#" className="text-sm text-primary hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Entrar"}
            </Button>

            <div>
              <p className="mt-2 text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline font-medium"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </form>

          {/* 
          <p className="text-center text-xs text-muted-foreground mt-8">
            Demo: use{" "}
            <span className="text-foreground font-medium">joao@email.com</span>{" "}
            ou <span className="text-foreground font-medium">123456789</span>
          </p> */}
        </div>
      </motion.div>

      {/* Right side - Image + branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end gap-4"
      >
        <Image
          src="/auth-bg.png"
          alt="Background"
          fill
          className="object-cover rounded-lg"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-auto">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full rounded-3xl border border-primary/30 shadow-2xl"
              >
                <Image
                  src="/images/mockup/app.png"
                  alt="Background"
                  width={500}
                  height={500}
                  className="object-contain rounded-3xl"
                  priority
                />
              </motion.div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-bold dark:text-foreground text-primary mb-2">
              Conectando Serviços,
            </h2>
            <p className="text-xl text-muted-foreground">
              Criando Oportunidades
            </p>
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-8 h-1 rounded-full bg-primary/40" />
              <span className="w-8 h-1 rounded-full bg-primary/40" />
              <span className="w-12 h-1 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
