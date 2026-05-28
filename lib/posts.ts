import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/current-user"

const userPreviewSelect = {
  id: true,
  name: true,
  image: true,
} as const

const postListSelect = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  author: {
    select: userPreviewSelect,
  },
  _count: {
    select: {
      comments: true,
    },
  },
} as const

const postDetailSelect = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  author: {
    select: userPreviewSelect,
  },
  comments: {
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      authorId: true,
      content: true,
      createdAt: true,
      author: {
        select: userPreviewSelect,
      },
    },
  },
} as const

export async function listPosts() {
  return db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: postListSelect,
  })
}

export async function getPostById(id: string) {
  return db.post.findUnique({
    where: {
      id,
    },
    select: postDetailSelect,
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
