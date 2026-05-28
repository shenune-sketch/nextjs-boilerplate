import Link from "next/link"
import { notFound } from "next/navigation"

import { CommentForm } from "@/components/comment-form"
import { CommentList, type CommentListItem } from "@/components/comment-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { createComment, deleteComment, updateComment } from "@/lib/comments"
import { db } from "@/lib/db"
import { getPostById } from "@/lib/posts"

type PostDetailPageProps = {
  params: Promise<{ id: string }>
}

type CommentFormState = {
  errorMessage: string | null
  successKey: number
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getFormErrorMessage(error: unknown, allowedMessages: string[]) {
  if (error instanceof Error && allowedMessages.includes(error.message)) {
    return error.message
  }

  return null
}

export default async function PostDetailPage({
  params,
}: PostDetailPageProps) {
  const { id } = await params
  const [post, session] = await Promise.all([getPostById(id), auth()])

  if (!post) {
    notFound()
  }

  const postId = post.id

  const viewer = session?.user?.email
    ? await db.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          id: true,
        },
      })
    : null

  const comments: CommentListItem[] = post.comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: comment.author,
    isOwnComment: viewer?.id === comment.authorId,
  }))

  async function createCommentAction(
    _previousState: CommentFormState,
    formData: FormData
  ): Promise<CommentFormState> {
    "use server"

    const content = String(formData.get("content") ?? "")

    try {
      await createComment({ postId, content })
      return {
        errorMessage: null,
        successKey: _previousState.successKey + 1,
      }
    } catch (error) {
      const errorMessage = getFormErrorMessage(error, [
        "Comment content is required.",
        "Post not found.",
      ])

      if (errorMessage) {
        return {
          errorMessage,
          successKey: 0,
        }
      }

      throw error
    }
  }

  async function updateCommentAction(
    _previousState: CommentFormState,
    formData: FormData
  ): Promise<CommentFormState> {
    "use server"

    const commentId = String(formData.get("commentId") ?? "")
    const content = String(formData.get("content") ?? "")

    try {
      await updateComment({ commentId, content })
      return {
        errorMessage: null,
        successKey: _previousState.successKey + 1,
      }
    } catch (error) {
      const errorMessage = getFormErrorMessage(error, [
        "Comment content is required.",
        "Comment not found.",
      ])

      if (errorMessage) {
        return {
          errorMessage,
          successKey: 0,
        }
      }

      throw error
    }
  }

  async function deleteCommentAction(formData: FormData) {
    "use server"

    const commentId = String(formData.get("commentId") ?? "")

    try {
      await deleteComment(commentId)
    } catch (error) {
      if (error instanceof Error && error.message === "Comment not found.") {
        return
      }

      throw error
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
        <div className="space-y-3">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Back to posts
          </Link>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Post detail
          </p>
          <div className="space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-balance">
              {post.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              By {post.author.name ?? "Anonymous"} · {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {post.content}
            </p>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Comments ({comments.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Keep the conversation going below.
              </p>
            </div>
          </div>

          {viewer ? (
            <CommentForm
              key="new-comment"
              action={createCommentAction}
              heading="Add a comment"
              description="Share your thoughts with the thread."
              submitLabel="Post comment"
              placeholder="Write your comment here..."
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sign in to comment</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Read the discussion, then sign in to add your own comment.
                </p>
                <Link
                  href="/login"
                  className="inline-flex h-8 w-fit items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                >
                  Sign in
                </Link>
              </CardContent>
            </Card>
          )}

          <CommentList
            comments={comments}
            updateCommentAction={updateCommentAction}
            deleteCommentAction={deleteCommentAction}
          />
        </section>
      </section>
    </main>
  )
}
