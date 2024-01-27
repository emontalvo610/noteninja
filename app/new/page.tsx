"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { MDXEditor } from "@mdxeditor/editor"
import { useMutation, useQuery } from "@tanstack/react-query"
import MDEditor from "@uiw/react-md-editor"
import axios from "axios"
import rehypeSanitize from "rehype-sanitize"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const NewPage = () => {
  const { mutate } = useMutation({
    mutationKey: ["createNote"],
    mutationFn: async ({
      newText,
      newTitle,
    }: {
      newText: string
      newTitle: string
    }) => {
      const res = await axios.post(`/api/notes`, {
        input: newText,
        title: newTitle,
      })

      return res.data.note
    },
  })

  const [text, setText] = useState<string>("")
  const [title, setTitle] = useState<string>("")

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

              <MDEditor
                onChange={(e) => setText(e as string)}
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
                  const toastId = toast.loading("Creating note...")

                  mutate(
                    { newText: text, newTitle: title },
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
