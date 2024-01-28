"use client"

import { useChat } from "ai/react"
import { toast } from "sonner"

import { EmptyScreen } from "@/components/chat/empty-screen"
import { ChatList } from "@/components/chat/list"
import { ChatPanel } from "@/components/chat/panel"
import { ChatScrollAnchor } from "@/components/chat/scroll-anchor"

const ChatPage = () => {
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      onResponse(response) {
        if (response.status !== 200) {
          toast.error(response.statusText)
        }
      },
    })

  return (
    <div className="magicpattern">
      <div className="h-[100vh] relative py-16 px-8 md:py-24 md:px-32 lg:py-36 lg:px-56">
        <section className="flex flex-col">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Chat
            </h1>

            <div className={"pb-[200px] pt-4 md:pt-10"}>
              {messages.length ? (
                <>
                  <ChatList messages={messages} />
                  <ChatScrollAnchor trackVisibility={isLoading} />
                </>
              ) : (
                <EmptyScreen setInput={setInput} />
              )}
            </div>
            <ChatPanel
              isLoading={isLoading}
              stop={stop}
              append={append}
              reload={reload}
              messages={messages}
              input={input}
              setInput={setInput}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

export default ChatPage
