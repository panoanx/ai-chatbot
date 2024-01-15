import { SettingsOptions } from '@/components/settings'
import { kv } from '@vercel/kv'
import { Message, nanoid } from 'ai'
import { HttpsProxyAgent } from 'https-proxy-agent'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: process.env.http_proxy
    ? new HttpsProxyAgent(process.env.http_proxy)
    : undefined
})

export async function imageGenerator(
  userId: string,
  json: any,
  model: string,
  settings: SettingsOptions
) {
  const messages = json.messages as Array<Message>
  // use the last user message as prompt
  const prompt = messages
    .filter(message => message.role === 'user')
    .pop()?.content
  if (!prompt) {
    return new Response('Prompt not found', {
      status: 400
    })
  }
  const imgs = await openai.images.generate({
    model: model,
    prompt: prompt,
    response_format: 'b64_json',
    size: settings.imgSize[model as keyof typeof settings.imgSize] as any
  })

  // const img_urls = imgs.data.map((img: any) => img.b64_json)
  // decode base64 to image data url
  const img_data = imgs.data.map(
    (img: any) => `data:image/png;base64,${img.b64_json}`
  )

  const img_ids = img_data.map((_, i) => nanoid())
  const img_urls = img_ids.map(id => `/api/img/${id}`)

  const sys_msg = {
    role: 'assistant',
    content: 'Image generated by the model.',
    image_urls: img_urls as string[]
  } as Message

  const id = json.id ?? nanoid()
  const createdAt = Date.now()
  const path = `/chat/${id}`
  const payload = {
    id,
    userId,
    createdAt,
    title: json.messages[0].content.substring(0, 100),
    path,
    messages: [...messages, sys_msg]
  }

  try {
    await kv.hset(`chat:${id}`, payload)
    await kv.zadd(`user:chat:${userId}`, {
      score: createdAt,
      member: `chat:${id}`
    })
    await kv.sadd(`chat:${id}:images`, img_ids)
    img_data.forEach(async (b64, i) => {
      await kv.set(`img:${img_ids[i]}`, b64)
    })
  } catch (e) {
    console.log(e)
    return new Response('Error saving chat', {
      status: 500
    })
  }

  const markDownImg =
    img_urls.map(url => `![](${url})`).join('\n') + sys_msg.content
  return new Response(markDownImg)
}
