# Post and Comment Feature Design

**Date:** 2026-05-28
**Status:** Draft

## Overview

Add a simple community-style posting flow to the existing Next.js app.
Logged-in users can create posts and comments.
Users can edit and delete only their own comments.
The home page becomes a post list with comment counts, and each post has a detail page with the post body and its comments.

## Goals

- Let authenticated users create posts.
- Show post lists on the home page.
- Show comment counts in the list view.
- Show a post detail page with the full post and comments.
- Let authenticated users create comments on post detail pages.
- Let users edit and delete only their own comments.

## Non-Goals

- No anonymous posting.
- No nested replies.
- No reactions, likes, bookmarks, or tags.
- No rich text editor.
- No file uploads.
- No moderation dashboard.
- No post editing or post deletion in the first version.

## User Flow

1. A signed-in user opens the home page and sees a list of posts.
2. Each post row shows title, author, created time, and comment count.
3. The user can open a post detail page.
4. The detail page shows the post body and all comments.
5. The signed-in user can write a new comment.
6. If the comment belongs to the current user, edit and delete actions appear.
7. A user without a session sees sign-in prompts instead of creation forms.

## Data Model

Add two Prisma models.

### `Post`

- `id`
- `title`
- `content`
- `authorId`
- `createdAt`
- `updatedAt`

### `Comment`

- `id`
- `content`
- `postId`
- `authorId`
- `createdAt`
- `updatedAt`

### Relations

- A `User` has many `Post` records.
- A `User` has many `Comment` records.
- A `Post` has many `Comment` records.
- Deleting a post deletes its comments.
- Deleting a user cascades to their posts and comments through the existing adapter relationships.

## Routes

- `/` shows the post list.
- `/posts/new` shows the post creation form for signed-in users.
- `/posts/[id]` shows post detail and comments.
- `/posts/[id]/edit` is not part of the first version.

## UI Structure

### Home Page

- Header with sign-in status.
- Primary button for creating a post when logged in.
- List of posts with:
  - title
  - short excerpt
  - author email or name
  - comment count
  - created timestamp

### Post Detail Page

- Post title
- Author and created timestamp
- Full content
- Comment list
- Comment form for signed-in users
- Edit and delete actions on the current user's comments only

### Create Post Page

- Title input
- Content textarea
- Submit button
- Inline validation errors

## Server Actions

- `createPost`
- `createComment`
- `updateComment`
- `deleteComment`

All actions must:

- require an authenticated session
- validate ownership before edit/delete
- return a friendly error if the session is missing or invalid

## Validation Rules

- Post title is required and trimmed.
- Post content is required and trimmed.
- Comment content is required and trimmed.
- Empty submissions must be rejected before writing to the database.

## Error Handling

- If the user is not signed in, redirect to `/login`.
- If a post is missing, show a not-found state.
- If a user tries to edit or delete another user's comment, deny the action and keep the page stable.
- If Prisma or the database call fails, show a short error message and do not expose internal details.

## Testing Strategy

- Verify post creation stores a row in the database.
- Verify the home page renders post titles and comment counts.
- Verify the post detail page renders comments.
- Verify a user can edit and delete only their own comments.
- Verify unauthenticated users cannot submit create/update/delete actions.

## Implementation Notes

- Follow the current App Router and Server Action style already used in the project.
- Keep data access in `lib` helpers where it can be reused by pages and actions.
- Keep the first version simple and avoid introducing extra abstractions before they are needed.

