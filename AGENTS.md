<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes. Do not assume you know how this version works. Always check `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Tech stack

We use `bun`, `tailwind`, `shadcn`, `drizzle`, `better-auth`.

## 🧭 Project Conventions (STRICT)

### 1. File Naming

* Use **kebab-case for ALL files**
* Applies to: components, hooks, utils, etc.

Examples:

* ✅ expense-card.ts
* ❌ expenseCard.ts
* ❌ ExpenseCard.ts

---

### 2. Package Management

* ALWAYS use **bun**
* NEVER use npm / yarn / pnpm

Examples:
bun add axios
bun add -d typescript

---

### 3. Shadcn Installation

Use:
bunx --bun shadcn@latest add <component>

Example:
bunx --bun shadcn@latest add button

---

### 4. Post-Task Checklist (MANDATORY)

After EVERY task:

1. Format:
   bun format

2. Lint:
   bun lint

3. Handle lint errors:

* Fix simple issues directly
* If fix requires refactor:

  * STOP
  * Ask for confirmation

4. DO NOT:

* Disable lint rules
* Add hacks / workarounds

---

### 5. UI (STRICT)

* Mobile-first ALWAYS (primary target)

### Mobile

* No horizontal scroll
* Touch-friendly UI
* Smooth performance

### Desktop

* Scale from mobile (no separate design)
* Improve spacing/layout only

### Rules

* Build mobile → enhance with breakpoints
* Avoid fixed sizes

---


### 6. General Rules

* Follow existing patterns strictly
* Do not introduce new patterns without approval
* Keep changes minimal and scoped
