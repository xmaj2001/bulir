"use client";
import { CreateFormService } from "@/components/service/create-service";
import { ServiceTable } from "@/components/service/service-table";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Service } from "@/types/service";
import { IconMoneybag } from "@tabler/icons-react";
import { Calendar, Plug, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      direction="right"
    >
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* <SectionCards /> */}
              {/* <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div> */}
              <ServiceTable
                onRowClick={async (service) => {
                  setSelectedService(service);
                  setIsDrawerOpen(true);
                }}
              />
            </div>
          </div>
        </div>

        <CreateFormService
          onClose={() => setIsDialogOpen(false)}
          setLoading={setIsLoading}
        />
        <Button
          variant="hero"
          size="icon"
          onClick={() => setIsDialogOpen(true)}
          className="absolute bottom-10 right-10"
          disabled={isLoading}
        >
          <Plus className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </Dialog>
      <DrawerContent>
        {/* Detalhes do serviço */}
        {selectedService && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/30 mb-6 overflow-y-auto">
            <h4 className="font-semibold text-foreground text-sm">
              Detalhes da Serviço
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Serviço</p>
                <p className="font-medium text-foreground">
                  {selectedService.name}
                </p>
              </div>
              <div className="p-6 rounded-[4px] hover:border-black/25 bg-blue-500/10 border border-blue-500/30 space-y-2">
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className="text-3xl font-bold text-primary transition-all duration-300">
                  {formatCurrency(selectedService.price)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Descrição</p>
                <p className="font-medium text-foreground">
                  {selectedService.description}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">
                  <Calendar className="inline mb-1 mr-1" size={14} />
                  Data
                </p>
                <p className="font-medium text-foreground">
                  {formatDate(selectedService.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">Reservas</p>
                <div className="font-medium text-foreground">
                  <p>
                    Total de reservas: {selectedService.reservations.length}
                  </p>
                  <div className="flex items-center gap-1">
                    Total faturado:{" "}
                    <span className="font-semibold text-green-700">
                      {formatCurrency(
                        selectedService.reservations
                          .filter(
                            (reservation) => reservation.status === "confirmed"
                          )
                          .reduce(
                            (total, reservation) => total + reservation.price,
                            0
                          )
                      )}
                    </span>
                    <IconMoneybag size={20} />
                  </div>
                </div>
                {selectedService.reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`mt-2 p-2 border rounded
                  ${
                    reservation.status === "confirmed"
                      ? "border-green-500 border bg-green-100 "
                      : reservation.status === "pending"
                      ? "border-yellow-500 bg-yellow-100"
                      : "border-red-500 bg-red-100"
                  }
                  `}
                  >
                    <p className="text-sm">
                      <span className="text-muted-foreground">ID Reserva:</span>{" "}
                      {reservation.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Data:</span>{" "}
                      {formatDate(reservation.createdAt)}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Estado:</span>{" "}
                      {reservation.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
