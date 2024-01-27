"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import MDEditor from "@uiw/react-md-editor"
import axios from "axios"
import rehypeSanitize from "rehype-sanitize"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  const [selectedNote, setSelectedNote] = useState<any>(null)

  const { data: notes } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const res = await axios.get("/api/notes")

      return res.data.notes
    },
  })

  console.log(notes)

  return (
    <div className="flex max-w-5xl mx-auto mt-16 gap-8">
      <div className="bg-card rounded-xl py-8 px-8 w-full">
        {selectedNote ? (
          <>
            <Button
              className="mb-4"
              variant="ghost"
              onClick={() => setSelectedNote(null)}
            >
              ← Back
            </Button>

            <h3 className="text-2xl font-semibold">{selectedNote.title}</h3>

            {/* <p className="mt-4">{selectedNote.text}</p> */}
            <MDEditor
              value={selectedNote.text}
              className="mt-8"
              height={500}
              previewOptions={{
                rehypePlugins: [[rehypeSanitize]],
              }}
            />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">Notes</h2>
            {notes ? (
              <ul className="mt-8 gap-2 flex flex-col">
                {notes.map((note: any) => (
                  <li
                    key={note.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedNote(note)}
                  >
                    <h3 className="text-2xl font-semibold">{note.title}</h3>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
