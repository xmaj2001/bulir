"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import ServiceCard from "@/components/services/service-card";
import { useServices } from "@/hooks/use-services";
import { useServicesSocket } from "@/hooks/use-services-socket";
import InfiniteMenu from "@/components/reactbits/InfiniteMenu";
import { serviceToMenuItem } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: services } = useServices();
  useServicesSocket();
  const menuItems = services?.map(serviceToMenuItem) ?? [];
  return (
    <>
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {session?.user?.name || "Usuário"}
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seus projetos e solicitações hoje.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviços..."
              className="pl-10 h-10 rounded-xl"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </Button>
          {session?.role === "PROVIDER" && (
            <Button className="rounded-xl gap-2 h-10 px-6 font-bold">
              <Plus className="w-5 h-5" /> Novo Serviço
            </Button>
          )}
        </div>
      </header>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Serviços Ativos", value: "12", trend: "+2" },
          { label: "Concluídos", value: "48", trend: "+5" },
          { label: "Avaliação Média", value: "4.9", trend: "★" },
          { label: "Receita (Mês)", value: "R$ 4.2k", trend: "+15%" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-6 rounded-[2rem] hover:shadow-xl transition-shadow"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
            <div className="flex items-end justify-between mt-2">
              <span className="text-3xl font-black">{stat.value}</span>
              <span className="text-sm font-bold text-primary">
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div> */}

      {/* Services List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Serviços Recentes</h2>
          <Link
            href="/services"
            className="text-sm font-bold text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {/* <InfiniteMenu items={menuItems} scale={1} /> */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {services?.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              i={i}
              buttonBooking
            />
          ))}
        </div>
      </div>
    </>
  );
}
