'use server'

import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { HttpsProxyAgent } from 'https-proxy-agent'

import { auth } from '@/lib/auth'
import { nanoid } from '@/lib/utils'
import { SettingsOptions } from '@/components/settings'

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: process.env.PROXY_URL
    ? new HttpsProxyAgent(process.env.PROXY_URL)
    : undefined
})

export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken, model, settings } = json
  const { temperature, topP: top_p, jsonMode } = settings as SettingsOptions
  const response_format =
    {} as OpenAI.Chat.Completions.ChatCompletionCreateParams.ResponseFormat

  if (jsonMode === true) {
    messages.unshift({
      role: 'system',
      content: 'Response using strict JSON format.'
    })
    response_format.type = 'json_object'
  }

  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) openai.apiKey = previewToken

  const res = await openai.chat.completions.create({
    stream: true,
    model: model,
    messages,
    temperature: temperature,
    top_p: top_p,
    response_format: response_format
  })

  // TODO: remove this in future
  // @ts-ignore
  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      if (jsonMode === true) {
        messages.shift()
      }
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}
