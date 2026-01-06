"use client"

import * as React from "react"
import { ChatPromptForm } from "@/components/chat-prompt-form"
import { ChatMessage, type Message } from "@/components/chat-message"
import { Card } from "@/components/ui/card"
import { useEffect } from "react"

const inferMessageType = (content: string): Message["type"] => {
  const trimmed = content.trim()
  if (/\.(png|jpe?g|gif|bmp|svg|webp)$/i.test(trimmed)) return "image"
  if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(trimmed)) return "video"
  if (/[#*\[\]_`]|```|\n/.test(trimmed)) return "text"
  return "text"
}

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const eventSourceRef = React.useRef<EventSource | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()


    console.log(messages)
  }, [messages])

  const handleSendMessage = (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return

    // 关闭上一次流，避免重复监听
    eventSourceRef.current?.close()

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      type: inferMessageType(trimmed),
      timestamp: new Date(),
    }

    const aiMessageId = `${Date.now()}-ai`
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      type: "markdown",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, aiMessage])

    const source = new EventSource(
      `/api/chat/stream?q=${encodeURIComponent(trimmed)}`
    )

    source.onmessage = (event) => {
      try {
        if (event.data === "[DONE]") {
          source.close()
          return
        }

        const payload = JSON.parse(event.data) as {
          id: string
          choices: Array<{
            delta?: { content?: string }
            finish_reason: string | null
          }>
        }

        const delta = payload.choices?.[0]?.delta?.content ?? ""
        if (!delta) return

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: `${msg.content}${delta}` }
              : msg
          )
        )
      } catch (err) {
        console.error("Failed to parse SSE chunk", err)
      }
    }

    source.onerror = () => {
      source.close()
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content:
                  msg.content ||
                  "对话发生错误，请稍后再试或检查服务端日志。",
              }
            : msg
        )
      )
    }

    eventSourceRef.current = source
  }

  useEffect(
    () => () => {
      eventSourceRef.current?.close()
    },
    []
  )

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height)-4rem)] max-w-4xl mx-auto w-full">
      {/* Messages area */}
      <Card className="flex-1 overflow-y-auto mb-4 p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start a conversation by typing a message below</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </Card>

      {/* Prompt form */}
      <div className="sticky bottom-0 pb-4">
        <ChatPromptForm onSubmit={handleSendMessage} />
      </div>
    </div>
  )
}