import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createClient()

    let query = supabase
      .from('properties')
      .select('*, agent:users!properties_agent_id_fkey(id, name, email, avatar_url)', { count: 'exact' })
      .eq('status', 'approved')

    const location  = searchParams.get('location')
    const type      = searchParams.get('type')
    const listing   = searchParams.get('listing')
    const minPrice  = searchParams.get('min_price')
    const maxPrice  = searchParams.get('max_price')
    const bedrooms  = searchParams.get('bedrooms')
    const sort      = searchParams.get('sort') || 'newest'
    const page      = parseInt(searchParams.get('page') || '1')
    const limit     = parseInt(searchParams.get('limit') || '12')

    if (location)  query = query.or(`city.ilike.%${location}%,state.ilike.%${location}%,location.ilike.%${location}%`)
    if (type)      query = query.eq('property_type', type)
    if (listing)   query = query.eq('listing_type', listing)
    if (minPrice)  query = query.gte('price', Number(minPrice))
    if (maxPrice)  query = query.lte('price', Number(maxPrice))
    if (bedrooms)  query = query.gte('bedrooms', Number(bedrooms))

    switch (sort) {
      case 'price_asc':  query = query.order('price', { ascending: true });  break
      case 'price_desc': query = query.order('price', { ascending: false }); break
      case 'popular':    query = query.order('views_count', { ascending: false }); break
      default:           query = query.order('created_at', { ascending: false })
    }

    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({ data, count, page, limit, total_pages: Math.ceil((count || 0) / limit) })
  } catch (error) {
    console.error('Properties API error:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}
