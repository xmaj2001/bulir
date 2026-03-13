import { Suspense } from "react";
import { RegisterForm } from "./com";

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
