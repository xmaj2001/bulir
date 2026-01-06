"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar collapsible="icon" variant="inset" />
        <SidebarInset className="flex-1">
          <SiteHeader />
          <main className="h-[90vh] overflow-y-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
