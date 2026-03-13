"use client";

import { motion } from "framer-motion";
import InfiniteMenu from "../reactbits/InfiniteMenu";
import { Button } from "../ui/button";
import { useServices } from "@/hooks/use-services";
import { serviceToMenuItem } from "@/lib/utils";

export function Services() {
  const { data: services } = useServices();

  const sersvices = services?.map(serviceToMenuItem) ?? [];
  return (
    <section id="features" className="py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-instrument-sans)" }}
          >
            Temos serviços para todos os gostos
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Encontre o serviço que você precisa com apenas alguns cliques.
          </p>
        </motion.div>
      </div>
      <div className="w-full h-full hidden md:block">
        <InfiniteMenu items={sersvices} scale={1} />
      </div>
      <div className="w-full h-full block md:hidden">
        <Button className="w-full text-white">Ver todos os serviços</Button>
      </div>
    </section>
  );
}
