import { NextResponse } from "next/server"

import openai from "@/lib/openai"
import { supabaseClient } from "@/lib/supabase"

export const GET = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  const { data, error } = await supabaseClient
    .from("notes")
    .select()
    .eq("id", params.id)
    .limit(1)
    .single()

  return NextResponse.json({ note: data, error })
}

export const PATCH = async (
  req: Request,
  { params: { id } }: { params: { id: string } }
) => {
  const { title, text, tags } = await req.json()

  if (!text) {
    NextResponse.json({ error: "No text provided" }, { status: 400 })
  }

  console.log(text)

  const sanitizedInput = `Title: ${title}\nTags: ${tags.join(
    ", "
  )}\n${text.replace(/\n/g, " ")}`

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: sanitizedInput,
    dimensions: 1536,
  })

  const [{ embedding }] = embeddingResponse.data

  const tokens = embeddingResponse.usage.total_tokens

  const { data, error } = await supabaseClient
    .from("notes")
    .update({ text, embedding, tokens, tags })
    .eq("id", Number(id))
    .select()
    .single()

  return NextResponse.json({ note: data, error, embedding, tokens, text, id })
}

export const DELETE = async (
  _req: Request,
  { params: { id } }: { params: { id: string } }
) => {
  const { data, error } = await supabaseClient
    .from("notes")
    .delete()
    .eq("id", Number(id))
    .select()
    .single()

  return NextResponse.json({ notes: data, error })
}
