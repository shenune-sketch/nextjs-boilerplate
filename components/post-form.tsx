"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>
  errorMessage?: string
  submitLabel?: string
}

const fieldClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {children}
    </Button>
  )
}

export function PostForm({
  action,
  errorMessage,
  submitLabel = "Create post",
}: PostFormProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Write a post</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
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

          {errorMessage ? (
            <p
              className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end">
            <SubmitButton>{submitLabel}</SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
