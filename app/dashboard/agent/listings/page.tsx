'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getAgentProperties, deleteProperty } from '@/lib/api/properties'
import { Property } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AgentListingsPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [deletingId, setDeletingId] = useState<string|null>(null)

  useEffect(() => {
    if (!user) return
    getAgentProperties(user.id).then((d) => { setProperties(d); setLoading(false) })
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    setDeletingId(id)
    try { await deleteProperty(id); setProperties((p) => p.filter((x) => x.id !== id)); toast.success('Listing deleted') }
    catch { toast.error('Failed to delete') }
    finally { setDeletingId(null) }
  }

  const filtered = filter === 'all' ? properties : properties.filter((p) => p.status === filter)
  const counts: Record<string,number> = { all: properties.length, pending: 0, approved: 0, rejected: 0, sold: 0 }
  properties.forEach((p) => { if (counts[p.status] !== undefined) counts[p.status]++ })

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing:'-0.02em' }}>My Listings</h1>
                <p className="text-sm mt-1 text-muted">{properties.length} total properties</p>
              </div>
              <Link href="/dashboard/agent/new-listing" className="btn-primary"><i className="fa-solid fa-plus text-sm" /> Add Listing</Link>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(counts).map(([s, c]) => (
                <button key={s} onClick={() => setFilter(s)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
                  style={filter===s ? { backgroundColor:'var(--brand-500)', color:'#fff' } : { backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-secondary)' }}>
                  {s} ({c})
                </button>
              ))}
            </div>
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--brand-500)', borderTopColor:'transparent' }} /></div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl p-12 text-center shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <i className="fa-solid fa-building-circle-xmark text-4xl mb-4 block text-muted" />
                <h3 className="font-bold font-heading text-primary mb-2">No listings yet</h3>
                <p className="text-sm text-muted mb-6">Start listing your properties to reach buyers across Nigeria.</p>
                <Link href="/dashboard/agent/new-listing" className="btn-primary">Create First Listing</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((property) => (
                  <div key={property.id}
                    className="rounded-2xl p-4 flex items-center gap-4 shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor:'var(--color-surface-2)' }}>
                      {property.images?.[0]?.url
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={property.images[0].url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-house text-muted" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-primary font-heading truncate">{property.title}</h3>
                      <p className="text-sm text-muted mt-0.5">{property.city}, {property.state}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm font-bold" style={{ color:'var(--brand-500)' }}>{formatPrice(property.price)}</p>
                        {property.property_type !== 'land' && <span className="text-xs text-muted"><i className="fa-solid fa-bed mr-1" />{property.bedrooms} · <i className="fa-solid fa-bath mr-1" />{property.bathrooms}</span>}
                        <span className="text-xs text-muted"><i className="fa-solid fa-eye mr-1" />{property.views_count}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right space-y-1.5">
                      <div>
                        <span className={'badge status-' + property.status + ' text-xs'}>{property.status}</span>
                        {property.is_featured && <span className="badge text-xs ml-1" style={{ backgroundColor:'var(--color-warning-bg)', color:'var(--color-warning-text)' }}><i className="fa-solid fa-star mr-1" />Featured</span>}
                      </div>
                      <p className="text-xs text-muted">{formatDate(property.created_at)}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/property/${property.id}`}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors text-muted hover:text-primary"
                        style={{ borderColor:'var(--color-border)' }}>
                        <i className="fa-solid fa-eye text-xs" />
                      </Link>
                      <button onClick={() => handleDelete(property.id)} disabled={deletingId === property.id}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40"
                        style={{ borderColor:'var(--color-danger-bg)', color:'var(--color-danger-text)' }}>
                        <i className="fa-solid fa-trash-can text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
