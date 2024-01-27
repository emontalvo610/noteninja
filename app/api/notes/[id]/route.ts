import { NextResponse } from "next/server"

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
  { params }: { params: { id: string } }
) => {
  const { text } = await req.json()

  if (!text) {
    NextResponse.json({ error: "No text provided" }, { status: 400 })
  }

  const { data, error } = await supabaseClient
    .from("notes")
    .update({ text })
    .eq("id", params.id)
    .select()
    .limit(1)
    .single()

  return NextResponse.json({ note: data, error })
}

export const DELETE = async (
  _req: Request,
  { params }: { params: { id: string } }
) => {
  const { data, error } = await supabaseClient
    .from("notes")
    .delete()
    .eq("id", params.id)
    .select()
    .limit(1)
    .single()

  return NextResponse.json({ notes: data, error })
}
