<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. Do not assume you know how this version works. Always check `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


## Tech stack

We use `bun`, `tailwind`, `shadcn`, `drizzle`, `better-auth`.


## Strict rules to follow

- all file namings (i.e components, utils, hooks everything) - always kebab case
    ✅ expense-card.ts
    ❌ expenseCard.ts
    ❌ ExpenseCard.ts
- always ensure we are using `bun` for installing anything