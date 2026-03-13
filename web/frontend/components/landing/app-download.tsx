import { motion } from "framer-motion";
import { Download, Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import Stack from "../Stack";

export function AppDownload() {
  return (
    <section id="app" className="py-24 bg-neutral-950 relative">
      {/* Esferas circulares */}
      {/* <div className="absolute inset-0 bg-primary/20 rounded-full top-0 left-1/2 w-[200px] h-[200px]" />
      <div className="absolute inset-0 bg-primary/30 rounded-full top-0 left-0 w-[200px] h-[200px]" /> */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative  justify-center hidden md:flex"
          >
            <div className="relative w-[400px] h-[600px]">
              <Stack
                randomRotation={false}
                sensitivity={200}
                sendToBackOnClick={true}
                cards={[]}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary text-white text-sm border border-primary/20">
              <Smartphone size={14} className="text-white" />
              Disponível em breve
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold leading-tight">
              Leve a <span className="text-primary cursor-target">Qcena</span>{" "}
              no seu bolso
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Contrate serviços, acompanhe transações e gerencie tudo do seu
              smartphone. A app{" "}
              <b className="text-primary cursor-target">Qcena</b> está sendo
              desenvolvida para iOS e Android.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground h-12 px-12 glow-primary cursor-target"
              >
                <Download size={18} /> App Store
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-12 cursor-target"
              >
                <Download size={18} /> Google Play
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { num: "2.5k+", label: "Downloads" },
                { num: "4.8★", label: "Avaliação" },
                { num: "99%", label: "Uptime" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-display font-bold gradient-text">
                    {stat.num}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
