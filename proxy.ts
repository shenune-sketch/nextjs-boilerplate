// Middleware for Next.js
export async function proxy(request: any) {
  // Pass through all requests
  return undefined
}

export const config = {
  matcher: [],  // Disable middleware temporarily
}
