'use server'

import { kv } from '@vercel/kv'
import {
  Message,
  OpenAIStream,
  StreamingTextResponse,
  streamToResponse
} from 'ai'
import OpenAI from 'openai'

import { HttpsProxyAgent } from 'https-proxy-agent'

import { auth } from '@/lib/auth'
import { nanoid } from '@/lib/utils'
import { SettingsOptions } from '@/components/settings'
import {
  ChatCompletionContentPartImage,
  ChatCompletionContentPartText,
  ChatCompletionMessageParam
} from 'openai/resources'
import { imageGenerator } from './img-gen'

// export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: process.env.http_proxy
    ? new HttpsProxyAgent(process.env.http_proxy)
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
  const { messages: _messages, previewToken, model, settings } = json
  const messages: Array<Message> = _messages

  // image generation models
  if (model.includes('dall')) {
    return await imageGenerator(userId, json, model, settings)
  }
  const {
    temperature,
    topP: top_p,
    jsonMode,
    forgetful
  } = settings as SettingsOptions

  const createParams: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
    stream: true,
    model: model,
    messages: structuredClone(
      // deep copy
      messages.map(({ role, content, name, function_call }: Message) => ({
        role,
        content,
        ...(name !== void 0 && { name }),
        ...(function_call !== void 0 && {
          function_call
        })
      }))
    ) as Array<ChatCompletionMessageParam>,
    // messages: messages,
    temperature,
    top_p
  }

  // override the last message if it's a user message and there are images
  // caution: only message sent to the api is modified, not the original one
  // the original one will keep the frontend manner
  for (let i = 0; i < messages.length; i++) {
    if (
      messages[i].role === 'user' &&
      messages[i].image_urls &&
      // @ts-ignore
      messages[i].image_urls.length > 0 &&
      model.includes('vision')
    ) {
      const textContent = {
        type: 'text',
        text: messages[i].content
      } as ChatCompletionContentPartText
      const imageContent = messages[i].image_urls?.map(
        (url: string) =>
          ({
            type: 'image_url',
            image_url: {
              url: url
            }
          } as ChatCompletionContentPartImage)
      )
      createParams.messages[i].content = [textContent, ...(imageContent ?? [])]
    }
  }

  // TODO: temporary fix for the openai api bug
  if (model.includes('vision')) {
    createParams.max_tokens = 4096
  }

  if (previewToken) openai.apiKey = previewToken

  if (forgetful) {
    // keep only the last
    createParams.messages = [createParams.messages.pop()!]
  }

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
