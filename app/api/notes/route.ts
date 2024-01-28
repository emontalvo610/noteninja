import { NextResponse } from "next/server"

import openai from "@/lib/openai"
import { supabaseClient } from "@/lib/supabase"

export const GET = async () => {
  const { data, error } = await supabaseClient.from("notes").select()

  return NextResponse.json({ notes: data, error })
}

export const POST = async (req: Request) => {
  const { input, title, tags } = await req.json()

  if (!title) {
    return NextResponse.json({ error: "No title provided" }, { status: 400 })
  }

  if (!input) {
    return NextResponse.json({ error: "No input provided" }, { status: 400 })
  }

  const sanitizedInput = `Title: ${title}\nTags: ${tags.join(
    ", "
  )}\n${input.replace(/\n/g, " ")}`

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: sanitizedInput,
    dimensions: 1536,
  })

  const [{ embedding }] = embeddingResponse.data

  const tokens = embeddingResponse.usage.total_tokens

  const { data, error } = await supabaseClient
    .from("notes")
    .insert({
      title,
      text: input,
      embedding,
      tokens,
      tags,
    })
    .select()
    .limit(1)
    .single()

  return NextResponse.json({ note: data, error })
}
