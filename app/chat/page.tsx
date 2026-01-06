"use client"

import * as React from "react"
import { ChatPromptForm } from "@/components/chat-prompt-form"
import { ChatMessage, type Message } from "@/components/chat-message"
import { Card } from "@/components/ui/card"

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated AI response. In a real application, this would be replaced with an actual API call to your AI service.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

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