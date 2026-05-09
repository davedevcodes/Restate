'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getAllProperties, updatePropertyStatus, deleteProperty } from '@/lib/api/properties'
import { Property } from '@/types'
import { formatPrice, formatDate, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminListingsPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string|null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    getAllProperties().then((d) => { setProperties(d); setLoading(false) })
  }, [user])

  const handleStatus = async (id: string, status: string) => {
    setProcessingId(id)
    try { await updatePropertyStatus(id, status); setProperties((p) => p.map((x) => x.id===id ? {...x, status: status as any} : x)); toast.success(`Marked as ${status}`) }
    catch { toast.error('Failed') } finally { setProcessingId(null) }
  }

  const handleToggleFeatured = async (property: Property) => {
    setProcessingId(property.id)
    try { await updatePropertyStatus(property.id, property.status, !property.is_featured); setProperties((p) => p.map((x) => x.id===property.id ? {...x, is_featured:!x.is_featured} : x)); toast.success(property.is_featured ? 'Removed from featured' : 'Added to featured') }
    catch { toast.error('Failed') } finally { setProcessingId(null) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this listing?')) return
    setProcessingId(id)
    try { await deleteProperty(id); setProperties((p) => p.filter((x) => x.id!==id)); toast.success('Deleted') }
    catch { toast.error('Failed') } finally { setProcessingId(null) }
  }

  const counts: Record<string,number> = { all:properties.length, pending:0, approved:0, rejected:0, sold:0 }
  properties.forEach((p) => { if (counts[p.status]!==undefined) counts[p.status]++ })

  const filtered = properties
    .filter((p) => filter==='all' || p.status===filter)
    .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing:'-0.02em' }}>All Listings</h1>
              <p className="text-sm mt-1 text-muted">{properties.length} total properties on the platform</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted" />
                <input type="text" placeholder="Search listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-base pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(counts).map(([s,c]) => (
                  <button key={s} onClick={() => setFilter(s)}
                    className="px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all"
                    style={filter===s ? { backgroundColor:'var(--brand-500)', color:'#fff' } : { backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-secondary)' }}>
                    {s} ({c})
                  </button>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--brand-500)', borderTopColor:'transparent' }} /></div>
            ) : (
              <div className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom:'1px solid var(--color-border-light)', backgroundColor:'var(--color-surface-2)' }}>
                      <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">Property</th>
                      <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted hidden sm:table-cell">Agent</th>
                      <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted hidden lg:table-cell">Price</th>
                      <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((property) => (<tr key={property.id} className="transition-colors hover-surface" style={{ borderBottom:'1px solid var(--color-border-light)' }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor:'var(--color-surface-2)' }}>
                              {property.images?.[0]?.url
                                // eslint-disable-next-line @next/next/no-img-element
                                ? <img src={property.images[0].url} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-house text-xs text-muted" /></div>}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate max-w-xs text-primary font-heading">{property.title}</p>
                              <p className="text-xs text-muted">{property.city}, {property.state}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {(property.agent as any)?.name
                            ? <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor:'var(--brand-100)', color:'var(--brand-700)' }}>{getInitials((property.agent as any).name)}</div>
                                <span className="text-xs text-secondary">{(property.agent as any).name}</span>
                              </div>
                            : <span className="text-xs text-muted">—</span>}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-sm font-bold text-primary">{formatPrice(property.price)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={'badge status-' + property.status + ' text-xs'}>{property.status}</span>
                            {property.is_featured && <span className="badge text-xs" style={{ backgroundColor:'var(--color-warning-bg)', color:'var(--color-warning-text)' }}><i className="fa-solid fa-star mr-1" />Featured</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/property/${property.id}`} target="_blank" className="w-7 h-7 rounded-lg border flex items-center justify-center text-muted transition-colors" style={{ borderColor:'var(--color-border)' }}>
                              <i className="fa-solid fa-eye text-xs" />
                            </Link>
                            <button onClick={() => handleToggleFeatured(property)} disabled={!!processingId || property.status!=='approved'}
                              className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40 text-xs"
                              style={{ borderColor: property.is_featured ? 'var(--color-warning-text)' : 'var(--color-border)', color: property.is_featured ? 'var(--color-warning-text)' : 'var(--color-text-muted)', backgroundColor: property.is_featured ? 'var(--color-warning-bg)' : '' }}>
                              <i className="fa-solid fa-star" />
                            </button>
                            {property.status==='pending' && (
                              <button onClick={() => handleStatus(property.id,'approved')} disabled={!!processingId} className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40" style={{ borderColor:'var(--color-success-text)', backgroundColor:'var(--color-success-bg)', color:'var(--color-success-text)' }}>
                                <i className="fa-solid fa-check text-xs" />
                              </button>
                            )}
                            {property.status==='approved' && (
                              <button onClick={() => handleStatus(property.id,'rejected')} disabled={!!processingId} className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40" style={{ borderColor:'var(--color-warning-text)', backgroundColor:'var(--color-warning-bg)', color:'var(--color-warning-text)' }}>
                                <i className="fa-solid fa-ban text-xs" />
                              </button>
                            )}
                            <button onClick={() => handleDelete(property.id)} disabled={!!processingId} className="w-7 h-7 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-40" style={{ borderColor:'var(--color-danger-text)', backgroundColor:'var(--color-danger-bg)', color:'var(--color-danger-text)' }}>
                              <i className="fa-solid fa-trash-can text-xs" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length===0 && <div className="p-12 text-center text-muted"><i className="fa-solid fa-magnifying-glass text-3xl mb-2 block" /><p className="text-sm">No listings match your criteria</p></div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
