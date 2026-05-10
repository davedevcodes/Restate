'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getAgentProperties } from '@/lib/api/properties'
import { getAgentTransactions } from '@/lib/api/transactions'
import { Property, Transaction } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

function StatCard({ label, value, icon, bg, color }: { label: string; value: string | number; icon: string; bg: string; color: string }) {
  return (
    <div
      className="rounded-2xl p-5 shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
          <i className={`${icon} text-sm`} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing: '-0.03em' }}>{value}</p>
    </div>
  )
}

export default function AgentDashboard() {
  const { user } = useAuth()
  const [properties, setProperties]   = useState<Property[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([getAgentProperties(user.id), getAgentTransactions(user.id)]).then(([props, txns]) => {
      setProperties(props); setTransactions(txns); setLoading(false)
    })
  }, [user])

  const approved       = properties.filter((p) => p.status === 'approved').length
  const pending        = properties.filter((p) => p.status === 'pending').length
  const sold           = properties.filter((p) => p.status === 'sold').length
  const totalEarnings  = transactions.filter((t) => t.status === 'released').reduce((s, t) => s + t.amount, 0)
  const pendingEarnings = transactions.filter((t) => t.status === 'held').reduce((s, t) => s + t.amount, 0)

  const statusClass: Record<string, string> = {
    pending: 'status-pending', approved: 'status-approved',
    rejected: 'status-rejected', sold: 'status-sold',
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing: '-0.03em' }}>Agent Dashboard</h1>
                <p className="text-sm mt-1 text-muted">Welcome back, {user?.name?.split(' ')[0]}</p>
              </div>
              <Link href="/dashboard/agent/new-listing" className="btn-primary">
                <i className="fa-solid fa-plus text-sm" />
                Add Listing
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Active Listings"   value={loading ? '—' : approved}                icon="fa-solid fa-circle-check"     bg="var(--color-success-bg)" color="var(--color-success-text)" />
              <StatCard label="Pending Review"    value={loading ? '—' : pending}                 icon="fa-solid fa-clock"            bg="var(--color-warning-bg)" color="var(--color-warning-text)" />
              <StatCard label="Properties Sold"   value={loading ? '—' : sold}                    icon="fa-solid fa-handshake"        bg="var(--color-info-bg)"    color="var(--color-info-text)"    />
              <StatCard label="Total Earned"      value={loading ? '—' : formatPrice(totalEarnings)} icon="fa-solid fa-wallet"        bg="var(--brand-100)"        color="var(--brand-600)"          />
            </div>

            {/* Pending escrow banner */}
            {pendingEarnings > 0 && (
              <div className="rounded-2xl p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-border-light)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-warning-bg)' }}>
                  <i className="fa-solid fa-lock text-base" style={{ color: 'var(--color-warning-text)' }} />
                </div>
                <div>
                  <p className="font-bold text-sm font-heading" style={{ color: 'var(--color-warning-text)' }}>Pending Escrow Release</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-warning-text)', opacity: 0.8 }}>
                    {formatPrice(pendingEarnings)} is held in escrow pending admin approval.
                  </p>
                </div>
              </div>
            )}

            {/* Recent Listings */}
            <div className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <h2 className="font-bold font-heading text-primary">Recent Listings</h2>
                <Link href="/dashboard/agent/listings" className="text-sm font-medium" style={{ color: 'var(--brand-500)' }}>View all</Link>
              </div>
              {loading ? (
                <div className="p-8 flex justify-center"><div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--brand-500)', borderTopColor: 'transparent' }} /></div>
              ) : properties.length === 0 ? (
                <div className="p-10 text-center">
                  <i className="fa-solid fa-building-circle-xmark text-3xl mb-3 block" style={{ color: 'var(--color-text-muted)' }} />
                  <p className="text-sm mb-4 text-muted">No listings yet</p>
                  <Link href="/dashboard/agent/new-listing" className="btn-primary text-sm">Add your first listing</Link>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--color-border-light)' }}>
                  {properties.slice(0, 5).map((p) => (<div key={p.id} className="p-4 flex items-center gap-4 transition-colors hover:bg-card-2">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        {p.images?.[0]?.url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-house text-muted" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate text-primary font-heading">{p.title}</p>
                        <p className="text-xs mt-0.5 text-muted">{p.city}, {p.state}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-primary">{formatPrice(p.price)}</p>
                        <span className={`badge ${statusClass[p.status] || ''} mt-1 text-xs`}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <h2 className="font-bold font-heading text-primary">Recent Transactions</h2>
                  <Link href="/dashboard/agent/transactions" className="text-sm font-medium" style={{ color: 'var(--brand-500)' }}>View all</Link>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-border-light)' }}>
                  {transactions.slice(0, 4).map((txn) => (<div key={txn.id} className="p-4 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        <i className="fa-solid fa-receipt text-sm text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-primary">{(txn.property as any)?.title || 'Property'}</p>
                        <p className="text-xs text-muted">{formatDate(txn.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-primary">{formatPrice(txn.amount)}</p>
                        <span className={`badge ${(txn as any).statusClass || 'status-' + txn.status} text-xs mt-1`}>{txn.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
