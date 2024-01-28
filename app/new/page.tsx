"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MDXEditor } from "@mdxeditor/editor"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import MDEditor from "@uiw/react-md-editor"
import axios from "axios"
import { CrossIcon, XIcon } from "lucide-react"
import rehypeSanitize from "rehype-sanitize"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const NewPage = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutate } = useMutation({
    mutationKey: ["createNote"],
    mutationFn: async ({
      newText,
      newTitle,
      newTags,
    }: {
      newText: string
      newTitle: string
      newTags: string[]
    }) => {
      const res = await axios.post(`/api/notes`, {
        input: newText,
        title: newTitle,
        tags: newTags,
      })

      await queryClient.refetchQueries({
        queryKey: ["notes"],
      })

      router.push(`/note/${res.data.note.id}`)

      return res.data.note
    },
  })

  const [text, setText] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState<string>("")

  return (
    <div className="magicpattern">
      <div className="h-[100vh] relative py-16 px-8 md:py-24 md:px-32 lg:py-36 lg:px-56">
        <section className="flex flex-col">
          <div className="flex flex-col items-start gap-2">
            <Card className="mt-8 w-full">
              <Link
                href="/"
                className={buttonVariants({
                  variant: "transparent",
                  className: "mb-4",
                })}
              >
                ← Back
              </Link>

              <div className="flex flex-col gap-2">
                <Label className="text-xl font-semibold">Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="w-[12rem] mt-8">
                {tags.length > 0 ? (
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
                onChange={(e) => setText(e as string)}
                value={text}
                className="mt-8"
                height={500}
                preview="edit"
                previewOptions={{
                  rehypePlugins: [[rehypeSanitize]],
                }}
              />

              <Button
                className="mt-4"
                onClick={() => {
                  const toastId = toast.loading("Creating note...")

                  mutate(
                    { newText: text, newTitle: title, newTags: tags },
                    {
                      onSuccess: () => {
                        toast.success("Note created!", { id: toastId })
                      },
                      onError: () => {
                        toast.error("Failed to create note!", {
                          id: toastId,
                        })
                      },
                    }
                  )
                }}
              >
                Create
              </Button>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

export default NewPage
