'use server'

import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

import { HttpsProxyAgent } from 'https-proxy-agent'

import { auth } from '@/lib/auth'
import { nanoid } from '@/lib/utils'
import { SettingsOptions } from '@/components/settings'
import { ChatCompletionContentPartImage } from 'openai/resources'

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: process.env.PROXY_URL
    ? new HttpsProxyAgent(process.env.PROXY_URL)
    : undefined
})

export async function POST(req: Request) {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const json = await req.json()
  const { messages, previewToken, model, settings } = json

  const { temperature, topP: top_p, jsonMode } = settings as SettingsOptions
  const image_urls = json.data?.encoded_image_urls
    ? JSON.parse(json.data.encoded_image_urls)
    : ([] as string[])

  const createParams: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
    stream: true,
    model: model,
    messages: structuredClone(messages), // deep copy!
    temperature,
    top_p
  }

  // override the last message if it's a user message and there are images
  // caution: only message sent to the api is modified, not the original one
  // the original one will keep the frontend manner
  if (messages[messages.length - 1].role === 'user' && image_urls.length > 0) {
    const textContent = {
      type: 'text',
      text: messages[messages.length - 1].content
    }
    const imageContent = image_urls.map(
      (url: string) =>
        ({
          type: 'image_url',
          image_url: {
            url: url
          }
        } as ChatCompletionContentPartImage)
    )
    createParams.messages[messages.length - 1].content = [
      textContent,
      ...imageContent
    ]
    messages[messages.length - 1].image_urls = image_urls
  }

  if (previewToken) openai.apiKey = previewToken

  // TODO: remove this
  // if  '1106' in model
  if (!model.includes('vision') && model.includes('1106') && jsonMode == true) {
    createParams.messages.unshift({
      role: 'system',
      content: 'Response using strict JSON format.'
    })
    createParams.response_format = {
      type: 'json_object'
    } as OpenAI.Chat.Completions.ChatCompletionCreateParams.ResponseFormat
  }

  const res = await openai.chat.completions.create(createParams)

  // TODO: remove this in future
  // @ts-ignore
  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
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
            role: 'assistant',
            content: completion
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
