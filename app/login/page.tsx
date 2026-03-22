import { redirect } from "next/navigation";

import { LoginForm } from "~/app/login/login-form";
import { getSession } from "~/lib/auth/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session) return redirect("/");

  return (
    <div className="flex min-h-full flex-col items-stretch pt-16 px-4 sm:flex-row sm:items-start sm:justify-end sm:px-12 sm:pt-12">
      <LoginForm />
    </div>
  );
}
