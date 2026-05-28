import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/current-user"

const userPreviewSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} as const

export async function listPosts() {
  return db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: userPreviewSelect,
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })
}

export async function getPostById(id: string) {
  return db.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: userPreviewSelect,
      },
      comments: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: {
            select: userPreviewSelect,
          },
        },
      },
    },
  })
}

export async function createPost(input: { title: string; content: string }) {
  const user = await getCurrentUser()
  const title = input.title.trim()
  const content = input.content.trim()

  if (!title) {
    throw new Error("Title is required.")
  }

  if (!content) {
    throw new Error("Content is required.")
  }

  const post = await db.post.create({
    data: {
      title,
      content,
      authorId: user.id,
    },
  })

  revalidatePath("/")
  revalidatePath(`/posts/${post.id}`)

  return post
}
