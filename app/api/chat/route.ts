import { Noto_Serif_Lao } from "next/font/google"
import { NextResponse } from "next/server"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { codeBlock, oneLine } from "common-tags"
import GP3Tokenizer from "gpt3-tokenizer"

import openai from "@/lib/openai"
import { supabaseClient } from "@/lib/supabase"

export const runtime = "edge"

export const GET = async () => {
  const { data, error } = await supabaseClient.from("notes").select()

  return NextResponse.json({ notes: data, error })
}

export const POST = async (req: Request) => {
  const { messages } = await req.json()

  if (!messages) {
    NextResponse.json({ error: "No messages provided" }, { status: 400 })
  }

  console.log(messages.length)

  const query = messages
    .map((message: any) => message.content)
    .join("\n")
    .trim()
  const sanitizedQuery = query.replace(/\n/g, " ")

  console.log(sanitizedQuery)

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 1536,
    input: sanitizedQuery,
  })

  const [{ embedding }] = embeddingResponse.data

  const { error: matchError, data: notes } = await supabaseClient.rpc(
    "match_notes",
    {
      embedding: embedding,
      match_threshold: 0.3,
      match_count: 10,
      min_content_length: 10,
    }
  )

  console.log(notes, matchError)

  const tokenizer = new GP3Tokenizer({ type: "gpt3" })
  let tokenCount = 0
  let contextText = ""

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]
    const content = note.text
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.text.length

    if (tokenCount >= 1500) {
      break
    }

    contextText += `${content.trim()}\n---\n`
  }

  const prompt = codeBlock`
  ${oneLine`
    You are a very good teacher who loves to help people! Given is some context
    from the user's notes, answer the question using only that information,
    outputted in markdown format. Try to use content from the context as much as
    possible but feel free to use your own knowledge as long as it is relevant and
    you are sure it is correct."
  `}

  Context sections:
  ${contextText}

  Question: """
  ${sanitizedQuery}
  """

  Answer as markdown:
`

  const newMessages = messages.slice(0, -1).concat({
    role: "user",
    content: prompt,
  })

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: newMessages,
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)

  //   return NextResponse.json({
  //     embedding,
  //     prompt,
  //     notes,
  //     sanitizedQuery,
  //     response,
  //   })
}
