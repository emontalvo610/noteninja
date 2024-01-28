import * as React from "react"
import { useRouter } from "next/navigation"
import { useEnterSubmit } from "@/utils/hooks/use-enter-submit"
import { UseChatHelpers } from "ai/react"
import { PlusIcon, SendIcon } from "lucide-react"
import Textarea from "react-textarea-autosize"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tooltip } from "@/components/ui/tooltip"

import { Card } from "../ui/card"
import { IconButton } from "../ui/icon-button"

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput("")
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <Card className="relative flex max-h-60 w-full grow flex-col overflow-hidden p-0 py-0 px-4 mb-4">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <div className="absolute right-0 top-4 sm:right-4">
          <Tooltip content="Send Message">
            <IconButton type="submit" disabled={isLoading || input === ""}>
              <SendIcon />
              <span className="sr-only">Send message</span>
            </IconButton>
          </Tooltip>
        </div>
      </Card>
    </form>
  )
}
