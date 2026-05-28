"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PostFormState = {
  message: string
}

type PostFormProps = {
  action: (state: PostFormState, formData: FormData) => Promise<PostFormState>
  submitLabel?: string
}

const fieldClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

const initialState: PostFormState = {
  message: "",
}

export function PostForm({
  action,
  submitLabel = "Create post",
}: PostFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Write a post</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className={fieldClassName}
              placeholder="What do you want to share?"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              className={`${fieldClassName} min-h-40 resize-y`}
              placeholder="Add the details, context, or question for your post."
            />
          </div>

          {state.message ? (
            <p
              className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              aria-live="polite"
            >
              {state.message}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
