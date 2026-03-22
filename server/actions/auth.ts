"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth, loginSchema } from "~/lib/auth";
import { getFirstZodError } from "~/lib/form-utils";

export type LoginState = { error: string } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  // Validate input
  const parsedFormData = loginSchema.safeParse(Object.fromEntries(formData));

  if (!parsedFormData.success) {
    return { error: getFirstZodError(parsedFormData.error) };
  }

  // Sign in - auth.api.signInEmail sets cookies automatically via nextCookies() plugin
  try {
    await auth.api.signInEmail({
      body: {
        email: parsedFormData.data.email,
        password: parsedFormData.data.password,
      },
      headers: await headers(),
    });
  } catch (error) {
    console.error("Sign in error:", error);
    return { error: "Invalid email or password" };
  }

  redirect("/");
}

export async function logoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}
