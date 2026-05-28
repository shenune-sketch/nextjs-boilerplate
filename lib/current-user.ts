import { redirect } from "next/navigation"
import { db } from "@/lib/db"

export async function getCurrentUser() {
  // Placeholder - auth will be implemented later
  redirect("/login")
}
