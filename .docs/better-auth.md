# Better auth setup

Follow the steps to setup the better auth documentation [here](https://better-auth.com/docs/installation) and [here](https://better-auth.com/docs/integrations/next).

## Installation and setup

1. Install the better-auth library - `bun add better-auth`

2. Set the `env` variables

```bash
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
```

3. Create a file under `server/libs/auth.ts` with

```ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { db } from '~/server/db';

export const auth = betterAuth({
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
});
```

4. Create auth client

```ts
import { createAuthClient } from 'better-auth/react';

export const { signIn, signUp, signOut, useSession } = createAuthClient();
```

5. Create proxy

```ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { auth } from '~/server/lib/auth';

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // https://better-auth.com/docs/integrations/next
  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sign-in and sign-up (public auth routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)',
  ],
};
```

6. Create an api route

```ts
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
```

7. Create an auth client

```ts
import { createAuthClient } from 'better-auth/react'; // make sure to import from better-auth/react

export const authClient = createAuthClient({
  // you can pass client configuration here
});
```

8. Add the cookie plugin

```ts
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  //...your config
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});
```

9. Generate the better-auth drizzle schema

```bash
bun x auth@latest generate --config ./server/libs/auth.ts --output ./server/db/schemas.ts
```

10. Create migration and generate tables with seed data

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
bun db:seed
```

or

```bash
bun db:migrate
bun db:seed
```

## Usage

Sign-in example

```ts
'use server';
import { auth } from '@/lib/auth';

const signIn = async () => {
  await auth.api.signInEmail({
    body: {
      email: 'user@email.com',
      password: 'password',
    },
  });
};
```

## Authenticating in Page

```ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if(!session) {
    return <div>Not authenticated</div>;
  }
  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
    </div>
  )
}
```
