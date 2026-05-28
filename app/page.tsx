import Link from "next/link"

import { auth, signOut } from "@/lib/auth"
import { listPosts } from "@/lib/posts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"

export default async function Home() {
  const [session, posts] = await Promise.all([auth(), listPosts()])

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Community board
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                Recent posts
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Browse the latest conversations, see how many comments each post
                has, and jump straight into writing when you&apos;re signed in.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            {session ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Signed in as {session.user?.email}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/posts/new"
                    className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
                  >
                    New post
                  </Link>
                  <form
                    action={async () => {
                      "use server"
                      await signOut({ redirectTo: "/" })
                    }}
                  >
                    <Button type="submit" variant="outline">
                      Sign out
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>

        {posts.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No posts yet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Be the first to share something once you’re signed in.
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  )
}
