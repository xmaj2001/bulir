"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Clock,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  Component,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useServices from "@/hooks/use-services";
import { Service as ServiceModel } from "@/types/service";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

const categories = [
  "Todos",
  "Beleza",
  "Saúde",
  "Limpeza",
  "Educação",
  "Fitness",
  "Tecnologia",
];

const placeholderImage =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop";

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const { services, isLoading, user } = useServices();
  const router = useRouter();

  const datas = (services as ServiceModel[]) || [];

  const filteredServices = useMemo(
    () =>
      datas.filter((service) => {
        const matchesCategory =
          selectedCategory === "Todos" || service.category === selectedCategory;
        const serviceName = service.name?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        const matchesSearch = serviceName.includes(query);
        return matchesCategory && matchesSearch;
      }),
    [datas, searchQuery, selectedCategory]
  );
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore os <span className="gradient-text">Nossos Serviços</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Descubra prestadores de serviço verificados e faça a sua reserva
              em segundos.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Pesquisar serviços ou prestadores..."
                icon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </Button>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center text-muted-foreground">
              Carregando serviços...
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => {
              const providerName = service.description;
              const categoryLabel = "Serviço";
              const duration = service.createdAt ;
              const priceValue = Number.isFinite(service.price)
                ? service.price
                : 0;
              const imageSrc = service.image ?? placeholderImage;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group glass-card rounded-2xl overflow-hidden hover-lift cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {/* <img
                      src={imageSrc}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    /> */}
                    <div className="w-full h-full group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                        <Component className="w-[50%] h-[50%] text-primary"/>
                    </div>
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" /> */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/90 text-xs font-medium text-foreground">
                      {categoryLabel}
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-primary text-xl font-bold">
                        {formatCurrency(priceValue)}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {providerName}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {/* <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="font-medium text-foreground">
                          {rating}
                        </span>
                        <span>({reviews})</span>
                      </div> */}
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{duration}</span>
                      </div>
                      {/* <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{location}</span>
                      </div> */}
                    </div>

                    {user.role !== "provider" && (
                      <Button
                        variant="hero"
                        size="sm"
                        className="w-full gap-2 group/btn"
                        onClick={() => router.push(`/book/${service.id}`)}
                      >
                        Reservar Agora
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {!isLoading && filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Nenhum serviço encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou a pesquisa.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
