'use client'
import { useState, useEffect } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/lib/auth-context'
import { updateUserProfile } from '@/lib/api/transactions'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', bio: '' })

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', bio: user.bio || '' })
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setLoading(true)
    try {
      await updateUserProfile(user.id, { name: form.name, phone: form.phone, bio: form.bio })
      await refreshUser()
      toast.success('Profile updated successfully')
    } catch { toast.error('Failed to update profile') }
    finally { setLoading(false) }
  }

  const roleColors: Record<string, { bg: string; color: string }> = {
    admin: { bg: 'var(--color-danger-bg)',  color: 'var(--color-danger-text)' },
    agent: { bg: 'var(--color-info-bg)',    color: 'var(--color-info-text)' },
    buyer: { bg: 'var(--color-success-bg)', color: 'var(--color-success-text)' },
  }
  const rc = roleColors[user?.role || 'buyer']

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0 max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing: '-0.02em' }}>Profile Settings</h1>
              <p className="text-sm mt-1 text-muted">Manage your account information</p>
            </div>

            <div
              className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
              {/* Avatar header */}
              <div className="p-6" style={{ borderBottom: '1px solid var(--color-border-light)', background: 'linear-gradient(135deg, var(--brand-100) 0%, var(--color-surface-2) 100%)' }}>
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-extrabold text-2xl font-heading shadow-card" style={{ backgroundColor: 'var(--brand-500)', color: '#fff' }}>
                    {user ? getInitials(user.name) : '?'}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-lg font-heading text-primary">{user?.name}</h2>
                    <p className="text-sm text-muted">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full capitalize" style={{ backgroundColor: rc?.bg, color: rc?.color }}>
                      <i className={`mr-1.5 text-xs ${user?.role === 'admin' ? 'fa-solid fa-shield-halved' : user?.role === 'agent' ? 'fa-solid fa-id-badge' : 'fa-solid fa-user'}`} />
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-secondary">Full Name</label>
                    <div className="relative">
                      <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted" />
                      <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-base pl-10" placeholder="Your full name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-secondary">Phone Number</label>
                    <div className="relative">
                      <i className="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted" />
                      <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input-base pl-10" placeholder="+234 800 000 0000" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-secondary">Email Address</label>
                  <div className="relative">
                    <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted" />
                    <input type="email" value={user?.email || ''} readOnly className="input-base pl-10 cursor-not-allowed" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }} />
                  </div>
                  <p className="text-xs text-muted mt-1.5"><i className="fa-solid fa-lock mr-1" />Email cannot be changed</p>
                </div>
                {user?.role === 'agent' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-secondary">Bio</label>
                    <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={4} className="input-base resize-none" placeholder="Tell buyers about your experience, specialties, and areas of operation..." />
                    <p className="text-xs text-muted mt-1.5"><i className="fa-solid fa-circle-info mr-1" />This bio will be visible on your property listings</p>
                  </div>
                )}

                {/* Account info */}
                <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Account Information</h3>
                  {[
                    { label: 'Account Type',        value: user?.role,      icon: 'fa-solid fa-user-tag' },
                    { label: 'Verification Status', value: user?.verified ? 'Verified' : 'Pending', icon: user?.verified ? 'fa-solid fa-circle-check' : 'fa-solid fa-clock', valueColor: user?.verified ? 'var(--color-success-text)' : 'var(--color-warning-text)' },
                    { label: 'Member Since',        value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long' }) : '—', icon: 'fa-solid fa-calendar' },
                  ].map((row) => (<div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted">
                        <i className={`${row.icon} text-xs w-4 text-center`} />
                        {row.label}
                      </span>
                      <span className="font-semibold capitalize text-primary" style={row.valueColor ? { color: row.valueColor } : {}}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading} className="btn-primary px-6 py-2.5">
                  {loading
                    ? <><i className="fa-solid fa-spinner animate-spin text-sm" /> Saving...</>
                    : <><i className="fa-solid fa-floppy-disk text-sm" /> Save Changes</>
                  }
                </button>
              </form>
            </div>

            {/* Danger zone */}
            <div
              className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-danger-bg)' }}>
              <div className="p-5" style={{ borderBottom: '1px solid var(--color-danger-bg)' }}>
                <h3 className="font-bold text-sm font-heading flex items-center gap-2" style={{ color: 'var(--color-danger-text)' }}>
                  <i className="fa-solid fa-triangle-exclamation" />Danger Zone
                </h3>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">Delete Account</p>
                  <p className="text-xs text-muted mt-0.5">Permanently remove your account and all associated data</p>
                </div>
                <button className="px-4 py-2 text-sm font-semibold rounded-xl border transition-colors" style={{ color: 'var(--color-danger-text)', borderColor: 'var(--color-danger-bg)' }}>
                  <i className="fa-solid fa-trash-can mr-1.5" />Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
