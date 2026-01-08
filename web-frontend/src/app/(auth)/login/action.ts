import { AuthService } from "@/http/auth/auth.service"
import { cookies } from "next/headers";


export const LoginAction = async (email: string, password: string) => {
  const resp = await AuthService.login(email, password);
  if (resp) {
    (await cookies()).set("accessToken", resp.accessToken, {
      httpOnly: true,

    });
    return true;
  }
}