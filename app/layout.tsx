// app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Community Board - Share Ideas & Connect",
  description:
    "Join our thriving community platform. Share your thoughts, connect with others, and be part of the conversation.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-clay-canvas scroll-smooth">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
