'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getAllProperties, updatePropertyStatus } from '@/lib/api/properties'
import { Property } from '@/types'
import { formatPrice, formatDate, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminApprovalsPage() {
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string|null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    getAllProperties('pending').then((d) => { setProperties(d); setLoading(false) })
  }, [user])

  const handle = async (id: string, action: 'approved'|'rejected', featured=false) => {
    setProcessingId(id)
    try {
      await updatePropertyStatus(id, action, action==='approved' ? featured : undefined)
      setProperties((p) => p.filter((x) => x.id !== id))
      toast.success(`Property ${action}`)
    } catch { toast.error('Failed') }
    finally { setProcessingId(null) }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing:'-0.02em' }}>Pending Approvals</h1>
              <p className="text-sm mt-1 text-muted">{loading ? '...' : `${properties.length} listings awaiting review`}</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--brand-500)', borderTopColor:'transparent' }} /></div>
            ) : properties.length === 0 ? (
              <div className="rounded-2xl p-16 text-center shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor:'var(--color-success-bg)' }}>
                  <i className="fa-solid fa-circle-check text-3xl" style={{ color:'var(--color-success-text)' }} />
                </div>
                <h2 className="font-bold font-heading text-primary mb-2">All caught up!</h2>
                <p className="text-sm text-muted">No pending listings to review right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (<div key={property.id} className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                    <div className="flex">
                      <div className="w-40 sm:w-52 relative shrink-0">
                        {property.images?.[0]?.url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={property.images[0].url} alt="" className="w-full h-full object-cover" style={{ minHeight:'160px' }} />
                          : <div className="w-full min-h-40 flex items-center justify-center" style={{ backgroundColor:'var(--color-surface-2)' }}><i className="fa-solid fa-house text-4xl text-muted" /></div>}
                        {property.images?.length > 1 && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor:'rgba(0,0,0,0.6)', color:'#fff', fontSize:'11px' }}>
                            <i className="fa-solid fa-images mr-1 text-xs" />+{property.images.length-1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-extrabold text-primary font-heading truncate">{property.title}</h3>
                            <p className="font-extrabold font-heading shrink-0" style={{ color:'var(--brand-500)', letterSpacing:'-0.02em' }}>{formatPrice(property.price)}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="flex items-center gap-1 text-xs text-muted"><i className="fa-solid fa-location-dot text-xs" style={{ color:'var(--brand-400)' }} />{property.city}, {property.state}</span>
                            <span className="badge status-pending text-xs capitalize">{property.property_type}</span>
                            <span className="badge status-sold text-xs capitalize">For {property.listing_type}</span>
                          </div>
                          <p className="text-sm text-secondary line-clamp-2 mb-3">{property.description}</p>
                          {(property.agent as any)?.name && (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor:'var(--brand-100)', color:'var(--brand-700)' }}>
                                {getInitials((property.agent as any).name)}
                              </div>
                              <span className="text-xs text-muted">By <span className="font-semibold text-primary">{(property.agent as any).name}</span></span>
                              <span className="text-xs text-muted ml-auto">{formatDate(property.created_at)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 pt-4 mt-4" style={{ borderTop:'1px solid var(--color-border-light)' }}>
                          <Link href={`/property/${property.id}`} target="_blank" className="text-xs font-medium flex items-center gap-1" style={{ color:'var(--brand-500)' }}>
                            <i className="fa-solid fa-arrow-up-right-from-square text-xs" />Preview
                          </Link>
                          <div className="flex gap-2 ml-auto">
                            <button onClick={() => handle(property.id,'approved',true)} disabled={!!processingId}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                              style={{ backgroundColor:'var(--color-info-bg)', color:'var(--color-info-text)' }}>
                              <i className="fa-solid fa-star mr-1" />Feature
                            </button>
                            <button onClick={() => handle(property.id,'approved')} disabled={!!processingId}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                              style={{ backgroundColor:'var(--color-success-bg)', color:'var(--color-success-text)' }}>
                              <i className="fa-solid fa-check mr-1" />Approve
                            </button>
                            <button onClick={() => handle(property.id,'rejected')} disabled={!!processingId}
                              className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                              style={{ backgroundColor:'var(--color-danger-bg)', color:'var(--color-danger-text)' }}>
                              <i className="fa-solid fa-xmark mr-1" />Reject
                            </button>
                          </div>
                        </div>
                      </div>
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
