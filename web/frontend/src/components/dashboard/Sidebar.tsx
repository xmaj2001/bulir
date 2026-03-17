"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Settings,
  LogOut,
  Briefcase,
  Users,
  Calendar,
  User,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Visão Geral",
      href: "/dashboard",
      icon: BarChart3,
      show: true,
    },
    {
      label: "Meus Serviços",
      href: "/services",
      icon: Briefcase,
    },
    {
      label: "Minhas Reservas",
      href: "/bookings",
      icon: Calendar,
      show: true,
    },
    {
      label: "Pedidos",
      href: "/orders",
      icon: ShoppingCart,
    },
    {
      label: "Perfil",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="w-full md:w-64 border-r border-border p-6 flex flex-col gap-8 bg-card h-full">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Logo.png" alt="Logo" width={32} height={32} />
          <span className="text-xl font-bold tracking-tight">Qcena</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  !isActive && "text-muted-foreground",
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}

        <div className="mt-4 pt-4 border-t border-border">
          <Link href="/settings">
            <Button
              variant={pathname === "/settings" ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                pathname !== "/settings" && "text-muted-foreground",
              )}
            >
              <Settings className="w-4 h-4" /> Configurações
            </Button>
          </Link>
        </div>
      </nav>

      <Button
        variant="outline"
        className="gap-3 text-destructive border-destructive/20 hover:bg-destructive/5"
        onClick={() => signOut()}
      >
        <LogOut className="w-4 h-4" /> Sair
      </Button>
    </aside>
  );
}
