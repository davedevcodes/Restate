import { createClient } from '@/lib/supabase/client'
import { Transaction, Favorite } from '@/types'
import { generateReference } from '@/lib/utils'

const supabase = createClient()

// ============================================================
// TRANSACTIONS
// ============================================================

export async function createTransaction(
  propertyId: string,
  buyerId: string,
  sellerId: string,
  amount: number,
  paystackRef?: string
): Promise<Transaction> {
  const reference = paystackRef || generateReference()

  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      property_id: propertyId,
      buyer_id: buyerId,
      seller_id: sellerId,
      amount,
      paystack_reference: reference,
      status: 'pending',
    }])
    .select()
    .single()

  if (error) throw error
  return data as Transaction
}

export async function getBuyerTransactions(buyerId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      property:properties(id, title, images, location, city, state, price),
      seller:users!transactions_seller_id_fkey(id, name, email, avatar_url)
    `)
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Transaction[]
}

export async function getAgentTransactions(sellerId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      property:properties(id, title, images, location, price),
      buyer:users!transactions_buyer_id_fkey(id, name, email, avatar_url)
    `)
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Transaction[]
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      property:properties(id, title, images, location, price),
      buyer:users!transactions_buyer_id_fkey(id, name, email),
      seller:users!transactions_seller_id_fkey(id, name, email)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Transaction[]
}

export async function updateTransactionStatus(
  id: string,
  status: string,
  notes?: string
): Promise<void> {
  const updates: any = { status }
  if (notes) updates.notes = notes

  const { error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)

  if (error) throw error

  // If released, mark property as sold
  if (status === 'released') {
    const { data: tx } = await supabase
      .from('transactions')
      .select('property_id')
      .eq('id', id)
      .single()

    if (tx) {
      await supabase
        .from('properties')
        .update({ status: 'sold' })
        .eq('id', tx.property_id)
    }
  }
}

// ============================================================
// FAVORITES
// ============================================================

export async function getUserFavorites(userId: string): Promise<Favorite[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      *,
      property:properties(
        id, title, price, location, city, state, 
        property_type, bedrooms, bathrooms, images, status,
        agent:users!properties_agent_id_fkey(id, name)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Favorite[]
}

export async function addFavorite(userId: string, propertyId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, property_id: propertyId }])

  if (error && error.code !== '23505') throw error // Ignore duplicate
}

export async function removeFavorite(userId: string, propertyId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId)

  if (error) throw error
}

export async function checkIsFavorite(userId: string, propertyId: string): Promise<boolean> {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single()

  return !!data
}

// ============================================================
// MESSAGES
// ============================================================

export async function sendMessage(
  senderId: string,
  receiverId: string,
  content: string,
  propertyId?: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert([{
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      property_id: propertyId,
    }])

  if (error) throw error
}

export async function getConversation(userId: string, otherUserId: string, propertyId?: string) {
  let query = supabase
    .from('messages')
    .select('*, sender:users!messages_sender_id_fkey(id, name, avatar_url)')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true })

  if (propertyId) query = query.eq('property_id', propertyId)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getUserConversations(userId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey(id, name, avatar_url),
      receiver:users!messages_receiver_id_fkey(id, name, avatar_url),
      property:properties(id, title, images)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Group by conversation partner
  const conversations: Map<string, any> = new Map()
  data?.forEach((msg) => {
    const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
    const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender
    const key = propertyKey(otherId, msg.property_id)

    if (!conversations.has(key)) {
      conversations.set(key, {
        id: key,
        other_user: otherUser,
        property: msg.property,
        last_message: msg,
        unread_count: msg.receiver_id === userId && !msg.is_read ? 1 : 0,
      })
    } else {
      const conv = conversations.get(key)!
      if (!msg.is_read && msg.receiver_id === userId) conv.unread_count++
    }
  })

  return Array.from(conversations.values())
}

function propertyKey(userId: string, propertyId?: string) {
  return propertyId ? `${userId}_${propertyId}` : userId
}

export async function markMessagesRead(userId: string, senderId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', userId)
    .eq('sender_id', senderId)
    .eq('is_read', false)

  if (error) throw error
}

// ============================================================
// USERS (Admin)
// ============================================================

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUserRole(userId: string, role: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)

  if (error) throw error
}

export async function updateUserProfile(userId: string, updates: any): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}
