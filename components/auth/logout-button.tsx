"use client";

import { useFormStatus } from "react-dom";

import { Button } from "~/components/ui/button";
import { logoutAction } from "~/server/actions/auth";

function LogoutButtonContent() {
  const { pending } = useFormStatus();

  return (
    <Button size="lg" variant="default" disabled={pending} type="submit">
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutButtonContent />
    </form>
  );
}
