"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  emailOrNif: z.string().min(1, "Email ou NIF é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setError("");
      await login(data.emailOrNif, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-900">
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
                className="input-dark h-12"
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
                  className="input-dark h-12 pr-12"
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
                  className="rounded border-border bg-zinc-900"
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

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">
                Ou entre com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl">
              <svg
                className="mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple
            </Button>
          </div> */}

          <p className="text-center text-xs text-muted-foreground mt-8">
            Demo: use{" "}
            <span className="text-foreground font-medium">joao@email.com</span>{" "}
            ou <span className="text-foreground font-medium">123456789</span>
          </p>
        </div>
      </motion.div>

      {/* Right side - Image + branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        <Image
          src="/auth-bg.png"
          alt="Background"
          fill
          className="object-cover"
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
            <h2 className="text-3xl font-bold text-foreground mb-2">
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
