"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hyperspeed, hyperspeedPresets } from "../reactbits/Hyperspeed";
import ShinyText from "../reactbits/ShinyText";
import TargetCursor from "../reactbits/TargetCursor";
import { useRouter } from "next/navigation";

const textRevealVariants: Variants = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.1,
    },
  }),
};

export function Hero() {
  const router = useRouter();
  return (
    <section className="relative min-h-screen z-20 flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <Hyperspeed effectOptions={hyperspeedPresets.one as any} />
      </div>
      <TargetCursor spinDuration={2} parallaxOn={true} hoverDuration={0.2} />
      {/* Subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Headline with text mask animation */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6"
          style={{ fontFamily: "var(--font-cal-sans), sans-serif" }}
        >
          <span className="overflow-hidden flex flex-col items-center gap-2">
            <motion.span
              className="block  font-light cursor-target"
              variants={textRevealVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <span className="">Q</span>cena
            </motion.span>
            <div className="border-b-2 border-primary w-40"></div>
          </span>
          <span className="block overflow-hidden">
            <ShinyText
              text="Reserva os melhores serviços"
              speed={0.5}
              delay={0.5}
              color="#ff8800"
              shineColor="#ff0000"
              spread={120}
              direction="left"
              yoyo={true}
              pauseOnHover={true}
              disabled={false}
              className="text-5xl cursor-target"
            />
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Conectamos clientes a prestadores de serviços verificados. Pagamentos
          seguros, acompanhamento em tempo real.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button
            size="lg"
            onClick={() => router.push("/auth/login")}
            className="shimmer-btn cursor-target bg-primary text-white hover:bg-primary/80 rounded-full px-8 h-12 text-base font-medium shadow-lg shadow-white/10"
          >
            Faça seu login
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/auth/register")}
            className="rounded-full cursor-target px-8 h-12 text-base font-medium border-primary text-zinc-300 hover:bg-primary hover:text-white hover:border-zinc-700 bg-transparent"
          >
            Faça seu cadastro
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
