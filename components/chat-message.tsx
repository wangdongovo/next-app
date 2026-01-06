import * as React from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

type CodeProps = React.ComponentPropsWithoutRef<"code"> & {
  inline?: boolean
  node?: unknown
}

import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  type?: "text" | "markdown" | "image" | "video"
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

const isImageUrl = (content: string) =>
  /\.(png|jpe?g|gif|bmp|svg|webp)$/i.test(content.trim())

const isVideoUrl = (content: string) =>
  /\.(mp4|webm|ogg|mov|m4v)$/i.test(content.trim())

const resolveMessageType = (message: Message): NonNullable<Message["type"]> => {
  if (message.type) return message.type
  if (isImageUrl(message.content)) return "image"
  if (isVideoUrl(message.content)) return "video"
  return "markdown"
}

const CodeBlock = ({ inline, className, children, ...props }: CodeProps) => {
  const match = /language-(\w+)/.exec(className ?? "")

  if (!inline && match) {
    return (
      <SyntaxHighlighter
        style={oneDark as any}
        language={match[1]}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 12,
          padding: "0.9rem 1rem",
          fontSize: "0.8rem",
        }}
        wrapLongLines
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    )
  }

  return (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8rem]",
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

const markdownComponents: Components = {
  h1: ({ node, ...props }) => {
    void node
    return <h1 className="mb-3 text-xl font-semibold" {...props} />
  },
  h2: ({ node, ...props }) => {
    void node
    return <h2 className="mb-2 mt-4 text-lg font-semibold" {...props} />
  },
  h3: ({ node, ...props }) => {
    void node
    return <h3 className="mb-2 mt-3 text-base font-semibold" {...props} />
  },
  ul: ({ node, ...props }) => {
    void node
    return <ul className="list-disc pl-5 space-y-1" {...props} />
  },
  ol: ({ node, ...props }) => {
    void node
    return <ol className="list-decimal pl-5 space-y-1" {...props} />
  },
  blockquote: ({ node, ...props }) => {
    void node
    return (
      <blockquote
        className="border-l-4 border-border/60 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground"
        {...props}
      />
    )
  },
  code: CodeBlock,
  pre: ({ node, ...props }) => {
    void node
    return (
      <pre
        className="overflow-x-auto rounded-xl bg-muted/60 p-0 text-sm"
        {...props}
      />
    )
  },
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const messageType = resolveMessageType(message)

  return (
    <div
      className={cn(
        "flex gap-4 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      
      
      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[80%]",
          isUser
            ? "bg-muted text-foreground"
            : "bg-card text-foreground"
        )}
      >
        {messageType === "image" ? (
          <img
            src={message.content}
            alt="Shared image"
            className="max-h-80 rounded-xl object-contain"
          />
        ) : messageType === "video" ? (
          <video
            src={message.content}
            controls
            className="max-h-80 w-full rounded-xl"
          />
        ) : (
          <div className="prose prose-sm max-w-none break-words dark:prose-invert prose-pre:p-0 prose-pre:bg-transparent prose-code:text-[0.85em]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ...markdownComponents,
                a: ({ node, ...props }) => {
                  void node
                  return (
                    <a
                      {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                      target="_blank"
                      rel="noreferrer"
                    />
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      
    </div>
  )
}
