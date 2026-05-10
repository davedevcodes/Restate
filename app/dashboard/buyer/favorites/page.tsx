'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import PropertyCard from '@/components/property/PropertyCard'
import { useAuth } from '@/lib/auth-context'
import { getUserFavorites } from '@/lib/api/transactions'
import { Favorite } from '@/types'

export default function BuyerFavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserFavorites(user.id).then((data) => { setFavorites(data); setLoading(false) })
  }, [user])

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing: '-0.02em' }}>Saved Properties</h1>
                <p className="text-sm mt-1 text-muted">{favorites.length} properties saved</p>
              </div>
              <Link href="/listings" className="btn-secondary text-sm"><i className="fa-solid fa-magnifying-glass text-xs" /> Browse More</Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (<div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border-light)', backgroundColor: 'var(--color-surface)' }}>
                    <div className="aspect-[4/3] shimmer" />
                    <div className="p-4 space-y-2"><div className="h-4 shimmer rounded w-3/4" /><div className="h-3 shimmer rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="rounded-2xl p-16 text-center shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--color-danger-bg)' }}>
                  <i className="fa-regular fa-heart text-3xl" style={{ color: 'var(--color-danger-text)' }} />
                </div>
                <h2 className="text-xl font-bold font-heading text-primary mb-2">No saved properties yet</h2>
                <p className="text-sm text-muted mb-6">Tap the heart icon on any listing to save it here.</p>
                <Link href="/listings" className="btn-primary"><i className="fa-solid fa-building mr-2" />Browse Properties</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => fav.property ? (<PropertyCard key={fav.id} property={fav.property as any} isFavorited
                    onFavoriteChange={(pid, isFav) => { if (!isFav) setFavorites((prev) => prev.filter((f) => f.property_id !== pid)) }}
                  />
                ) : null)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
