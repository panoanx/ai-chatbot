import { kv } from '@vercel/kv'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const img = (await kv.get(`img:${id}`)) as string
  if (!img) {
    return new Response('Image not found', {
      status: 404
    })
  }

  // Strip out the header information (i.e., 'data:image/png;base64,')
  const base64Data = img.replace(/^data:image\/png;base64,/, '')

  // Convert the base64 string to a buffer
  const imageBuffer = Buffer.from(base64Data, 'base64')
  // TODO: we may should add auth here

  return new Response(imageBuffer, {
    headers: {
      'Content-Type': 'image/png'
    }
  })
}
