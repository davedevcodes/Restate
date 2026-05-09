'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import PropertyCard from '@/components/property/PropertyCard'
import { useAuth } from '@/lib/auth-context'
import { getUserFavorites, getBuyerTransactions } from '@/lib/api/transactions'
import { Favorite, Transaction } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [favorites,     setFavorites]     = useState<Favorite[]>([])
  const [transactions,  setTransactions]  = useState<Transaction[]>([])
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([getUserFavorites(user.id), getBuyerTransactions(user.id)]).then(([favs, txns]) => {
      setFavorites(favs); setTransactions(txns); setLoading(false)
    })
  }, [user])

  const activeTxns    = transactions.filter((t) => ['pending', 'held'].includes(t.status))
  const completedTxns = transactions.filter((t) => t.status === 'released')
  const totalSpent    = completedTxns.reduce((s, t) => s + t.amount, 0)

  const stats = [
    { label: 'Saved Properties',  value: loading ? '—' : favorites.length,     icon: 'fa-regular fa-heart',      bg: 'var(--color-danger-bg)',   color: 'var(--color-danger-text)' },
    { label: 'Active Purchases',  value: loading ? '—' : activeTxns.length,    icon: 'fa-solid fa-clock',        bg: 'var(--color-warning-bg)',  color: 'var(--color-warning-text)' },
    { label: 'Completed Buys',    value: loading ? '—' : completedTxns.length, icon: 'fa-solid fa-circle-check', bg: 'var(--color-success-bg)',  color: 'var(--color-success-text)' },
    { label: 'Total Spent',       value: loading ? '—' : formatPrice(totalSpent), icon: 'fa-solid fa-wallet',    bg: 'var(--brand-100)',          color: 'var(--brand-600)' },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">

            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing: '-0.03em' }}>My Dashboard</h1>
              <p className="text-sm mt-1 text-muted">Welcome back, {user?.name?.split(' ')[0]}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (<div key={s.label} className="rounded-2xl p-5" style={{ backgroundColor: s.bg }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
                    <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
                  </div>
                  <p className="text-2xl font-extrabold font-heading" style={{ color: s.color, letterSpacing: '-0.03em' }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Active Transactions */}
            {activeTxns.length > 0 && (
              <div className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                <div className="p-5" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  <h2 className="font-bold font-heading text-primary">Active Transactions</h2>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-border-light)' }}>
                  {activeTxns.map((txn) => (<div key={txn.id} key={txn.id} className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                        <i className="fa-solid fa-house text-sm text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-primary font-heading">{(txn.property as any)?.title || 'Property'}</p>
                        <p className="text-xs text-muted mt-0.5">{formatDate(txn.created_at)}</p>
                        {txn.paystack_reference && <p className="text-xs font-mono text-muted mt-0.5">{txn.paystack_reference}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatPrice(txn.amount)}</p>
                        <span className={`badge status-${txn.status} text-xs mt-1`}>
                          {txn.status === 'held' ? <><i className="fa-solid fa-lock mr-1 text-xs" />In Escrow</> : txn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4" style={{ backgroundColor: 'var(--color-info-bg)', borderTop: '1px solid var(--color-border-light)' }}>
                  <p className="text-xs" style={{ color: 'var(--color-info-text)' }}>
                    <i className="fa-solid fa-shield-halved mr-1.5" />
                    Your payment is safely held in escrow and released to the seller once the admin confirms the transaction.
                  </p>
                </div>
              </div>
            )}

            {/* Saved Properties */}
            <div className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <h2 className="font-bold font-heading text-primary">Saved Properties</h2>
                <Link href="/dashboard/buyer/favorites" className="text-sm font-medium" style={{ color: 'var(--brand-500)' }}>View all</Link>
              </div>
              {loading ? (
                <div className="p-8 flex justify-center">
                  <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--brand-500)', borderTopColor: 'transparent' }} />
                </div>
              ) : favorites.length === 0 ? (
                <div className="p-10 text-center">
                  <i className="fa-regular fa-heart text-4xl mb-3 block" style={{ color: 'var(--color-text-muted)' }} />
                  <p className="text-sm mb-4 text-muted">No saved properties yet</p>
                  <Link href="/listings" className="btn-primary text-sm">Browse Properties</Link>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.slice(0, 3).map((fav) => fav.property && (
                    <PropertyCard key={fav.id} property={fav.property as any} isFavorited
                      onFavoriteChange={(pid, isFav) => { if (!isFav) setFavorites((prev) => prev.filter((f) => f.property_id !== pid)) }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { href: '/listings',                    label: 'Browse Properties',  icon: 'fa-solid fa-magnifying-glass', desc: 'Find your next home' },
                { href: '/dashboard/buyer/favorites',   label: 'Saved Properties',   icon: 'fa-regular fa-heart',          desc: `${favorites.length} properties` },
                { href: '/dashboard/buyer/messages',    label: 'Messages',           icon: 'fa-regular fa-comments',       desc: 'Chat with agents' },
              ].map((action) => (<Link key={action.href} href={action.href}>
                  <div className="rounded-2xl p-5 transition-all group cursor-pointer hover:shadow-card-hover"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
                  >
                    <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: 'var(--brand-100)' }}>
                      <i className={`${action.icon} text-sm`} style={{ color: 'var(--brand-600)' }} />
                    </div>
                    <h3 className="font-bold text-sm font-heading text-primary group-hover:text-[var(--brand-500)] transition-colors">{action.label}</h3>
                    <p className="text-xs mt-0.5 text-muted">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
