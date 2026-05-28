// Mock data for demonstration
const mockPosts = [
  {
    id: "1",
    title: "Getting started with Next.js",
    content: "Discover how to build amazing applications with Next.js framework. Learn about SSR, static generation, and more.",
    createdAt: new Date(Date.now() - 86400000),
    author: { id: "u1", name: "Alice", image: null },
    _count: { comments: 5 },
  },
  {
    id: "2",
    title: "React hooks best practices",
    content: "Master the art of writing efficient React components using hooks. We'll explore useState, useEffect, and custom hooks.",
    createdAt: new Date(Date.now() - 172800000),
    author: { id: "u2", name: "Bob", image: null },
    _count: { comments: 3 },
  },
  {
    id: "3",
    title: "Web design trends in 2024",
    content: "Explore the latest design trends shaping the web. From minimalism to bold typography, see what's trending.",
    createdAt: new Date(Date.now() - 259200000),
    author: { id: "u3", name: "Charlie", image: null },
    _count: { comments: 8 },
  },
  {
    id: "4",
    title: "TypeScript tips and tricks",
    content: "Become a TypeScript expert with advanced patterns and techniques. Learn about generics, types, and interfaces.",
    createdAt: new Date(Date.now() - 345600000),
    author: { id: "u4", name: "Diana", image: null },
    _count: { comments: 12 },
  },
  {
    id: "5",
    title: "Building scalable APIs",
    content: "Design and implement APIs that scale. We'll cover caching, rate limiting, and best practices.",
    createdAt: new Date(Date.now() - 432000000),
    author: { id: "u5", name: "Eve", image: null },
    _count: { comments: 7 },
  },
  {
    id: "6",
    title: "CSS Grid layout mastery",
    content: "Learn everything about CSS Grid. Create complex layouts with ease using modern CSS features.",
    createdAt: new Date(Date.now() - 518400000),
    author: { id: "u6", name: "Frank", image: null },
    _count: { comments: 4 },
  },
]

export async function listPosts() {
  // Return mock posts instead of querying database
  return mockPosts
}

export async function getPostById(id: string) {
  const post = mockPosts.find(p => p.id === id)
  if (!post) return null
  
  return {
    ...post,
    comments: [
      {
        id: "c1",
        authorId: "u2",
        content: "Great article! Very helpful.",
        createdAt: new Date(),
        author: { id: "u2", name: "Bob", image: null },
      },
    ],
  }
}

export async function createPost(input: { title: string; content: string }) {
  throw new Error("Create post not implemented yet")
}
