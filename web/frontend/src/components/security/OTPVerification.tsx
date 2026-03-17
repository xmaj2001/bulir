"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Loader2 } from "lucide-react";

interface OTPVerificationProps {
  onVerify: (otp: string) => void;
  onCancel: () => void;
}

export default function OTPVerification({
  onVerify,
  onCancel,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInput = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      onVerify(otp.join(""));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center text-center max-w-sm mx-auto p-10 bg-card border border-border rounded-[3rem] shadow-2xl">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
        <ShieldCheck className="w-10 h-10" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Verificação de Segurança</h2>
      <p className="text-muted-foreground text-sm mb-10">
        Enviamos um código de 6 dígitos para o seu e-mail.
      </p>

      <div className="flex gap-2 mb-8">
        {otp.map((digit, i) => (
          <Input
            key={i}
            id={`otp-${i}`}
            className="w-12 h-14 text-center text-2xl font-black rounded-xl border-2 p-0"
            value={digit}
            onChange={(e) => handleInput(i, e.target.value)}
          />
        ))}
      </div>

      <div className="mb-10">
        <p className="text-sm font-bold text-muted-foreground">
          O código expira em:
        </p>
        <span
          className={`text-2xl font-black ${timeLeft < 60 ? "text-destructive" : "text-primary"}`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="w-full space-y-4">
        <Button
          className="w-full h-12 font-bold text-lg"
          disabled={loading}
          onClick={handleVerify}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Verificar e Salvar"
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full font-semibold"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        Não recebeu o código?{" "}
        <button className="text-primary font-bold hover:underline">
          Reenviar
        </button>
      </p>
    </div>
  );
}
