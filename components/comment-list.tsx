"use client"

import { useState } from "react"

import { CommentForm, type CommentFormAction } from "@/components/comment-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type CommentListItem = {
  id: string
  content: string
  createdAt: string
  author: {
    name: string | null
    image: string | null
  }
  isOwnComment: boolean
}

type CommentListProps = {
  comments: CommentListItem[]
  updateCommentAction: CommentFormAction
  deleteCommentAction: (formData: FormData) => void | Promise<void>
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

export function CommentList({
  comments,
  updateCommentAction,
  deleteCommentAction,
}: CommentListProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)

  if (!comments.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No comments yet</CardTitle>
          <CardDescription>Be the first to reply to this post.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) =>
        editingCommentId === comment.id ? (
          <CommentForm
            key={comment.id}
            action={updateCommentAction}
            heading="Edit comment"
            description="Update your reply and save the changes."
            submitLabel="Save changes"
            commentId={comment.id}
            initialContent={comment.content}
            placeholder="Update your comment..."
            onCancel={() => setEditingCommentId(null)}
            onSuccess={() => setEditingCommentId(null)}
          />
        ) : (
          <Card key={comment.id}>
            <CardHeader>
              <CardTitle className="text-sm">
                {comment.author.name ?? "Anonymous"}
              </CardTitle>
              <CardDescription>{formatDate(comment.createdAt)}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
                {comment.content}
              </p>
            </CardContent>
            {comment.isOwnComment ? (
              <CardFooter className="justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingCommentId(comment.id)}
                >
                  Edit
                </Button>
                <form action={deleteCommentAction}>
                  <input type="hidden" name="commentId" value={comment.id} />
                  <Button type="submit" variant="destructive" size="sm">
                    Delete
                  </Button>
                </form>
              </CardFooter>
            ) : null}
          </Card>
        )
      )}
    </div>
  )
}
