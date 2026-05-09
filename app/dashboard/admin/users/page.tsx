'use client'
import { useEffect, useState } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { getAllUsers, updateUserRole } from '@/lib/api/transactions'
import { formatDate, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [updatingId, setUpdatingId] = useState<string|null>(null)

  useEffect(() => {
    if (!user || user.role!=='admin') return
    getAllUsers().then((d) => { setUsers(d||[]); setLoading(false) })
  }, [user])

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userId===user?.id) { toast.error("You can't change your own role"); return }
    setUpdatingId(userId)
    try { await updateUserRole(userId, newRole); setUsers((p) => p.map((u) => u.id===userId ? {...u, role:newRole} : u)); toast.success(`Role updated to ${newRole}`) }
    catch { toast.error('Failed') } finally { setUpdatingId(null) }
  }

  const counts = { all:users.length, admin:users.filter((u)=>u.role==='admin').length, agent:users.filter((u)=>u.role==='agent').length, buyer:users.filter((u)=>u.role==='buyer').length }
  const filtered = users
    .filter((u) => filterRole==='all'||u.role===filterRole)
    .filter((u) => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  const roleStyle: Record<string,{bg:string;color:string}> = {
    admin: { bg:'var(--color-danger-bg)',  color:'var(--color-danger-text)' },
    agent: { bg:'var(--color-info-bg)',    color:'var(--color-info-text)' },
    buyer: { bg:'var(--color-success-bg)', color:'var(--color-success-text)' },
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing:'-0.02em' }}>Manage Users</h1>
              <p className="text-sm mt-1 text-muted">{users.length} registered users on the platform</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label:'Total Users', value:counts.all,   bg:'var(--color-surface-2)', color:'var(--color-text-primary)', icon:'fa-solid fa-users' },
                { label:'Admins',      value:counts.admin, bg:'var(--color-danger-bg)',  color:'var(--color-danger-text)',  icon:'fa-solid fa-shield-halved' },
                { label:'Agents',      value:counts.agent, bg:'var(--color-info-bg)',    color:'var(--color-info-text)',    icon:'fa-solid fa-id-badge' },
                { label:'Buyers',      value:counts.buyer, bg:'var(--color-success-bg)', color:'var(--color-success-text)', icon:'fa-solid fa-user' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor:s.bg }}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold" style={{ color:s.color, opacity:0.7 }}>{s.label}</p>
                    <i className={s.icon + ' text-xs'} style={{ color:s.color }} />
                  </div>
                  <p className="text-2xl font-extrabold font-heading" style={{ color:s.color, letterSpacing:'-0.03em' }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted" />
                <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-base pl-10" />
              </div>
              <div className="flex gap-2">
                {['all','admin','agent','buyer'].map((role) => (
                  <button key={role} onClick={() => setFilterRole(role)}
                    className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all"
                    style={filterRole===role ? { backgroundColor:'var(--brand-500)', color:'#fff' } : { backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border)', color:'var(--color-text-secondary)' }}>
                    {role}
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
                      <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted">User</th>
                      <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted hidden sm:table-cell">Email</th>
                      <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted">Role</th>
                      <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted hidden lg:table-cell">Joined</th>
                      <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted">Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (<tr key={u.id} style={{ borderBottom:'1px solid var(--color-border-light)' }}
                        className="transition-colors hover-surface">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor:'var(--brand-100)', color:'var(--brand-700)' }}>
                              {getInitials(u.name||'?')}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-primary font-heading">
                                {u.name}
                                {u.id===user?.id && <span className="ml-2 text-xs" style={{ color:'var(--brand-500)' }}>(you)</span>}
                              </p>
                              <p className="text-xs text-muted sm:hidden">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell"><span className="text-sm text-secondary">{u.email}</span></td>
                        <td className="px-5 py-3">
                          <span className="badge text-xs capitalize" style={{ backgroundColor: roleStyle[u.role]?.bg, color: roleStyle[u.role]?.color }}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell"><span className="text-xs text-muted">{formatDate(u.created_at)}</span></td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {u.id!==user?.id && (
                              <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} disabled={updatingId===u.id}
                                className="text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer disabled:opacity-50"
                                style={{ border:'1px solid var(--color-border)', backgroundColor:'var(--color-surface)', color:'var(--color-text-primary)' }}>
                                <option value="buyer">Buyer</option>
                                <option value="agent">Agent</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}
                            {updatingId===u.id && <i className="fa-solid fa-spinner animate-spin text-xs" style={{ color:'var(--brand-500)' }} />}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length===0 && <div className="p-12 text-center text-muted"><i className="fa-solid fa-users-slash text-3xl mb-2 block" /><p className="text-sm">No users match your search</p></div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
