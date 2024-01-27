import { NextResponse } from "next/server"

import openai from "@/lib/openai"
import { supabaseClient } from "@/lib/supabase"

export const POST = async (req: Request) => {
  const { input } = await req.json()

  if (!input) {
    NextResponse.json({ error: "No input provided" }, { status: 400 })
  }

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
    dimensions: 384,
  })

  const [{ embedding }] = embeddingResponse.data

  const tokens = embeddingResponse.usage.total_tokens

  const { data, error } = await supabaseClient
    .from("notes")
    .upsert({
      text: input,
      embedding,
      tokens,
    })
    .select()
    .limit(1)
    .single()

  return NextResponse.json({ note: data, error })
}
