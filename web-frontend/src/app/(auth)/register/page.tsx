"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  User,
  FileText,
  Check,
  X,
} from "lucide-react";
import { AuthService } from "@/http/auth/auth.service";
import { useRouter } from "next/navigation";

// Schema de validação com Zod
const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome muito longo"),
  nif: z
    .string()
    .max(14, "NIF deve ter 9 dígitos")
    .min(9, "NIF deve ter 9 dígitos"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),

  userType: z.enum(["client", "provider"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      nif: "",
      email: "",
      password: "",
      userType: "client",
    },
  });

  const password = form.watch("password");

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const passwordStrengthLabel = useMemo(() => {
    if (passwordStrength <= 1)
      return { label: "Fraca", color: "bg-destructive" };
    if (passwordStrength <= 2)
      return { label: "Razoável", color: "bg-warning" };
    if (passwordStrength <= 3) return { label: "Boa", color: "bg-primary" };
    return { label: "Forte", color: "bg-success" };
  }, [passwordStrength]);

  const passwordRequirements = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Letra minúscula", met: /[a-z]/.test(password) },
    { label: "Letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Número", met: /[0-9]/.test(password) },
    { label: "Carácter especial", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      console.log("Dados do formulário:", data);
      const res = await AuthService.register({
        name: data.name,
        nif: data.nif,
        email: data.email,
        password: data.password,
        role: data.userType,
      });
      if (!res) {
        form.setError("email", {
          message: "Erro ao registrar. Tente novamente.",
        });
        return;
      }
      setIsSuccess(true);
      form.reset();
      console.log("Resposta do servidor:", res);
    } catch (error) {
      console.error("Erro ao registrar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <Form {...form}>
            <div className="glass-card rounded-3xl p-8 shadow-xl">
              {/* Header */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                    <span className="text-primary-foreground font-bold text-2xl">
                      Q
                    </span>
                  </div>
                </Link>
                <h1 className="text-2xl font-bold mb-2">
                  {isSuccess ? "Conta criada com sucesso" : "Criar Conta"}
                </h1>
                <p className="text-muted-foreground">
                  {isSuccess
                    ? "Faça login para continuar a sua experiência."
                    : "Junte-se à Qcena hoje"}
                </p>
              </div>

              {isSuccess ? (
                <div className="space-y-6 text-center">
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-primary">
                    🎉 Cadastro concluído! Agora faça login para começar.
                  </div>
                  <Button
                    type="button"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push("/login")}
                  >
                    Ir para login
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setIsSuccess(false)}
                  >
                    Criar outra conta
                  </Button>
                </div>
              ) : (
                <>
                  {/* User Type Toggle */}
                  <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
                            {[
                              { value: "client", label: "Cliente" },
                              { value: "provider", label: "Prestador" },
                            ].map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => field.onChange(type.value)}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                                  field.value === type.value
                                    ? "bg-background shadow-md text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {type.label}
                              </button>
                            ))}
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Form */}
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="João Silva"
                              icon={<User className="w-5 h-5" />}
                              error={!!form.formState.errors.name}
                              success={
                                !form.formState.errors.name &&
                                field.value.length > 0
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIF</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="123456789"
                              icon={<FileText className="w-5 h-5" />}
                              error={!!form.formState.errors.nif}
                              success={
                                !form.formState.errors.nif &&
                                field.value.length === 9
                              }
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 9);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="seu@email.com"
                              icon={<Mail className="w-5 h-5" />}
                              error={!!form.formState.errors.email}
                              success={
                                !form.formState.errors.email &&
                                field.value.length > 0
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                icon={<Lock className="w-5 h-5" />}
                                error={!!form.formState.errors.password}
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>

                          {/* Password Strength */}
                          {password.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="space-y-2"
                            >
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                      level <= passwordStrength
                                        ? passwordStrengthLabel.color
                                        : "bg-muted"
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Força da senha:
                                </span>
                                <span className="font-medium">
                                  {passwordStrengthLabel.label}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5 text-xs">
                                {passwordRequirements.map((req) => (
                                  <div
                                    key={req.label}
                                    className={`flex items-center gap-1.5 ${
                                      req.met
                                        ? "text-success"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {req.met ? (
                                      <Check className="w-3 h-3" />
                                    ) : (
                                      <X className="w-3 h-3" />
                                    )}
                                    {req.label}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />A criar
                          conta...
                        </>
                      ) : (
                        <>
                          Criar Conta
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Footer */}
                  <div className="mt-8 text-center">
                    <p className="text-muted-foreground text-sm">
                      Já tem uma conta?{" "}
                      <Link
                        href="/login"
                        className="text-primary font-medium hover:underline"
                      >
                        Iniciar Sessão
                      </Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
