# Post and Comment Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a simple community board where logged-in users can create posts, view a post list with comment counts, open a post detail page, and create/edit/delete their own comments.

**Architecture:** Keep the feature inside the existing App Router structure. Use Prisma for `Post` and `Comment` persistence, keep auth/session checks on the server, and centralize post/comment queries and mutations in small `lib/*` helpers so pages stay thin. The home page renders a post list; `/posts/new` handles post creation; `/posts/[id]` shows the post detail view and comment workflows.

**Tech Stack:** Next.js 16 · TypeScript strict · App Router · Server Actions · Prisma · Neon Postgres · Auth.js v5 (`next-auth`) · pnpm

---

## File Map

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Add `Post` and `Comment` models plus relations to `User` |
| `lib/current-user.ts` | Resolve the signed-in user to the matching Prisma `User` row |
| `lib/posts.ts` | Post queries and `createPost`, plus home list and detail fetch helpers |
| `lib/comments.ts` | Comment queries and `createComment`, `updateComment`, `deleteComment` helpers |
| `app/page.tsx` | Home page post list with comment counts |
| `app/posts/new/page.tsx` | Post creation page for signed-in users |
| `app/posts/[id]/page.tsx` | Post detail page with comments and comment form |
| `components/post-form.tsx` | Shared form UI for post creation |
| `components/comment-form.tsx` | Shared form UI for creating and editing comments |
| `components/comment-list.tsx` | Comment list and per-comment action rendering |
| `components/post-card.tsx` | Post list item UI with comment count |
| `.env.example` | Keep auth/db variables documented for local setup |

---

### Task 1: Add post and comment tables to Prisma

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add the failing schema change**

Add these models and relations to the Prisma schema:

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments  Comment[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  postId    String
  authorId  String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Also add `posts Post[]` and `comments Comment[]` to `User`.

- [ ] **Step 2: Push the schema to Neon and regenerate Prisma Client**

```bash
pnpm prisma db push
```

Expected: Prisma reports the database is in sync and regenerates the client without errors.

- [ ] **Step 3: Verify the generated client still builds**

```bash
pnpm build
```

Expected: build completes without schema or Prisma client errors.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add post and comment schema"
```

---

### Task 2: Add server-side user resolution and post/comment data helpers

**Files:**
- Create: `lib/current-user.ts`
- Create: `lib/posts.ts`
- Create: `lib/comments.ts`

- [ ] **Step 1: Write the user lookup helper**

Create a helper that resolves the authenticated session to the matching Prisma `User` row:

```ts
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function requireCurrentUser() {
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) redirect("/login")
  return user
}
```

- [ ] **Step 2: Write post helpers**

Create `lib/posts.ts` with these helpers:

```ts
export async function listPosts() {}
export async function getPostById(id: string) {}
export async function createPost(input: { title: string; content: string }) {}
```

`listPosts()` should include comment counts. `getPostById()` should include the author and comments needed by the detail page.

- [ ] **Step 3: Write comment helpers**

Create `lib/comments.ts` with these helpers:

```ts
export async function createComment(input: { postId: string; content: string }) {}
export async function updateComment(input: { commentId: string; content: string }) {}
export async function deleteComment(commentId: string) {}
```

Ownership checks must happen here by matching both `id` and `authorId` for update/delete.

- [ ] **Step 4: Verify the helper layer compiles**

```bash
pnpm build
```

Expected: TypeScript accepts the new helper signatures and imports.

- [ ] **Step 5: Commit**

```bash
git add lib/current-user.ts lib/posts.ts lib/comments.ts
git commit -m "feat: add post and comment data helpers"
```

---

### Task 3: Build the post list and post creation pages

**Files:**
- Modify: `app/page.tsx`
- Create: `app/posts/new/page.tsx`
- Create: `components/post-form.tsx`
- Create: `components/post-card.tsx`

- [ ] **Step 1: Write a failing home-page render check**

Render the home page logic with a seeded post list and confirm the list shows a comment count label such as `3 comments`.

```ts
// Expected behavior:
// - home page shows each post title
// - home page shows comment count
// - logged-in users see a "New post" action
```

- [ ] **Step 2: Update the home page to list posts**

Use `listPosts()` and render each post with title, excerpt, author, created time, and comment count. Empty state should say there are no posts yet.

- [ ] **Step 3: Add the post creation page**

`/posts/new` should show a form with title and content fields. On submit, call `createPost()`, then redirect to the new post detail page.

- [ ] **Step 4: Add the shared post form component**

`components/post-form.tsx` should render the title input, content textarea, submit button, and inline validation message area.

- [ ] **Step 5: Verify the page routes build**

```bash
pnpm build
```

Expected: `/` and `/posts/new` compile successfully, and the new form redirects after submit.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx app/posts/new/page.tsx components/post-form.tsx components/post-card.tsx
git commit -m "feat: add post list and creation pages"
```

---

### Task 4: Build the post detail page and comment workflows

**Files:**
- Create: `app/posts/[id]/page.tsx`
- Create: `components/comment-form.tsx`
- Create: `components/comment-list.tsx`
- Modify: `lib/comments.ts`
- Modify: `lib/posts.ts`

- [ ] **Step 1: Write the failing detail-page behavior**

The detail page should show the post body, a list of comments, and a comment form only for signed-in users.

```ts
// Expected behavior:
// - post title and body render
// - comments render in order
// - current user's comments show edit/delete actions
// - non-authenticated users see a sign-in prompt instead of the form
```

- [ ] **Step 2: Implement the detail page**

`app/posts/[id]/page.tsx` should load the post by id, render `notFound()` when missing, and pass the current-user context into the comment UI.

- [ ] **Step 3: Implement comment create/edit/delete forms**

`components/comment-form.tsx` should be reusable for both create and edit.
`components/comment-list.tsx` should conditionally render edit/delete controls only when the comment author matches the current user.

- [ ] **Step 4: Wire server actions to mutations**

`createComment`, `updateComment`, and `deleteComment` should call the helpers from `lib/comments.ts`, then `revalidatePath()` for the home page and the relevant post detail page.

- [ ] **Step 5: Verify ownership restrictions**

Manually confirm that editing/deleting another user's comment returns a denied action and does not mutate the database.

- [ ] **Step 6: Commit**

```bash
git add app/posts/[id]/page.tsx components/comment-form.tsx components/comment-list.tsx lib/comments.ts lib/posts.ts
git commit -m "feat: add post detail comments"
```

---

### Task 5: Final verification and deploy sanity check

**Files:**
- Modify if needed: `.env.example`

- [ ] **Step 1: Confirm all env docs still match runtime expectations**

Make sure the example env file still documents `DATABASE_URL`, `AUTH_SECRET`, and the Google OAuth variables used by the app.

- [ ] **Step 2: Run the full build**

```bash
pnpm build
```

Expected: build passes with no Prisma, auth, or route errors.

- [ ] **Step 3: Exercise the main user flows manually**

Confirm these flows in the browser:

```text
1. Sign in
2. Create a post
3. See the post in the home list with comment count 0
4. Open the post detail page
5. Add a comment
6. Edit your own comment
7. Delete your own comment
8. Confirm another user's comment cannot be edited or deleted
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: ship posts and comments flow"
```

---

## Self-Review Checklist

- The feature is scoped to one board-like post system and does not drift into tags, nested replies, or moderation.
- The ownership rule is explicit: only the comment author can edit or delete.
- The home page, creation page, and detail page each have one clear job.
- Prisma schema changes come before the UI and mutation wiring that depends on them.
- Build verification is included after each major layer so breakage is caught early.

