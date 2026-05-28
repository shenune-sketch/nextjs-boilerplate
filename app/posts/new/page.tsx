import { redirect } from "next/navigation"

import { PostForm } from "@/components/post-form"
import { getCurrentUser } from "@/lib/current-user"
import { createPost } from "@/lib/posts"

type PostFormState = {
  message: string
}

const initialState: PostFormState = {
  message: "",
}

export default async function NewPostPage() {
  await getCurrentUser()

  async function createPostAction(
    _state: PostFormState,
    formData: FormData
  ): Promise<PostFormState> {
    "use server"

    const title = String(formData.get("title") ?? "")
    const content = String(formData.get("content") ?? "")

    try {
      const post = await createPost({ title, content })
      redirect(`/posts/${post.id}`)
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Title is required." ||
          error.message === "Content is required.")
      ) {
        return {
          message: error.message,
        }
      }

      throw error
    }

    return initialState
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            New post
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Start a thread</h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Share a thought, ask a question, or kick off a discussion with the
            community.
          </p>
        </div>

        <PostForm action={createPostAction} />
      </section>
    </main>
  )
}
