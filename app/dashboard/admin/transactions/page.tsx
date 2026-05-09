'use client'
import { useEffect, useState } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getAllTransactions, updateTransactionStatus } from '@/lib/api/transactions'
import { Transaction } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminTransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [processingId, setProcessingId] = useState<string|null>(null)
  const [modal, setModal] = useState<{txnId:string; action:string}|null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!user || user.role!=='admin') return
    getAllTransactions().then((d) => { setTransactions(d); setLoading(false) })
  }, [user])

  const handleAction = async (txnId: string, status: string, notesText?: string) => {
    setProcessingId(txnId)
    try {
      await updateTransactionStatus(txnId, status, notesText)
      setTransactions((p) => p.map((t) => t.id===txnId ? {...t, status:status as any, notes:notesText} : t))
      toast.success(`Transaction ${status}`)
      setModal(null); setNotes('')
    } catch { toast.error('Failed') } finally { setProcessingId(null) }
  }

  const counts: Record<string,number> = { all:transactions.length, pending:0, held:0, released:0, cancelled:0 }
  transactions.forEach((t) => { if (counts[t.status]!==undefined) counts[t.status]++ })
  const filtered = filter==='all' ? transactions : transactions.filter((t) => t.status===filter)
  const totalVolume = transactions.reduce((s,t) => s+t.amount, 0)
  const releasedVolume = transactions.filter((t) => t.status==='released').reduce((s,t) => s+t.amount, 0)
  const heldVolume = transactions.filter((t) => t.status==='held').reduce((s,t) => s+t.amount, 0)

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing:'-0.02em' }}>Transactions</h1>
              <p className="text-sm mt-1 text-muted">Manage escrow payments across the platform</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl p-5 text-white" style={{ backgroundColor:'#161B22', border:'1px solid #30363D' }}>
                <p className="text-xs font-semibold opacity-60 mb-1">Total Volume</p>
                <p className="text-2xl font-extrabold font-heading" style={{ letterSpacing:'-0.04em' }}>{formatPrice(totalVolume)}</p>
                <p className="text-xs opacity-40 mt-1">{transactions.length} transactions</p>
              </div>
              <div className="rounded-2xl p-5 text-white" style={{ backgroundColor:'#7c3aed' }}>
                <p className="text-xs font-semibold opacity-70 mb-1">In Escrow</p>
                <p className="text-2xl font-extrabold font-heading" style={{ letterSpacing:'-0.04em' }}>{formatPrice(heldVolume)}</p>
                <p className="text-xs opacity-50 mt-1">{counts.held} awaiting release</p>
              </div>
              <div className="rounded-2xl p-5 text-white" style={{ backgroundColor:'#238636' }}>
                <p className="text-xs font-semibold opacity-70 mb-1">Released</p>
                <p className="text-2xl font-extrabold font-heading" style={{ letterSpacing:'-0.04em' }}>{formatPrice(releasedVolume)}</p>
                <p className="text-xs opacity-50 mt-1">{counts.released} completed</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(counts).map(([s,c]) => (
                <button key={s} onClick={() => setFilter(s)}
                  className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all"
                  style={filter===s ? { backgroundColor:'var(--brand-500)', color:'#fff' } : { backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-secondary)' }}>
                  {s} ({c})
                </button>
              ))}
            </div>
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--brand-500)', borderTopColor:'transparent' }} /></div>
            ) : filtered.length===0 ? (
              <div className="rounded-2xl p-12 text-center shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <i className="fa-solid fa-money-bill-transfer text-4xl mb-3 block text-muted" />
                <p className="text-sm text-muted">No transactions in this category</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((txn) => (<div key={txn.id} className="rounded-2xl p-5 shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor:'var(--color-surface-2)' }}>
                        {(txn.property as any)?.images?.[0]?.url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={(txn.property as any).images[0].url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><i className="fa-solid fa-house text-muted" /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-primary font-heading truncate">{(txn.property as any)?.title || 'Property'}</p>
                            <p className="text-xs text-muted mt-0.5">
                              <i className="fa-solid fa-user mr-1" />{(txn.buyer as any)?.name || '—'}
                              <span className="mx-2">·</span>
                              <i className="fa-solid fa-id-badge mr-1" />{(txn.seller as any)?.name || '—'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-extrabold text-primary font-heading" style={{ letterSpacing:'-0.03em' }}>{formatPrice(txn.amount)}</p>
                            <span className={'badge status-' + txn.status + ' text-xs mt-1'}>{txn.status}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted">
                          {txn.paystack_reference && <span className="font-mono rounded px-1.5 py-0.5" style={{ backgroundColor:'var(--color-surface-2)' }}>{txn.paystack_reference}</span>}
                          <span>{formatDate(txn.created_at)}</span>
                          {txn.notes && <span className="rounded px-1.5 py-0.5" style={{ backgroundColor:'var(--color-warning-bg)', color:'var(--color-warning-text)' }}>Note: {txn.notes}</span>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        {txn.status==='pending' && <button onClick={() => handleAction(txn.id,'held')} disabled={!!processingId} className="px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-50" style={{ backgroundColor:'#EDE9FE', color:'#6D28D9' }}><i className="fa-solid fa-lock mr-1" />Hold</button>}
                        {txn.status==='held' && <button onClick={() => handleAction(txn.id,'released')} disabled={!!processingId} className="px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-50" style={{ backgroundColor:'var(--color-success-bg)', color:'var(--color-success-text)' }}><i className="fa-solid fa-unlock mr-1" />Release</button>}
                        {(txn.status==='pending'||txn.status==='held') && (
                          <>
                            <button onClick={() => setModal({txnId:txn.id,action:'cancelled'})} disabled={!!processingId} className="px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-50" style={{ backgroundColor:'var(--color-danger-bg)', color:'var(--color-danger-text)' }}><i className="fa-solid fa-xmark mr-1" />Cancel</button>
                            <button onClick={() => setModal({txnId:txn.id,action:'refunded'})} disabled={!!processingId} className="px-3 py-1.5 text-xs font-bold rounded-lg disabled:opacity-50" style={{ backgroundColor:'var(--color-warning-bg)', color:'var(--color-warning-text)' }}><i className="fa-solid fa-rotate-left mr-1" />Refund</button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative rounded-2xl p-6 w-full max-w-md shadow-modal" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
            <h3 className="font-extrabold font-heading text-primary text-lg mb-2 capitalize"><i className="fa-solid fa-triangle-exclamation mr-2" style={{ color:'var(--color-danger-text)' }} />{modal.action==='cancelled' ? 'Cancel' : 'Refund'} Transaction</h3>
            <p className="text-sm text-muted mb-4">Add a reason note (optional but recommended):</p>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Buyer requested cancellation..." rows={3} className="input-base resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="btn-secondary flex-1">Back</button>
              <button onClick={() => handleAction(modal.txnId, modal.action, notes)} disabled={!!processingId}
                className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor:'var(--color-danger-text)' }}>
                {processingId ? <><i className="fa-solid fa-spinner animate-spin mr-1" />Processing...</> : `Confirm ${modal.action==='cancelled' ? 'Cancel' : 'Refund'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
