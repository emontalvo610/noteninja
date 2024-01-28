import { type UseChatHelpers } from "ai/react"
import { RefreshCwIcon, StopCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Card } from "../ui/card"
import { PromptForm } from "./prompt-form"
import { ButtonScrollToBottom } from "./scroll-bottom-button"

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center mb-4">
          {isLoading ? (
            <Button variant="secondary" onClick={() => stop()}>
              <StopCircleIcon className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button variant="secondary" onClick={() => reload()}>
                <RefreshCwIcon className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <PromptForm
          onSubmit={async (value) => {
            await append({
              id,
              content: value,
              role: "user",
            })
          }}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
