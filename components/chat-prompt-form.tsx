"use client"

import * as React from "react"
import { Plus, Mic, ArrowUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatPromptFormProps {
  onSubmit: (message: string) => void
  className?: string
}

export function ChatPromptForm({ onSubmit, className }: ChatPromptFormProps) {
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSubmit(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative rounded-3xl border border-border bg-background shadow-sm",
        className
      )}
    >
      <div className="flex items-end gap-2 p-3">
        {/* Attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 h-10 w-10 rounded-full hover:bg-accent"
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add attachment</span>
        </Button>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          className="min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent px-0 py-2 shadow-none focus-visible:ring-0 text-base"
          rows={1}
        />

        {/* Voice input button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 h-10 w-10 rounded-full hover:bg-accent"
        >
          <Mic className="h-5 w-5" />
          <span className="sr-only">Voice input</span>
        </Button>

        {/* Submit button */}
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim()}
          className="shrink-0 h-10 w-10 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  )
}
