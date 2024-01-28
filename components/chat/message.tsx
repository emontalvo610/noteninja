import { Message } from "ai"
import { BotIcon, UserIcon } from "lucide-react"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { cn } from "@/lib/utils"

// import { CodeBlock } from "@/components/ui/codeblock"
// import { IconOpenAI, IconUser } from "@/components/ui/icons"

import { CodeBlock } from "../ui/code-block"
import { MemoizedReactMarkdown } from "./markdown"
import { ChatMessageActions } from "./message-actions"

export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div
      className={cn("group relative mb-4 flex items-start md:-ml-12")}
      {...props}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          message.role === "user"
            ? "bg-background"
            : "bg-primary text-primary-foreground"
        )}
      >
        {message.role === "user" ? <UserIcon /> : <BotIcon />}
      </div>
      <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          remarkPlugins={[remarkGfm, remarkMath, rehypeHighlight]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },

            code(props) {
              const { children, className, node, ...rest } = props
              const match = /language-(\w+)/.exec(className || "")
              return match ? (
                <CodeBlock
                  {...rest}
                  className={cn("mb-2")}
                  snippets={[
                    {
                      code: String(children).replace(/\n$/, ""),
                      label: "",
                      language: match[1],
                    },
                  ]}
                >
                  <CodeBlock.Body />
                </CodeBlock>
              ) : (
                // <p className="mb-2 last:mb-0 text-red-500   ">{children}</p>
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
        <ChatMessageActions message={message} />
      </div>
    </div>
  )
}
