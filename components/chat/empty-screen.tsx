import { UseChatHelpers } from "ai/react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Card } from "../ui/card"

const exampleMessages = [
  {
    heading: "Summarise Digital Asset Standard",
    message:
      "What is Digital Asset Standard? What is its relation with Solana? Summarise in about 200 words.",
  },
  {
    heading: "Summarise State Compression?",
    message:
      "What is state compression? What is its relation with Solana? Summarise in about 200 words.",
  },
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, "setInput">) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <Card>
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Noteninja chat
        </h1>

        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="secondary"
              className="h-auto p-0 text-base pr-2"
              onClick={() => setInput(message.message)}
            >
              <ArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
