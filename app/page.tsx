import Link from "next/link"

import { auth } from "@/lib/auth"
import { listPosts } from "@/lib/posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Home() {
  const posts = await listPosts()
  const session = await auth()

  return (
    <main className="min-h-screen bg-clay-canvas">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 border-b border-clay-hairline bg-clay-canvas px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-clay-ink" />
            <span className="text-sm font-semibold text-clay-ink">Community Board</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm text-clay-ink">{session.user?.email}</span>
                <Link
                  href="/posts/new"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-clay-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-clay-ink/80"
                >
                  New post
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-clay-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-clay-ink/80"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-clay-hairline px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-7">
            {/* Left Content */}
            <div className="md:col-span-4 flex flex-col justify-center gap-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-clay-ink/60">
                  Community
                </p>
                <h1 className="text-balance text-5xl font-medium leading-tight text-clay-ink -tracking-[0.025em]">
                  Share your ideas with the world
                </h1>
                <p className="mt-4 max-w-sm text-base leading-relaxed text-clay-ink/70">
                  Connect with our community. Browse recent conversations, share your thoughts, and join the discussion.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {!session ? (
                  <Link
                    href="/login"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-clay-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-clay-ink/80"
                  >
                    Get started
                  </Link>
                ) : (
                  <Link
                    href="/posts/new"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-clay-pink px-6 text-sm font-semibold text-white transition-colors hover:bg-clay-pink/80"
                  >
                    Create post
                  </Link>
                )}
                <button className="inline-flex h-11 items-center justify-center rounded-xl border border-clay-hairline px-6 text-sm font-semibold text-clay-ink transition-colors hover:bg-clay-surface-soft">
                  Learn more
                </button>
              </div>
            </div>

            {/* Right Illustration Card */}
            <div className="md:col-span-3 flex items-center justify-center">
              <div className="aspect-square w-full rounded-3xl bg-gradient-to-br from-clay-lavender/20 to-clay-peach/20 p-8 flex items-center justify-center">
                <div className="relative h-full w-full rounded-2xl bg-clay-surface-card border border-clay-hairline flex flex-col items-center justify-center gap-4">
                  <div className="grid grid-cols-2 gap-3 w-3/4">
                    <div className="h-12 rounded-lg bg-clay-pink/20" />
                    <div className="h-12 rounded-lg bg-clay-teal/20" />
                    <div className="h-12 rounded-lg bg-clay-lavender/20" />
                    <div className="h-12 rounded-lg bg-clay-peach/20" />
                  </div>
                  <p className="text-xs text-clay-ink/50 mt-2">Community platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay-ink/60">
              Recent discussions
            </p>
            <h2 className="mt-2 text-4xl font-medium leading-tight text-clay-ink -tracking-[0.02em]">
              Latest conversations
            </h2>
            <p className="mt-4 max-w-2xl text-base text-clay-ink/70">
              See what&apos;s being discussed in our community. Every post is an opportunity to connect.
            </p>
          </div>

          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 6).map((post, index) => {
                const colors = [
                  "bg-clay-pink",
                  "bg-clay-teal",
                  "bg-clay-lavender",
                  "bg-clay-peach",
                  "bg-clay-ochre",
                  "bg-clay-surface-card",
                ]
                const color = colors[index % colors.length]
                const isLight =
                  color === "bg-clay-lavender" ||
                  color === "bg-clay-peach" ||
                  color === "bg-clay-ochre" ||
                  color === "bg-clay-surface-card"

                return (
                  <div
                    key={post.id}
                    className={`group rounded-3xl p-8 transition-transform hover:scale-105 ${color}`}
                  >
                    <div className={`space-y-4 ${isLight ? "text-clay-ink" : "text-white"}`}>
                      <div className="h-2 w-12 rounded-full bg-current opacity-30" />
                      <h3 className="line-clamp-2 text-xl font-semibold leading-tight">
                        {post.title}
                      </h3>
                      <p className="line-clamp-3 text-sm opacity-90">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <span>•</span>
                        <span>{post._count?.comments || 0} comments</span>
                      </div>
                      <Link
                        href={`/posts/${post.id}`}
                        className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80 ${isLight ? "text-clay-ink" : "text-white"}`}
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <Card className="rounded-2xl border-clay-hairline bg-clay-surface-card">
              <CardHeader>
                <CardTitle className="text-clay-ink">No posts yet</CardTitle>
              </CardHeader>
              <CardContent className="text-clay-ink/70">
                Be the first to share something once you&apos;re signed in.
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-clay-hairline bg-clay-surface-soft px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-medium text-clay-ink -tracking-[0.02em]">
            Join the conversation today
          </h2>
          <p className="mt-4 text-base text-clay-ink/70">
            Share your ideas, connect with others, and become part of our growing community.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {!session ? (
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-clay-ink px-8 text-sm font-semibold text-white transition-colors hover:bg-clay-ink/80"
              >
                Get started free
              </Link>
            ) : (
              <Link
                href="/posts/new"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-clay-pink px-8 text-sm font-semibold text-white transition-colors hover:bg-clay-pink/80"
              >
                Create your post
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-clay-hairline bg-clay-canvas px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay-ink/60">
                Product
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-clay-ink hover:text-clay-ink/70">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-clay-ink hover:text-clay-ink/70">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay-ink/60">
                Resources
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-clay-ink hover:text-clay-ink/70">
                    Docs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-clay-ink hover:text-clay-ink/70">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay-ink/60">
                Company
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-clay-ink hover:text-clay-ink/70">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-clay-ink hover:text-clay-ink/70">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay-ink/60">
                Legal
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link href="#" className="text-sm text-clay-ink hover:text-clay-ink/70">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-clay-ink hover:text-clay-ink/70">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-clay-hairline pt-8 text-center">
            <p className="text-sm text-clay-ink/60">
              © 2024 Community Board. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
