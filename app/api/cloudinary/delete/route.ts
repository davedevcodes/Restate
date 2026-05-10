import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { public_id } = await request.json()
    if (!public_id) {
      return NextResponse.json({ error: 'public_id is required' }, { status: 400 })
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey    = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    // Use Cloudinary REST API directly — no npm package needed
    const timestamp = Math.floor(Date.now() / 1000)
    const str = `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`

    // Generate SHA-1 signature using Web Crypto API
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const signature = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    const body = new URLSearchParams({
      public_id,
      signature,
      api_key: apiKey,
      timestamp: String(timestamp),
    })

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: 'POST', body }
    )

    const result = await response.json()
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
