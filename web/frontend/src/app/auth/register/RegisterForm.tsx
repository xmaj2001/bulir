"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
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
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* Left side: Immersive Branding */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        <Image
          src="/images/background2.jpg"
          alt="Premium background"
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-background/40" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo / Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="p-2.5 bg-primary/20 backdrop-blur-md rounded-2xl border border-primary/30 group-hover:scale-110 transition-transform">
              <Image src="/Logo.png" alt="Qcena Logo" width={28} height={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Q<span>cena</span>
            </h1>
          </motion.div>

          {/* Hero Content */}
          <div className="max-w-xl space-y-12">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-primary text-xs font-bold uppercase tracking-widest mb-6">
                  <Star className="w-3.5 h-3.5 fill-primary" />
                  Próxima Geração de Conectividade
                </div>
                <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] text-glow-lg">
                  Transforma o teu <br />
                  <span className="text-primary italic">Talento</span> em
                  Impacto
                </h2>
                <p className="text-xl text-muted-foreground mt-6 leading-relaxed max-w-lg">
                  A plataforma definitiva para quem quer oferecer excelência ou
                  reservar os melhores serviços. Tudo num só lugar.
                </p>
              </motion.div>

              {/* USP List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 gap-6 pt-8"
              >
                {[
                  {
                    icon: ShieldCheck,
                    title: "Segurança Total",
                    desc: "Pagamentos protegidos e garantia de serviço.",
                  },
                  {
                    icon: Zap,
                    title: "Rapidez & Eficiência",
                    desc: "Reserva em segundos, sem complicações.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10">
            <p className="text-sm font-medium text-white/50">
              © 2026 Qcena Platform. Qualidade em cada cena.
            </p>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full ${i === 1 ? "w-8 bg-primary" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right side: Form Interface */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative"
      >
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-3 text-center lg:text-left">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
              <Image src="/Logo.png" alt="Qcena Logo" width={32} height={32} />
              <h1 className="text-2xl font-black">Qcena</h1>
            </div>
            <h3 className="text-4xl font-black tracking-tighter">
              Criar Conta
            </h3>
            <p className="text-muted-foreground text-lg italic">
              Junta-te à comunidade e começa a explorar hoje.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <AnimatePresence mode="wait">
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 text-destructive text-sm font-medium flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                    {apiError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Nome Completo
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="name"
                    placeholder="Como devemos chamar-te?"
                    className="bg-muted/30 border-border rounded-2xl h-12 pl-12 transition-all focus:ring-2 focus:ring-primary/20 outline-none hover:bg-muted/50"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-destructive text-[11px] font-bold ml-1"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="identifier"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Email ou NIF
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="email@exemplo.com ou NIF"
                    className="bg-muted/30 border-border rounded-2xl h-12 pl-12 transition-all focus:ring-2 focus:ring-primary/20 outline-none hover:bg-muted/50"
                    {...register("identifier")}
                  />
                </div>
                {errors.identifier && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-destructive text-[11px] font-bold ml-1"
                  >
                    {errors.identifier.message}
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="reg-password"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
                  >
                    Senha
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 chars"
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
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-destructive text-[11px] font-bold ml-1"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
                  >
                    Confirmar
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repita a senha"
                      className="bg-muted/30 border-border rounded-2xl h-12 pl-12 transition-all focus:ring-2 focus:ring-primary/20 outline-none hover:bg-muted/50"
                      {...register("confirmPassword")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-destructive text-[11px] font-bold ml-1"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 text-sm cursor-pointer group">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-border bg-muted/30 text-primary focus:ring-offset-background focus:ring-primary transition-all cursor-pointer"
                    {...register("terms")}
                  />
                  <span className="text-muted-foreground text-xs leading-relaxed group-hover:text-foreground transition-colors">
                    Li e aceito os{" "}
                    <span className="text-primary font-bold hover:underline cursor-pointer">
                      Termos e Condições
                    </span>{" "}
                    bem como a política de privacidade da plataforma Bulir.
                  </span>
                </label>
                {errors.terms && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-destructive text-[11px] font-bold mt-1 ml-7"
                  >
                    {errors.terms.message}
                  </motion.p>
                )}
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
                    Começar Jornada
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-muted-foreground font-medium">
                Já fazes parte?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-black hover:underline underline-offset-4 decoration-2"
                >
                  Entrar na conta
                </Link>
              </p>
            </div>
          </form>

          {/* Background Ambient Light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}
