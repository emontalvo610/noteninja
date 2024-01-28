"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MDXEditor } from "@mdxeditor/editor"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import MDEditor from "@uiw/react-md-editor"
import axios from "axios"
import { format } from "date-fns"
import { XIcon } from "lucide-react"
import readingTime from "reading-time"
import rehypeSanitize from "rehype-sanitize"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ForwardRefEditor } from "../../../components/mdx-editor"

const Editor = dynamic(() => import("../../../components/mdx-editor"), {
  // Make sure we turn SSR off
  ssr: false,
})

const NotePage = ({ params: { id } }: { params: { id: string } }) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: note } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const res = await axios.get(`/api/notes/${id}`)

      return res.data.note
    },
  })

  const { mutate: updateNote } = useMutation({
    mutationKey: ["updateNote", id],
    mutationFn: async ({
      newText,
      newTags,
    }: {
      newText: string
      newTags: string[]
    }) => {
      const res = await axios.patch(`/api/notes/${id}`, {
        text: newText,
        title: note.title,
        tags: newTags,
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

  const { mutate: deleteNote } = useMutation({
    mutationKey: ["deleteNote", id],
    mutationFn: async () => {
      const res = await axios.delete(`/api/notes/${id}`)

      await queryClient.refetchQueries({
        queryKey: ["notes"],
      })

      router.push("/")

      return res.data.note
    },
  })

  const [text, setText] = useState<string | undefined>()
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState<string>("")

  useEffect(() => {
    if (note) {
      setText(note.text)
      setTags(note.tags || [])
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

                  <p className="mt-2 text-gray-400">
                    {note.text.length} characters /{" "}
                    {note.text.split(" ").length} words /{" "}
                    {readingTime(note.text).text} / Created at{" "}
                    {format(new Date(note.created_at), "dd MMM yyyy hh:mm a")}
                  </p>

                  <div className="w-[12rem] mt-8">
                    {tags && tags.length > 0 ? (
                      <div className="flex gap-4">
                        {tags.map((tag) => (
                          <div className="flex gap-2">
                            <Badge>{tag}</Badge>
                            <IconButton
                              onClick={() => {
                                setTags(tags.filter((t) => t !== tag))
                              }}
                            >
                              <XIcon />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No tags</p>
                    )}

                    <div className="flex flex-col gap-2 mt-4">
                      <Label className="text-xl font-semibold">New Tag</Label>
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                      />

                      <Button
                        onClick={() => {
                          setTags([...tags, newTag])
                          setNewTag("")
                        }}
                        className="mt-2"
                      >
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  <MDEditor
                    onChange={(e) => setText(e)}
                    value={text}
                    className="mt-8"
                    height={500}
                    preview="edit"
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      className="mt-4"
                      onClick={() => {
                        const toastId = toast.loading("Updating note...")

                        updateNote(
                          { newText: text, newTags: tags },
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

                    <Button
                      className="mt-4"
                      variant="danger"
                      onClick={() => {
                        const toastId = toast.loading("Deleting note...")

                        deleteNote(undefined, {
                          onSuccess: () => {
                            toast.success("Note deleted!", { id: toastId })
                          },
                          onError: () => {
                            toast.error("Failed to delete note!", {
                              id: toastId,
                            })
                          },
                        })
                      }}
                    >
                      Delete
                    </Button>
                  </div>
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
