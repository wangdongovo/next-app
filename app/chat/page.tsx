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

const mockResponses: Array<Pick<Message, "content" | "type">> = [
  {
    content:
      "# 一级标题 H1 示例\n\n" +
      "## 二级标题 H2 示例\n\n" +
      "### 三级标题 H3 示例\n\n" +
      "正文示例，包含 **加粗**、_斜体_、`行内代码` 和 [链接](https://example.com)。\n\n" +
      "> 这是一个引用块，用于测试 blockquote 的样式展示。\n\n" +
      "- 无序列表项 1\n" +
      "- 无序列表项 2\n" +
      "  - 子项 A\n" +
      "  - 子项 B\n\n" +
      "1. 有序列表 1\n" +
      "2. 有序列表 2\n\n" +
      "| 列 1 | 列 2 | 列 3 |\n" +
      "| ---- | ---- | ---- |\n" +
      "| 单元格 A | 单元格 B | 单元格 C |\n" +
      "| 1 | 2 | 3 |\n\n" +
      "下面是一个 TypeScript 代码块：\n\n" +
      "```ts\n" +
      "type User = {\n" +
      "  id: number\n" +
      "  name: string\n" +
      "  tags?: string[]\n" +
      "}\n\n" +
      "const users: User[] = [\n" +
      "  { id: 1, name: 'Alice', tags: ['admin', 'editor'] },\n" +
      "  { id: 2, name: 'Bob' },\n" +
      "]\n\n" +
      "function findUser(id: number): User | undefined {\n" +
      "  return users.find((u) => u.id === id)\n" +
      "}\n\n" +
      "console.log(findUser(1))\n" +
      "```\n\n" +
      "再来一个 JSON 代码块：\n\n" +
      "```json\n" +
      "{\n" +
      '  \"id\": 123,\n' +
      '  \"title\": \"Markdown 测试\",\n' +
      '  \"tags\": [\"demo\", \"markdown\", \"code\"],\n' +
      "  \"nested\": { \"enabled\": true }\n" +
      "}\n" +
      "```",
    type: "markdown",
  },
  {
    content:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=80.jpg",
    type: "image",
  },
  {
    content:
      "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
    type: "video",
  },
  {
    content:
      "```ts\n// 代码块示例\nconst greet = (name: string) => `Hello, ${name}!`\nconsole.log(greet('AI'))\n```",
    type: "markdown",
  },
]

export default function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()


    console.log(messages)
  }, [messages])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      type: inferMessageType(content),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const nextResponse =
        mockResponses[Math.floor(Math.random() * mockResponses.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: nextResponse.content,
        type: nextResponse.type ?? inferMessageType(nextResponse.content),
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