import { LogoutButton } from "~/components/auth/logout-button";
import { requireSession } from "~/lib/auth/session";

export default async function Page() {
  const session = await requireSession();

  return (
    <div className="flex flex-col gap-4 text-sm leading-loose">
      <p>You are logged in as {session.user.name}</p>

      <LogoutButton />

      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora error,
        exercitationem laborum sed, mollitia officia fuga, recusandae cupiditate
        facere quis dolorem rerum? Quo, eligendi architecto fugiat mollitia
        inventore quos tempora.
      </p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora error,
        exercitationem laborum sed, mollitia officia fuga, recusandae cupiditate
        facere quis dolorem rerum? Quo, eligendi architecto fugiat mollitia
        inventore quos tempora.
      </p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora error,
        exercitationem laborum sed, mollitia officia fuga, recusandae cupiditate
        facere quis dolorem rerum? Quo, eligendi architecto fugiat mollitia
        inventore quos tempora.
      </p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora error,
        exercitationem laborum sed, mollitia officia fuga, recusandae cupiditate
        facere quis dolorem rerum? Quo, eligendi architecto fugiat mollitia
        inventore quos tempora.
      </p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora error,
        exercitationem laborum sed, mollitia officia fuga, recusandae cupiditate
        facere quis dolorem rerum? Quo, eligendi architecto fugiat mollitia
        inventore quos tempora.
      </p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora error,
        exercitationem laborum sed, mollitia officia fuga, recusandae cupiditate
        facere quis dolorem rerum? Quo, eligendi architecto fugiat mollitia
        inventore quos tempora.
      </p>
    </div>
  );
}
