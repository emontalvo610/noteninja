"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { MDXEditor } from "@mdxeditor/editor"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import MDEditor from "@uiw/react-md-editor"
import axios from "axios"
import rehypeSanitize from "rehype-sanitize"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { ForwardRefEditor } from "../../../components/mdx-editor"

const Editor = dynamic(() => import("../../../components/mdx-editor"), {
  // Make sure we turn SSR off
  ssr: false,
})

const NotePage = ({ params: { id } }: { params: { id: string } }) => {
  const queryClient = useQueryClient()

  const { data: note } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await axios.get(`/api/notes/${id}`)

      return res.data.note
    },
  })

  const { mutate } = useMutation({
    mutationKey: ["updateNote", id],
    mutationFn: async ({ newText }: { newText: string }) => {
      const res = await axios.patch(`/api/notes/${id}`, {
        text: newText,
      })

      await queryClient.refetchQueries({
        queryKey: ["note", id],
      })

      await queryClient.refetchQueries({
        queryKey: ["notes"],
      })

      return res.data.note
    },
  })

  const [text, setText] = useState<string | undefined>()

  useEffect(() => {
    if (note) {
      setText(note.text)
    }
  }, [note])

  return (
    <div className="magicpattern">
      <div className="h-[100vh] relative py-16 px-8 md:py-24 md:px-32 lg:py-36 lg:px-56">
        <section className="flex flex-col">
          <div className="flex flex-col items-start gap-2">
            <Card className="mt-8">
              <Link
                href="/"
                className={buttonVariants({
                  variant: "transparent",
                  className: "mb-4",
                })}
              >
                ← Back
              </Link>

              {note && text ? (
                <>
                  <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    {note.title}
                  </h1>

                  <MDEditor
                    onChange={(e) => setText(e)}
                    value={text}
                    className="mt-8"
                    height={500}
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                  />

                  <Button
                    className="mt-4"
                    onClick={() => {
                      const toastId = toast.loading("Updating note...")

                      mutate(
                        { newText: text },
                        {
                          onSuccess: () => {
                            toast.success("Note updated!", { id: toastId })
                          },
                          onError: () => {
                            toast.error("Failed to update note!", {
                              id: toastId,
                            })
                          },
                        }
                      )
                    }}
                  >
                    Update
                  </Button>

                  {/* <Editor value={text} onChange={(e) => setText(e)} /> */}

                  {/* <ForwardRefEditor
                    markdown={text}
                    onChange={(t) => setText(t)}
                  /> */}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

export default NotePage
