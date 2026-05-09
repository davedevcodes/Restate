'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types'
import { formatPrice, cn, getInitials } from '@/lib/utils'
import { addFavorite, removeFavorite } from '@/lib/api/transactions'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

interface PropertyCardProps {
  property: Property
  isFavorited?: boolean
  onFavoriteChange?: (propertyId: string, isFav: boolean) => void
  className?: string
}

export default function PropertyCard({ property, isFavorited = false, onFavoriteChange, className }: PropertyCardProps) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(isFavorited)
  const [loadingFav, setLoadingFav] = useState(false)

  const mainImage = property.images?.[0]?.url
    || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80'

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { toast.error('Please sign in to save properties'); return }
    setLoadingFav(true)
    try {
      if (favorited) {
        await removeFavorite(user.id, property.id)
        setFavorited(false)
        onFavoriteChange?.(property.id, false)
        toast.success('Removed from favorites')
      } else {
        await addFavorite(user.id, property.id)
        setFavorited(true)
        onFavoriteChange?.(property.id, true)
        toast.success('Saved to favorites')
      }
    } catch { toast.error('Something went wrong') }
    finally { setLoadingFav(false) }
  }

  return (
    <div className={cn('group', className)} style={{ transition: 'transform 0.2s ease' }}>
      <Link href={`/property/${property.id}`}>
        <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card-hover" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={mainImage} alt={property.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Status / feature badges */}
            {property.status === 'sold' && (
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-full tracking-wide">SOLD</div>
            )}
            {property.is_featured && property.status !== 'sold' && (
              <div className="absolute top-3 left-3 px-2.5 py-1 text-white text-xs font-bold rounded-full" style={{ backgroundColor: 'var(--brand-500)' }}>
                <i className="fa-solid fa-star mr-1 text-xs" />FEATURED
              </div>
            )}

            {/* Listing type */}
            <div className="absolute top-3 right-12 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold rounded-full capitalize">
              For {property.listing_type}
            </div>

            {/* Favourite */}
            <button
              onClick={handleFavorite}
              disabled={loadingFav}
              className={cn('absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all', favorited ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-500 hover:text-red-500')}
            >
              <i className={cn('text-sm', favorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart')} />
            </button>

            {/* Price overlay */}
            <div className="absolute bottom-3 left-3">
              <p className="text-white font-bold text-lg font-heading leading-tight">{formatPrice(property.price)}</p>
              {property.listing_type === 'rent' && <span className="text-white/70 text-xs">/year</span>}
            </div>

            {/* Image count */}
            {property.images?.length > 1 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 rounded-full">
                <i className="fa-solid fa-images text-white text-xs" />
                <span className="text-white text-xs">{property.images.length}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm leading-snug line-clamp-1 group-hover:text-[var(--brand-500)] transition-colors font-heading text-primary">
                {property.title}
              </h3>
              <span className="shrink-0 text-xs px-2 py-0.5 rounded-full capitalize whitespace-nowrap" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' }}>
                {property.property_type}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              <i className="fa-solid fa-location-dot text-xs shrink-0" style={{ color: 'var(--brand-400)' }} />
              <span className="truncate">{property.city}, {property.state}</span>
            </div>

            {/* Stats */}
            {property.property_type !== 'land' && (
              <div className="flex items-center gap-4 text-xs pt-3" style={{ borderTop: '1px solid var(--color-border-light)', color: 'var(--color-text-secondary)' }}>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-bed text-xs" style={{ color: 'var(--color-text-muted)' }} />
                  <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="fa-solid fa-bath text-xs" style={{ color: 'var(--color-text-muted)' }} />
                  <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                </div>
                {property.area_sqft && (
                  <div className="flex items-center gap-1 ml-auto text-muted">
                    <i className="fa-solid fa-ruler-combined text-xs" />
                    <span>{property.area_sqft.toLocaleString()} sqft</span>
                  </div>
                )}
              </div>
            )}

            {/* Agent */}
            {property.agent && (
              <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }}>
                  {getInitials(property.agent.name)}
                </div>
                <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{property.agent.name}</span>
                <div className="ml-auto flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <i className="fa-solid fa-eye text-xs" />
                  {property.views_count}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
