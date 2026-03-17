"use client";

import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchServices } from "@/hooks/use-search-services";
import ServiceCard from "@/components/services/service-card";
import CreateServiceModal from "@/components/services/create-service-modal";
import { useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { ApiService } from "@/lib/api";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: searchData, isLoading } = useSearchServices({
    query: debouncedSearch,
  });

  const services = searchData?.items;
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow">
            {debouncedSearch ? "Resultados da Busca" : "Todos os Serviços"}
          </h1>
          <p className="text-muted-foreground">
            {debouncedSearch
              ? `Encontramos ${searchData?.meta.total || 0} serviços para "${debouncedSearch}"`
              : "Explore e encontre os melhores profissionais no Bulir."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar serviços..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 w-full rounded-xl bg-card border border-border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Filter className="w-5 h-5" />
          </Button>
          <CreateServiceModal />
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
      ) : !services || services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/30 border border-dashed border-border rounded-[2rem]">
          <p className="text-muted-foreground mb-4">
            {debouncedSearch
              ? "Nenhum serviço encontrado para esta busca."
              : "Ainda não existem serviços disponiveis."}
          </p>
          {!debouncedSearch && (
            <CreateServiceModal>
              <Button
                variant="outline"
                className="rounded-xl gap-2 font-bold group"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:scale-125" />
                Criar meu primeiro serviço
              </Button>
            </CreateServiceModal>
          )}
          {debouncedSearch && (
            <Button variant="ghost" onClick={() => setSearch("")}>
              Limpar busca
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((service: ApiService, i: number) => (
            <ServiceCard
              key={service.id}
              service={service}
              i={i}
              providerId={user?.id || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
