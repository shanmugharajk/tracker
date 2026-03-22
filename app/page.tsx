import { LogoutButton } from "~/components/auth/logout-button";
import { requireSession } from "~/lib/auth/session";

export default async function Page() {
  const session = await requireSession();

  return (
    <div className="flex p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <p>You are logged in as {session.user.name}.</p>
        <LogoutButton />
      </div>
    </div>
  );
}
