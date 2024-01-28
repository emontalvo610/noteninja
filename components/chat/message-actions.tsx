"use client"

import { useCopyToClipboard } from "@/utils/hooks/use-copy-to-clipboard"
import { type Message } from "ai"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { IconButton } from "../ui/icon-button"

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  return (
    <div
      className={cn(
        "flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0",
        className
      )}
      {...props}
    >
      <IconButton variant="transparent" onClick={onCopy}>
        {isCopied ? <CheckIcon /> : <CopyIcon />}
        <span className="sr-only">Copy message</span>
      </IconButton>
    </div>
  )
}
