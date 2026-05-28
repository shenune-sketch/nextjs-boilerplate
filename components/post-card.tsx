import Link from "next/link"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type PostCardProps = {
  post: {
    id: string
    title: string
    content: string
    createdAt: Date
    author: {
      name: string | null
      image: string | null
    }
    _count: {
      comments: number
    }
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getExcerpt(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim()

  if (normalized.length <= 160) {
    return normalized
  }

  return `${normalized.slice(0, 160).trimEnd()}…`
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full transition-all duration-200 group-hover:bg-secondary group-hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-balance">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            By {post.author.name ?? "Anonymous"} · {formatDate(post.createdAt)}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            {getExcerpt(post.content)}
          </p>
        </CardContent>
        <CardFooter className="justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {post._count.comments} comment
            {post._count.comments === 1 ? "" : "s"}
          </span>
          <span className="font-medium text-foreground/80">Read post</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
