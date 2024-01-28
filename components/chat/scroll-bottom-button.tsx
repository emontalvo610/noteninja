"use client"

import * as React from "react"
import { useAtBottom } from "@/utils/hooks/use-at-bottom"
import { ArrowDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { IconButton, IconButtonProps } from "../ui/icon-button"

export function ButtonScrollToBottom({ className, ...props }: IconButtonProps) {
  const isAtBottom = useAtBottom()

  return (
    <IconButton
      className={cn(
        "absolute right-4 top-1 z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2",
        isAtBottom ? "opacity-0" : "opacity-100",
        className
      )}
      onClick={() =>
        window.scrollTo({
          top: document.body.offsetHeight,
          behavior: "smooth",
        })
      }
      {...props}
    >
      <ArrowDownIcon />
      <span className="sr-only">Scroll to bottom</span>
    </IconButton>
  )
}
