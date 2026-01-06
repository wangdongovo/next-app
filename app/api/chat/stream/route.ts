import { NextRequest } from "next/server"

// SSE stream that mimics OpenAI chat completion chunks with unique ids.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")?.trim() || "讲讲 JS 防抖函数的实现。"

  const encoder = new TextEncoder()

  const markdown = [
    `你问的是：${query}\n\n`,
    "下面是关于 JavaScript 防抖（debounce）函数的简要说明和示例代码。\n\n",
    "当用户频繁触发事件时，防抖可以在一段等待时间内只执行最后一次调用，常用于输入框搜索、窗口缩放等场景。\n\n",
    "实现思路：返回一个包装函数，内部维护定时器；每次触发时清除旧定时器，重新启动新的定时器；到期后执行原函数。\n\n",
    "代码示例：\n\n",
    "```ts\n",
    "type Fn<T extends any[]> = (...args: T) => void\n",
    "function debounce<T extends any[]>(fn: Fn<T>, wait = 300) {\n",
    "  let timer: ReturnType<typeof setTimeout> | null = null\n",
    "  return (...args: T) => {\n",
    "    if (timer) clearTimeout(timer)\n",
    "    timer = setTimeout(() => {\n",
    "      fn(...args)\n",
    "    }, wait)\n",
    "  }\n",
    "}\n",
    "\n",
    "// 使用示例：\n",
    "const logInput = (value: string) => console.log('search:', value)\n",
    "const onInput = debounce(logInput, 400)\n",
    "```\n\n",
    "注意：如果需要立即执行一次（leading）或取消（cancel），可以扩展包装函数以支持这些特性。\n",
  ].join("")

  const tokens = markdown.split(/(\s+)/).filter((t) => t !== "")
  const startedAt = Math.floor(Date.now() / 1000)

  const stream = new ReadableStream({
    start(controller) {
      let i = 0

      const sendChunk = () => {
        if (i >= tokens.length) {
          const donePayload = {
            id: `chatcmpl-${Date.now()}-done`,
            object: "chat.completion.chunk",
            created: startedAt,
            model: "mock-sse",
            choices: [
              {
                index: 0,
                delta: {},
                finish_reason: "stop",
              },
            ],
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(donePayload)}\n\n`)
          )
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
          return
        }

        const chunkContent = tokens[i++]
        const payload = {
          id: `chatcmpl-${Date.now()}-${i}`,
          object: "chat.completion.chunk",
          created: startedAt,
          model: "mock-sse",
          choices: [
            {
              index: 0,
              delta: { content: chunkContent },
              finish_reason: null,
            },
          ],
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
        setTimeout(sendChunk, 80 + Math.random() * 120)
      }

      sendChunk()

      // Cleanup if client disconnects
      return () => controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}

