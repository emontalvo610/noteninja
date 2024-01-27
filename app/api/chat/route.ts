import { NextResponse } from "next/server"

import openai from "@/lib/openai"

export const POST = async (req: Request) => {
  const { messages } = await req.json()

  if (!messages) {
    NextResponse.json({ error: "No messages provided" }, { status: 400 })
  }

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 384,
    input: messages,
  })

  const [{ embedding }] = embeddingResponse.data
}
