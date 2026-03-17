"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { signUpEmail, signUpNif } from "@/lib/api";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
    identifier: z
      .string()
      .min(2, "Email ou NIF deve ter pelo menos 2 caracteres"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val, "Deve aceitar os termos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false },
  });

  const [apiError, setApiError] = useState("");

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      setApiError("");

      const isEmail = z.string().email().safeParse(data.identifier).success;

      if (isEmail) {
        await signUpEmail(data.name, data.identifier, data.password);
      } else {
        await signUpNif(data.name, data.identifier, data.password);
      }

      router.push("/auth/login?registered=1");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("409")) {
        setApiError("Este email já está registado. Tente entrar.");
      } else if (msg.includes("422")) {
        setApiError(
          "Dados inválidos. A senha precisa de mín. 8 caracteres, 1 maiúscula, 1 número e 1 caracter especial.",
        );
      } else {
        setApiError("Ocorreu um erro ao criar a conta. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-lg m-2"
      >
        <Image
          src="/auth-bg.png"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2">
            <Image src="/Logo.png" alt="Qcena Logo" width={20} height={20} />
            <h1 className="text-white">
              Q<span>cena</span>
            </h1>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-96">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full bg-linear-to-b from-primary/20 to-transparent rounded-3xl border border-primary/30 backdrop-blur-xl p-8 flex flex-col justify-center items-center gap-6 shadow-2xl"
              >
                <div className="w-16 h-16 bg-primary rounded-2xl animate-pulse" />
                <div className="w-full h-4 bg-zinc-800 rounded-full" />
                <div className="w-2/3 h-4 bg-zinc-800 rounded-full" />
                <div className="w-full h-12 bg-primary/20 rounded-xl mt-4" />
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
          </div>
        </div>
      </motion.div>

      {/* Right side */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto"
      >
        <div className="w-full max-w-md space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-destructive text-sm"
                >
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                className="dark:input-dark h-12"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier">Email ou NIF</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="email@exemplo.com ou 123456789"
                className="dark:input-dark h-12"
                {...register("identifier")}
              />
              {errors.identifier && (
                <p className="text-destructive text-sm">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Senha</Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 caracteres"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                className="dark:input-dark h-12"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-border bg-zinc-900"
                {...register("terms")}
              />
              <span className="text-muted-foreground">
                Aceito os{" "}
                <span className="text-primary cursor-pointer hover:underline">
                  Termos e Condições
                </span>
              </span>
            </label>
            {errors.terms && (
              <p className="text-destructive text-sm">{errors.terms.message}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Criar conta"}
            </Button>

            <div>
              <p className="mt-2 text-muted-foreground">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:underline font-medium"
                >
                  Entrar
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
