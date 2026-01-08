'use client';
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedData.split("").forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);
    
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate verification (always succeeds for demo)
    setIsVerified(true);
    setIsLoading(false);
    
    // Redirect after success animation
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  const handleResend = async () => {
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
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
          <div className="glass-card rounded-3xl p-8 shadow-xl">
            {/* Success State */}
            {isVerified ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-success" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Verificado!</h2>
                <p className="text-muted-foreground">A redirecionar para o dashboard...</p>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-glow">
                      <span className="text-primary-foreground font-bold text-2xl">Q</span>
                    </div>
                  </Link>
                  <h1 className="text-2xl font-bold mb-2">Verificar Email</h1>
                  <p className="text-muted-foreground">
                    Insira o código de 6 dígitos enviado para o seu email
                  </p>
                </div>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-background transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                        error ? "border-destructive" : digit ? "border-primary" : "border-input"
                      }`}
                    />
                  ))}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive text-center mb-4"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex justify-center mb-6">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}

                {/* Resend */}
                <div className="text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Reenviar código em{" "}
                      <span className="font-semibold text-foreground">{countdown}s</span>
                    </p>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={handleResend}
                      className="gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reenviar código
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
