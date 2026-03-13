import Sidebar from "@/components/dashboard/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
