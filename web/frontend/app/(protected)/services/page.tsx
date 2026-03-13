"use client";

import { useSession } from "next-auth/react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMyServices } from "@/hooks/use-services";
import ServiceCard from "@/components/services/service-card";

export default function ServicesPage() {
  const { data: session } = useSession();
  const { data: services, isLoading } = useMyServices();

  if (session?.role !== "PROVIDER") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h1 className="text-2xl font-bold">Acesso Restrito</h1>
        <p className="text-muted-foreground">
          Esta página é apenas para prestadores de serviços.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow">
            Meus Serviços
          </h1>
          <p className="text-muted-foreground">
            Gere e visualize os seus serviços listados no Bulir.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar serviços..."
              className="pl-10 h-10 rounded-xl bg-card border-border"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Filter className="w-5 h-5" />
          </Button>
          <Button className="rounded-xl gap-2 h-10 px-6 font-bold shadow-glow hover:shadow-glow-lg transition-all">
            <Plus className="w-5 h-5" /> Novo Serviço
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-[2rem] bg-card/50 animate-pulse border border-border/50"
            />
          ))}
        </div>
      ) : services?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-border rounded-[2rem]">
          <p className="text-muted-foreground mb-4">
            Ainda não tens nenhum serviço criado.
          </p>
          <Button
            variant="outline"
            className="rounded-xl gap-2 font-bold group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:scale-125" />
            Criar meu primeiro serviço
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services?.map((service, i) => (
            <ServiceCard key={i} service={service} i={i} />
          ))}
        </div>
      )}
    </div>
  );
}
