import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/current-user"

export async function createComment(input: { postId: string; content: string }) {
  const user = await getCurrentUser()
  const content = input.content.trim()

  if (!content) {
    throw new Error("Comment content is required.")
  }

  const post = await db.post.findUnique({
    where: {
      id: input.postId,
    },
    select: {
      id: true,
    },
  })

  if (!post) {
    throw new Error("Post not found.")
  }

  const comment = await db.comment.create({
    data: {
      content,
      postId: input.postId,
      authorId: user.id,
    },
  })

  revalidatePath("/")
  revalidatePath(`/posts/${input.postId}`)

  return comment
}

export async function updateComment(input: { commentId: string; content: string }) {
  const user = await getCurrentUser()
  const content = input.content.trim()

  if (!content) {
    throw new Error("Comment content is required.")
  }

  const comment = await db.comment.findFirst({
    where: {
      id: input.commentId,
      authorId: user.id,
    },
    select: {
      postId: true,
    },
  })

  if (!comment) {
    throw new Error("Comment not found.")
  }

  await db.comment.updateMany({
    where: {
      id: input.commentId,
      authorId: user.id,
    },
    data: {
      content,
    },
  })

  revalidatePath("/")
  revalidatePath(`/posts/${comment.postId}`)

  return comment
}

export async function deleteComment(commentId: string) {
  const user = await getCurrentUser()

  const comment = await db.comment.findFirst({
    where: {
      id: commentId,
      authorId: user.id,
    },
    select: {
      postId: true,
    },
  })

  if (!comment) {
    throw new Error("Comment not found.")
  }

  await db.comment.deleteMany({
    where: {
      id: commentId,
      authorId: user.id,
    },
  })

  revalidatePath("/")
  revalidatePath(`/posts/${comment.postId}`)
}
