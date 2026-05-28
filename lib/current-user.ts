import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function getCurrentUser() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return user
}
