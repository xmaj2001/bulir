"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MobileMockup() {
  return (
    <div className="relative mx-auto w-[280px] h-[580px] sm:w-[320px] sm:h-[650px]">
      {/* Phone Frame */}
      <div className="absolute inset-0 bg-zinc-900 rounded-[3rem] border-[12px] border-zinc-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-800 rounded-b-2xl z-20" />

        {/* App Content */}
        <div className="h-full bg-background pt-12 p-6 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Image src="/Logo.png" alt="Logo" width={24} height={24} />
              <span className="font-bold text-sm">Qcena</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-accent" />
          </div>

          {/* Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 flex-1"
          >
            <div className="bg-primary/10 p-4 rounded-3xl border border-primary/20">
              <div className="w-1/3 h-2 bg-primary/40 rounded mb-4" />
              <div className="h-8 w-2/3 bg-primary rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="aspect-square bg-muted rounded-2xl flex items-end p-3"
                >
                  <div className="w-full h-2 bg-muted-foreground/20 rounded" />
                </motion.div>
              ))}
            </div>

            <div className="bg-accent/50 p-4 rounded-3xl h-32 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
              >
                <div className="w-6 h-6 bg-primary rounded-full" />
              </motion.div>
            </div>
          </motion.div>

          {/* Tab Bar */}
          <div className="h-16 border-t border-border flex justify-around items-center -mx-6 bg-card">
            <div className="w-6 h-6 bg-primary rounded-full" />
            <div className="w-6 h-6 bg-muted rounded-full" />
            <div className="w-6 h-6 bg-muted rounded-full" />
            <div className="w-6 h-6 bg-muted rounded-full" />
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-gold-dark/10 blur-[100px] rounded-full" />

      {/* Floating UI Elements outside phone */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -right-16 z-20 bg-card p-4 rounded-2xl shadow-2xl border border-border w-40"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-500" />
          <div className="space-y-1">
            <div className="h-2 w-12 bg-muted rounded" />
            <div className="h-2 w-8 bg-muted rounded" />
          </div>
        </div>
        <div className="h-2 w-full bg-primary/20 rounded" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/2 -left-20 z-20 bg-card p-4 rounded-2xl shadow-2xl border border-border w-48"
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Status
          </span>
          <div className="px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-bold rounded-full">
            Ativo
          </div>
        </div>
        <div className="h-3 w-3/4 bg-foreground/10 rounded mb-2" />
        <div className="h-3 w-1/2 bg-foreground/10 rounded" />
      </motion.div>
    </div>
  );
}
