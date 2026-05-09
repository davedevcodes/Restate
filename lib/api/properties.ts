import { createClient } from '@/lib/supabase/client'
import { Property, PropertyFilters, PropertyFormData, PaginatedResponse } from '@/types'

const supabase = createClient()

export async function getProperties(
  filters: PropertyFilters = {},
  page = 1,
  limit = 12
): Promise<PaginatedResponse<Property>> {
  let query = supabase
    .from('properties')
    .select('*, agent:users!properties_agent_id_fkey(id, name, email, avatar_url, phone)', { count: 'exact' })
    .eq('status', 'approved')

  if (filters.location) {
    query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%,location.ilike.%${filters.location}%`)
  }
  if (filters.property_type) query = query.eq('property_type', filters.property_type)
  if (filters.listing_type) query = query.eq('listing_type', filters.listing_type)
  if (filters.min_price) query = query.gte('price', filters.min_price)
  if (filters.max_price) query = query.lte('price', filters.max_price)
  if (filters.bedrooms) query = query.gte('bedrooms', filters.bedrooms)
  if (filters.bathrooms) query = query.gte('bathrooms', filters.bathrooms)

  switch (filters.sort) {
    case 'price_asc': query = query.order('price', { ascending: true }); break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'popular': query = query.order('views_count', { ascending: false }); break
    default: query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, count, error } = await query
  if (error) throw error

  return {
    data: data as Property[],
    count: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, agent:users!properties_agent_id_fkey(id, name, email, avatar_url, phone)')
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw error
  return data as Property[]
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*, agent:users!properties_agent_id_fkey(id, name, email, avatar_url, phone, bio)')
    .eq('id', id)
    .single()

  if (error) return null

  // Increment views
  await supabase.rpc('increment_property_views', { property_id: id })

  return data as Property
}

export async function getAgentProperties(agentId: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Property[]
}

export async function createProperty(
  formData: PropertyFormData & { images: any[]; agent_id: string }
): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert([{ ...formData, status: 'pending' }])
    .select()
    .single()

  if (error) throw error
  return data as Property
}

export async function updateProperty(id: string, updates: Partial<PropertyFormData>): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Property
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function updatePropertyStatus(
  id: string,
  status: string,
  isFeatured?: boolean
): Promise<void> {
  const updates: any = { status }
  if (isFeatured !== undefined) updates.is_featured = isFeatured

  const { error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

// Admin: get all properties
export async function getAllProperties(status?: string): Promise<Property[]> {
  let query = supabase
    .from('properties')
    .select('*, agent:users!properties_agent_id_fkey(id, name, email, avatar_url)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) throw error
  return data as Property[]
}
