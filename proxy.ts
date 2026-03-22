import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSession } from "~/lib/auth/session";

export async function proxy(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};
