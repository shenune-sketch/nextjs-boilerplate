import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/current-user"

export async function createComment(input: { postId: string; content: string }) {
  const user = await getCurrentUser()
  const content = input.content.trim()

  if (!content) {
    throw new Error("Comment content is required.")
  }

  const comment = await db.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
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

    return tx.comment.create({
      data: {
        content,
        postId: input.postId,
        authorId: user.id,
      },
    })
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

  const comment = await db.$transaction(async (tx) => {
    const result = await tx.comment.updateMany({
      where: {
        id: input.commentId,
        authorId: user.id,
      },
      data: {
        content,
      },
    })

    if (result.count === 0) {
      throw new Error("Comment not found.")
    }

    const updatedComment = await tx.comment.findUnique({
      where: {
        id: input.commentId,
      },
      select: {
        postId: true,
      },
    })

    if (!updatedComment) {
      throw new Error("Comment not found.")
    }

    return updatedComment
  })

  revalidatePath("/")
  revalidatePath(`/posts/${comment.postId}`)

  return comment
}

export async function deleteComment(commentId: string) {
  const user = await getCurrentUser()

  const comment = await db.$transaction(async (tx) => {
    const existingComment = await tx.comment.findFirst({
      where: {
        id: commentId,
        authorId: user.id,
      },
      select: {
        postId: true,
      },
    })

    if (!existingComment) {
      throw new Error("Comment not found.")
    }

    const result = await tx.comment.deleteMany({
      where: {
        id: commentId,
        authorId: user.id,
      },
    })

    if (result.count === 0) {
      throw new Error("Comment not found.")
    }

    return existingComment
  })

  revalidatePath("/")
  revalidatePath(`/posts/${comment.postId}`)
}
