"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function TanstackProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  // const { update } = useSession();

  // useEffect(() => {
  //   registerRefreshCallback(async () => {
  //     const session = await update();
  //     console.log("session", session);
  //     return session?.accessToken ?? null;
  //   });
  // }, [update]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
