import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@/lib/supabase/server'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { public_id } = await request.json()
    if (!public_id) {
      return NextResponse.json({ error: 'public_id is required' }, { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(public_id)
    return NextResponse.json({ result })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
