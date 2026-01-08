"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Service } from "@/types/service";
import useServices from "@/hooks/use-services";

interface TableRowProps {
  data: Service;
  onClick: (data: Service) => Promise<void>;
}

function TableRowC({ data, onClick }: TableRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TableRow className="hover:cursor-pointer" key={data.id} onClick={() => onClick(data)}>
      <TableCell className="font-medium">
        <span className="text-sm">#{data.id.slice(0, 8).toUpperCase()}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{data.name}</span>
      </TableCell>
      <TableCell>
        <span className="font-semibold">{data.price.toFixed(2)} Kz</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{data.reservations.length || 0}</span>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {formatDate(data.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onClick(data)}
              className="text-destructive"
            >
              Ver
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

interface ServiceTableProps {
  onRowClick: (data: Service) => Promise<void>;
}

export function ServiceTable({ onRowClick }: ServiceTableProps) {
  const { services, refetch, isLoading, isError, error } = useServices();

  const datas = (services as Service[]) || [];
  if (isError) {
    return (
      <Card className="border-destructive/50 mx-8">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-destructive">
              Erro ao carregar reservas
            </p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Tente novamente mais tarde"}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-0.5">
          <CardTitle>Meus Serviços</CardTitle>
          <CardDescription>
            {datas.length === 0
              ? "Nenhum serviço criado"
              : `${datas.length} serviço${datas.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
       
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : datas.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Ainda não tens nenhum serviço criado
            </p>
            <p className="text-xs text-muted-foreground">
              Explora serviços e cria um serviço para começar
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Reservas</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datas.map((service) => (
                  <TableRowC
                    key={service.id}
                    data={service}
                    onClick={() => onRowClick(service)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
