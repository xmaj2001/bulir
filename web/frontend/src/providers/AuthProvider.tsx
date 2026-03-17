import { AuthHydrator } from "@/components/auth-hydrator";
import { getMeServer } from "@/lib/api.server";
import type { ApiUser } from "@/lib/api";

export default async function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: ApiUser | null = null;

  const res = await getMeServer();
  console.log("User: ", res);
  if (res && res.success) {
    user = res.data;
  }

  return (
    <>
      <AuthHydrator user={user} />
      {children}
    </>
  );
}
