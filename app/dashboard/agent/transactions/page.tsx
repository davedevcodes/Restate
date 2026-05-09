'use client'
import { useEffect, useState } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getAgentTransactions } from '@/lib/api/transactions'
import { Transaction } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

export default function AgentTransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getAgentTransactions(user.id).then((d) => { setTransactions(d); setLoading(false) })
  }, [user])

  const released = transactions.filter((t) => t.status === 'released')
  const held = transactions.filter((t) => t.status === 'held')
  const totalEarned = released.reduce((s, t) => s + t.amount, 0)
  const pendingAmount = held.reduce((s, t) => s + t.amount, 0)

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing:'-0.02em' }}>Earnings</h1>
              <p className="text-sm mt-1 text-muted">Track your property sale proceeds</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl p-5 text-white" style={{ backgroundColor:'#238636' }}>
                <p className="text-xs font-semibold opacity-70 mb-1">Total Earned</p>
                <p className="text-3xl font-extrabold font-heading" style={{ letterSpacing:'-0.04em' }}>{formatPrice(totalEarned)}</p>
                <p className="text-xs opacity-50 mt-1">{released.length} transactions</p>
              </div>
              <div className="rounded-2xl p-5 text-white" style={{ backgroundColor:'#7c3aed' }}>
                <p className="text-xs font-semibold opacity-70 mb-1">In Escrow</p>
                <p className="text-3xl font-extrabold font-heading" style={{ letterSpacing:'-0.04em' }}>{formatPrice(pendingAmount)}</p>
                <p className="text-xs opacity-50 mt-1">{held.length} pending release</p>
              </div>
              <div className="rounded-2xl p-5 shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <p className="text-xs font-semibold text-muted mb-1">Total Transactions</p>
                <p className="text-3xl font-extrabold font-heading text-primary" style={{ letterSpacing:'-0.04em' }}>{transactions.length}</p>
                <p className="text-xs text-muted mt-1">all time</p>
              </div>
            </div>
            {held.length > 0 && (
              <div className="rounded-2xl p-4 flex items-start gap-3" style={{ backgroundColor:'#EDE9FE', border:'1px solid #DDD6FE' }}>
                <i className="fa-solid fa-lock text-base mt-0.5" style={{ color:'#6D28D9' }} />
                <div>
                  <p className="font-bold text-sm" style={{ color:'#4C1D95' }}>Funds in Escrow</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color:'#6D28D9' }}>
                    {formatPrice(pendingAmount)} is held in escrow. Funds are released once the admin verifies the transaction — typically 1-3 business days.
                  </p>
                </div>
              </div>
            )}
            <div className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
              <div className="p-5" style={{ borderBottom:'1px solid var(--color-border-light)' }}>
                <h2 className="font-bold font-heading text-primary">Transaction History</h2>
              </div>
              {loading ? (
                <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--brand-500)', borderTopColor:'transparent' }} /></div>
              ) : transactions.length === 0 ? (
                <div className="p-12 text-center">
                  <i className="fa-solid fa-wallet text-4xl mb-3 block text-muted" />
                  <p className="text-sm text-muted">No earnings yet. Keep listing properties!</p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor:'var(--color-border-light)' }}>
                  {transactions.map((txn) => (<div key={txn.id} className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor:'var(--color-surface-2)' }}>
                        {(txn.property as any)?.images?.[0]?.url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={(txn.property as any).images[0].url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-house text-muted text-sm" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate text-primary font-heading">{(txn.property as any)?.title || 'Property'}</p>
                        <p className="text-xs text-muted mt-0.5">
                          <i className="fa-solid fa-user mr-1" />{(txn.buyer as any)?.name || '—'} · {formatDate(txn.created_at)}
                        </p>
                        {txn.paystack_reference && <p className="text-xs font-mono text-muted">{txn.paystack_reference}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary">{formatPrice(txn.amount)}</p>
                        <span className={'badge status-' + txn.status + ' text-xs mt-1'}>{txn.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
