import { NextResponse } from "next/server"

import openai from "@/lib/openai"
import { supabaseClient } from "@/lib/supabase"

export const GET = async () => {
  const { data, error } = await supabaseClient.from("notes").select()

  return NextResponse.json({ notes: data, error })
}

export const POST = async (req: Request) => {
  const { input } = await req.json()

  if (!input) {
    NextResponse.json({ error: "No input provided" }, { status: 400 })
  }

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input.replace(/\n/g, " "),
    dimensions: 1536,
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

export const PATCH = async (req: Request) => {
  const { id, text } = await req.json()

  if (!id || !text) {
    NextResponse.json({ error: "No id or text provided" }, { status: 400 })
  }

  const { data, error } = await supabaseClient
    .from("notes")
    .update({ text })
    .eq("id", id)
    .select()
    .limit(1)
    .single()

  return NextResponse.json({ note: data, error })
}

export const DELETE = async (req: Request) => {
  const { id } = await req.json()

  if (!id) {
    NextResponse.json({ error: "No id provided" }, { status: 400 })
  }

  const { data, error } = await supabaseClient
    .from("notes")
    .delete()
    .eq("id", id)
    .select()
    .limit(1)
    .single()

  return NextResponse.json({ note: data, error })
}
