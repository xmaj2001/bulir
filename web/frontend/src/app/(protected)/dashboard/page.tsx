"use client";

import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import ServiceCard from "@/components/services/service-card";
import { useServicesSocket } from "@/hooks/use-services-socket";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchServices } from "@/hooks/use-search-services";

export default function DashboardPage() {
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
  useServicesSocket();
  return (
    <>
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {user?.name || "Usuário"}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar serviços..."
              className="pl-10 h-10 rounded-xl"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
          </Button>
        </div>
      </header>

      {/* Services List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Serviços Recentes</h2>
          <Link
            href="/services"
            className="text-sm font-bold text-primary hover:underline"
          >
            Meus Serviços
          </Link>
        </div>

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
            {debouncedSearch && (
              <Button variant="ghost" onClick={() => setSearch("")}>
                Limpar busca
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service, i) => (
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
    </>
  );
}
