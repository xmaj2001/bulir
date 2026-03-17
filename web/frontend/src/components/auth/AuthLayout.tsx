"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side: Form */}
      <div className="flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-8 flex items-center gap-2">
            <Image src="/Logo.png" alt="Qcena Logo" width={40} height={40} />
            <span className="text-2xl font-bold tracking-tight text-primary">
              Qcena
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-8">{subtitle}</p>

          {children}
        </motion.div>
      </div>

      {/* Right Side: Visual Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold-dark/50 to-transparent" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: -5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="z-10 relative"
        >
          {/* Mockup or App Illustration */}
          <div className="w-[300px] h-[600px] bg-zinc-900 rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-xl z-20" />
            <div className="p-4 pt-12 text-white flex flex-col gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Image src="/Logo.png" alt="Mini Logo" width={24} height={24} />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-zinc-700/50 rounded" />
                <div className="h-4 w-1/2 bg-zinc-700/50 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="aspect-square bg-zinc-800 rounded-2xl" />
                <div className="aspect-square bg-zinc-800 rounded-2xl" />
                <div className="aspect-square bg-zinc-800 rounded-2xl" />
                <div className="aspect-square bg-zinc-800 rounded-2xl" />
              </div>
            </div>
            {/* Animation overlay */}
            <motion.div
              animate={{ y: [0, -100, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none"
            />
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4"
          >
            <div className="w-full h-2 bg-white/20 rounded mb-2" />
            <div className="w-1/2 h-2 bg-white/20 rounded" />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-16 left-16 z-20 max-w-sm">
          <p className="text-white text-3xl font-bold leading-tight">
            Transforme sua rotina com a Qcena.
          </p>
          <p className="text-white/70 mt-4">
            A plataforma completa para gerenciar seus serviços com agilidade e
            transparência.
          </p>
        </div>
      </div>
    </div>
  );
}
