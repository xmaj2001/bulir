"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import Image from "next/image";

export function AppMobile() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, rotate: 5 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative flex justify-center"
    >
      <div className="relative">
        <motion.div
          className="w-72 lg:w-80 drop-shadow-2xl relative z-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/images/mockup/app.png"
            width={500}
            height={500}
            alt="Qcena App"
            className="w-full h-auto rounded-2xl"
          />
        </motion.div>
        <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl -z-10" />
        <motion.div
          className="absolute -right-6 top-20 bg-card p-4 rounded-2xl shadow-xl border border-border z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Shield size={18} className="text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">Pagamento Seguro</p>
              <p className="text-xs text-muted-foreground">100% protegido</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="absolute -left-6 bottom-32 bg-card p-4 rounded-2xl shadow-xl border border-border z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
        >
          <p className="text-sm font-semibold">+150 Serviços</p>
          <p className="text-xs text-success">Disponíveis agora</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
