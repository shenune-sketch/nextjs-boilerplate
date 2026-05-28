"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type CommentFormState = {
  errorMessage: string | null
  successKey: number
}

export type CommentFormAction = (
  previousState: CommentFormState,
  formData: FormData
) => Promise<CommentFormState>

type CommentFormProps = {
  action: CommentFormAction
  heading: string
  description?: string
  submitLabel: string
  initialContent?: string
  commentId?: string
  placeholder?: string
  onCancel?: () => void
  onSuccess?: () => void
}

const initialState: CommentFormState = {
  errorMessage: null,
  successKey: 0,
}

const fieldClassName =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function CommentForm({
  action,
  heading,
  description,
  submitLabel,
  initialContent = "",
  commentId,
  placeholder = "Write a comment...",
  onCancel,
  onSuccess,
}: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [clientError, setClientError] = useState<string | null>(null)
  const [state, formAction, pending] = useActionState(action, initialState)
  const lastSuccessKeyRef = useRef(0)

  useEffect(() => {
    if (state.successKey === 0 || state.successKey === lastSuccessKeyRef.current) {
      return
    }

    lastSuccessKeyRef.current = state.successKey
    setClientError(null)
    formRef.current?.reset()
    onSuccess?.()
  }, [onSuccess, state.successKey])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const content = String(formData.get("content") ?? "")

    if (!content.trim()) {
      event.preventDefault()
      setClientError("Comment content is required.")
      return
    }

    setClientError(null)
  }

  const errorMessage = clientError ?? state.errorMessage

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {commentId ? <input type="hidden" name="commentId" value={commentId} /> : null}

          <div className="space-y-2">
            <label htmlFor={commentId ? `comment-${commentId}` : "comment"} className="text-sm font-medium">
              Comment
            </label>
            <textarea
              id={commentId ? `comment-${commentId}` : "comment"}
              name="content"
              required
              rows={5}
              defaultValue={initialContent}
              className={`${fieldClassName} min-h-32 resize-y`}
              placeholder={placeholder}
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

          <div className="flex flex-wrap justify-end gap-2">
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel} disabled={pending}>
                Cancel
              </Button>
            ) : null}
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
