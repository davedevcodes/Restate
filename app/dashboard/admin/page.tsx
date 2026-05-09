'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getAllProperties, updatePropertyStatus } from '@/lib/api/properties'
import { getAllTransactions, updateTransactionStatus, getAllUsers } from '@/lib/api/transactions'
import { Property, Transaction } from '@/types'
import { formatPrice, formatDate, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

function StatCard({ label, value, sub, textColor, bgColor }: { label: string; value: string | number; sub?: string; textColor: string; bgColor: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: bgColor }}>
      <p className="text-xs font-semibold mb-1" style={{ color: textColor, opacity: 0.7 }}>{label}</p>
      <p className="text-3xl font-extrabold font-heading" style={{ color: textColor, letterSpacing: '-0.04em' }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: textColor, opacity: 0.55 }}>{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [properties,   setProperties]   = useState<Property[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [users,        setUsers]        = useState<any[]>([])
  const [loading,      setLoading]      = useState(true)
  const [tab,          setTab]          = useState<'pending' | 'all' | 'transactions' | 'users'>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    Promise.all([getAllProperties(), getAllTransactions(), getAllUsers()]).then(([props, txns, userList]) => {
      setProperties(props)
      setTransactions(txns)
      setUsers(userList || [])
      setLoading(false)
    })
  }, [user])

  const handleApprove = async (id: string, featured = false) => {
    setProcessingId(id)
    try {
      await updatePropertyStatus(id, 'approved', featured)
      setProperties((prev) => prev.map((p) => p.id === id ? { ...p, status: 'approved' as any, is_featured: featured } : p))
      toast.success('Property approved')
    } catch { toast.error('Failed') } finally { setProcessingId(null) }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      await updatePropertyStatus(id, 'rejected')
      setProperties((prev) => prev.map((p) => p.id === id ? { ...p, status: 'rejected' as any } : p))
      toast.success('Property rejected')
    } catch { toast.error('Failed') } finally { setProcessingId(null) }
  }

  const handleEscrow = async (txnId: string, status: string) => {
    setProcessingId(txnId)
    try {
      await updateTransactionStatus(txnId, status)
      setTransactions((prev) => prev.map((t) => t.id === txnId ? { ...t, status: status as any } : t))
      toast.success(`Transaction ${status}`)
    } catch { toast.error('Failed') } finally { setProcessingId(null) }
  }

  const pendingProps = properties.filter((p) => p.status === 'pending')
  const totalVolume  = transactions.filter((t) => t.status === 'released').reduce((s, t) => s + t.amount, 0)

  const tabs = [
    { key: 'pending',      label: `Approvals (${pendingProps.length})` },
    { key: 'all',          label: 'All Listings' },
    { key: 'transactions', label: `Transactions (${transactions.length})` },
    { key: 'users',        label: `Users (${users.length})` },
  ]

  const listToShow = tab === 'pending' ? pendingProps : properties

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">

            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing: '-0.03em' }}>Admin Dashboard</h1>
              <p className="text-sm mt-1 text-muted">Platform overview and management</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Users"        value={loading ? '—' : users.length}           sub={`${users.filter((u: any) => u.role === 'agent').length} agents`} textColor="#fff" bgColor="#1f6feb" />
              <StatCard label="Pending Approvals"  value={loading ? '—' : pendingProps.length}    sub="awaiting review"  textColor="#fff" bgColor="#9a6700" />
              <StatCard label="Total Transactions" value={loading ? '—' : transactions.length}    sub={`${transactions.filter((t) => t.status === 'held').length} in escrow`} textColor="#fff" bgColor="#238636" />
              <StatCard label="Released Volume"    value={loading ? '—' : formatPrice(totalVolume)} sub="to sellers"     textColor="#fff" bgColor="var(--brand-600)" />
            </div>

            {/* Tabs */}
            <div className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                {tabs.map((t) => (
                  <button key={t.key} onClick={() => setTab(t.key as any)}
                    className="px-5 py-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap"
                    style={tab === t.key
                      ? { borderColor: 'var(--brand-500)', color: 'var(--brand-600)', backgroundColor: 'var(--brand-100)' }
                      : { borderColor: 'transparent', color: 'var(--color-text-muted)' }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--brand-500)', borderTopColor: 'transparent' }} />
                  </div>
                ) : (
                  <div>

                    {/* Listings (pending + all) */}
                    {(tab === 'pending' || tab === 'all') && (
                      <div>
                        {listToShow.length === 0 ? (
                          <div className="text-center py-12 text-muted">
                            <i className="fa-solid fa-circle-check text-4xl mb-3 block" style={{ color: 'var(--color-success-text)' }} />
                            <p className="text-sm">No {tab === 'pending' ? 'pending' : ''} listings</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {listToShow.map((property) => (
                              <div key={property.id} className="flex items-center gap-4 p-4 rounded-xl transition-colors hover-surface" style={{ border: '1px solid var(--color-border-light)' }}>
                                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                                  {property.images?.[0]?.url
                                    // eslint-disable-next-line @next/next/no-img-element
                                    ? <img src={property.images[0].url} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-house text-muted" /></div>
                                  }
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate text-primary font-heading">{property.title}</p>
                                  <p className="text-xs text-muted">{property.city}, {property.state} · {(property.agent as any)?.name || '—'}</p>
                                  <p className="text-xs text-muted mt-0.5">{formatDate(property.created_at)}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-primary">{formatPrice(property.price)}</p>
                                  <span className={'badge status-' + property.status + ' text-xs mt-1'}>{property.status}</span>
                                </div>
                                {property.status === 'pending' && (
                                  <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleApprove(property.id, true)} disabled={!!processingId}
                                      className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                      style={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info-text)' }}>
                                      <i className="fa-solid fa-star mr-1" />Feature
                                    </button>
                                    <button onClick={() => handleApprove(property.id)} disabled={!!processingId}
                                      className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                      style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
                                      <i className="fa-solid fa-check mr-1" />Approve
                                    </button>
                                    <button onClick={() => handleReject(property.id)} disabled={!!processingId}
                                      className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                                      style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' }}>
                                      <i className="fa-solid fa-xmark mr-1" />Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Transactions */}
                    {tab === 'transactions' && (
                      <div>
                        {transactions.length === 0 ? (
                          <div className="text-center py-12 text-muted">
                            <i className="fa-solid fa-money-bill-transfer text-4xl mb-3 block" />
                            <p className="text-sm">No transactions yet</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {transactions.map((txn) => (
                              <div key={txn.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ border: '1px solid var(--color-border-light)' }}>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm truncate text-primary font-heading">{(txn.property as any)?.title || 'Property'}</p>
                                  <p className="text-xs text-muted">
                                    <i className="fa-solid fa-user mr-1" />{(txn.buyer as any)?.name || '—'}
                                    <span className="mx-2">·</span>
                                    <i className="fa-solid fa-id-badge mr-1" />{(txn.seller as any)?.name || '—'}
                                  </p>
                                  <p className="text-xs text-muted mt-0.5">{formatDate(txn.created_at)}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-primary">{formatPrice(txn.amount)}</p>
                                  <span className={'badge status-' + txn.status + ' text-xs mt-1'}>{txn.status}</span>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  {txn.status === 'pending' && (
                                    <button onClick={() => handleEscrow(txn.id, 'held')} disabled={!!processingId}
                                      className="px-3 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-50"
                                      style={{ backgroundColor: '#EDE9FE', color: '#6D28D9' }}>
                                      <i className="fa-solid fa-lock mr-1" />Hold
                                    </button>
                                  )}
                                  {txn.status === 'held' && (
                                    <button onClick={() => handleEscrow(txn.id, 'released')} disabled={!!processingId}
                                      className="px-3 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-50"
                                      style={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }}>
                                      <i className="fa-solid fa-unlock mr-1" />Release
                                    </button>
                                  )}
                                  {(txn.status === 'pending' || txn.status === 'held') && (
                                    <button onClick={() => handleEscrow(txn.id, 'cancelled')} disabled={!!processingId}
                                      className="px-3 py-1.5 text-xs font-semibold rounded-lg disabled:opacity-50"
                                      style={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger-text)' }}>
                                      <i className="fa-solid fa-xmark" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Users */}
                    {tab === 'users' && (
                      <div className="space-y-2">
                        {users.length === 0 ? (
                          <div className="text-center py-12 text-muted">
                            <i className="fa-solid fa-users text-4xl mb-3 block" />
                            <p className="text-sm">No users yet</p>
                          </div>
                        ) : users.map((u: any) => (
                          <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ border: '1px solid var(--color-border-light)' }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }}>
                              {getInitials(u.name || '?')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-primary font-heading">{u.name}</p>
                              <p className="text-xs text-muted">{u.email}</p>
                            </div>
                            <span className={'badge text-xs capitalize status-' + (u.role === 'admin' ? 'approved' : u.role === 'agent' ? 'sold' : 'pending')}>{u.role}</span>
                            <p className="text-xs text-muted hidden sm:block">{formatDate(u.created_at)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
