// ============================================================
// USER TYPES
// ============================================================
export type UserRole = 'buyer' | 'agent' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
  phone?: string
  bio?: string
  verified: boolean
  created_at: string
  updated_at: string
}

// ============================================================
// PROPERTY TYPES
// ============================================================
export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial'
export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'sold'
export type ListingType = 'sale' | 'rent'

export interface PropertyImage {
  url: string
  public_id: string
  width?: number
  height?: number
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  city: string
  state: string
  country: string
  property_type: PropertyType
  listing_type: ListingType
  bedrooms: number
  bathrooms: number
  area_sqft?: number
  amenities: string[]
  images: PropertyImage[]
  video_url?: string
  agent_id: string
  agent?: User
  status: PropertyStatus
  is_featured: boolean
  views_count: number
  created_at: string
  updated_at: string
}

export interface PropertyFilters {
  location?: string
  property_type?: PropertyType
  listing_type?: ListingType
  min_price?: number
  max_price?: number
  bedrooms?: number
  bathrooms?: number
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
}

// ============================================================
// TRANSACTION TYPES
// ============================================================
export type TransactionStatus = 'pending' | 'held' | 'released' | 'cancelled' | 'refunded'

export interface Transaction {
  id: string
  property_id: string
  property?: Property
  buyer_id: string
  buyer?: User
  seller_id: string
  seller?: User
  amount: number
  paystack_reference?: string
  paystack_transaction_id?: string
  status: TransactionStatus
  notes?: string
  created_at: string
  updated_at: string
}

// ============================================================
// FAVORITE TYPES
// ============================================================
export interface Favorite {
  id: string
  user_id: string
  property_id: string
  property?: Property
  created_at: string
}

// ============================================================
// MESSAGE TYPES
// ============================================================
export interface Message {
  id: string
  sender_id: string
  sender?: User
  receiver_id: string
  receiver?: User
  property_id?: string
  property?: Property
  content: string
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  other_user: User
  property?: Property
  last_message: Message
  unread_count: number
}

// ============================================================
// INQUIRY TYPES
// ============================================================
export interface Inquiry {
  id: string
  property_id: string
  property?: Property
  buyer_id: string
  buyer?: User
  message: string
  status: 'new' | 'replied' | 'closed'
  created_at: string
}

// ============================================================
// FORM TYPES
// ============================================================
export interface PropertyFormData {
  title: string
  description: string
  price: number
  location: string
  city: string
  state: string
  country: string
  property_type: PropertyType
  listing_type: ListingType
  bedrooms: number
  bathrooms: number
  area_sqft?: number
  amenities: string[]
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

// ============================================================
// API RESPONSE TYPES
// ============================================================
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// ============================================================
// DASHBOARD STATS
// ============================================================
export interface AgentStats {
  total_listings: number
  active_listings: number
  sold_properties: number
  pending_listings: number
  total_earnings: number
  pending_earnings: number
  total_inquiries: number
  views_this_month: number
}

export interface BuyerStats {
  saved_properties: number
  active_transactions: number
  completed_purchases: number
  total_spent: number
}

export interface AdminStats {
  total_users: number
  total_agents: number
  total_buyers: number
  total_listings: number
  pending_approvals: number
  total_transactions: number
  total_volume: number
  monthly_revenue: number
}
