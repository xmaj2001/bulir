import LayoutClient from "@/components/layout/layout-client";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutClient>{children}</LayoutClient>;
}
