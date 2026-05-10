'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getBuyerTransactions } from '@/lib/api/transactions'
import { Transaction } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

export default function BuyerTransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return
    getBuyerTransactions(user.id).then((d) => { setTransactions(d); setLoading(false) })
  }, [user])

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.status === filter)
  const totalSpent = transactions.filter((t) => t.status === 'released').reduce((s, t) => s + t.amount, 0)

  const steps = ['pending','held','released']

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing:'-0.02em' }}>Purchase History</h1>
              <p className="text-sm mt-1 text-muted">Track all your property transactions</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label:'Total Transactions', value:transactions.length,   bg:'var(--color-surface-2)', color:'var(--color-text-primary)' },
                { label:'In Escrow',          value:transactions.filter(t=>t.status==='held').length, bg:'#EDE9FE', color:'#6D28D9' },
                { label:'Total Spent',        value:formatPrice(totalSpent), bg:'var(--brand-100)', color:'var(--brand-700)' },
              ].map((s) => (<div key={s.label} className="rounded-2xl p-4" style={{ backgroundColor: s.bg }}>
                  <p className="text-2xl font-extrabold font-heading" style={{ color: s.color, letterSpacing:'-0.03em' }}>{s.value}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: s.color, opacity:0.7 }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all','pending','held','released','cancelled'].map((s) => (<button key={s} onClick={() => setFilter(s)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
                  style={filter===s ? { backgroundColor:'var(--brand-500)', color:'#fff' } : { backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-secondary)' }}
                >{s}</button>
              ))}
            </div>
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--brand-500)', borderTopColor:'transparent' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl p-16 text-center shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <i className="fa-solid fa-file-invoice text-4xl mb-4 block text-muted" />
                <h2 className="font-bold font-heading text-primary mb-2">No transactions found</h2>
                <p className="text-sm text-muted mb-6">Your purchase history will appear here.</p>
                <Link href="/listings" className="btn-primary"><i className="fa-solid fa-building mr-2" />Browse Properties</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((txn) => (<div key={txn.id} className="rounded-2xl p-5 shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor:'var(--color-surface-2)' }}>
                        {(txn.property as any)?.images?.[0]?.url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={(txn.property as any).images[0].url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-house text-muted" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-bold text-primary font-heading truncate">{(txn.property as any)?.title || 'Property'}</h3>
                            <p className="text-xs text-muted mt-0.5">{(txn.property as any)?.city}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-extrabold text-primary font-heading" style={{ letterSpacing:'-0.03em' }}>{formatPrice(txn.amount)}</p>
                            <span className={'badge status-' + txn.status + ' text-xs mt-1'}>{txn.status}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
                          {txn.paystack_reference && <span className="font-mono bg-card-2 px-2 py-0.5 rounded">Ref: {txn.paystack_reference}</span>}
                          <span>{formatDate(txn.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    {!['cancelled','refunded'].includes(txn.status) && (
                      <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop:'1px solid var(--color-border-light)' }}>
                        {steps.map((step, i) => {
                          const idx = steps.indexOf(txn.status)
                          const done = i <= idx
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                  style={{ backgroundColor: done ? 'var(--brand-500)' : 'var(--color-surface-2)', color: done ? '#fff' : 'var(--color-text-muted)' }}>
                                  {done ? <i className="fa-solid fa-check text-xs" /> : i+1}
                                </div>
                                <span className="text-xs font-medium capitalize hidden sm:block" style={{ color: done ? 'var(--brand-500)' : 'var(--color-text-muted)' }}>{step}</span>
                              </div>
                              {i < 2 && <div className="flex-1 h-px mx-2" style={{ backgroundColor: done && idx > i ? 'var(--brand-400)' : 'var(--color-border)' }} />}
                            </div>
                          )
                        })}
                      </div>
                    )}
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
