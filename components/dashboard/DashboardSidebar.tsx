'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn, getInitials } from '@/lib/utils'

interface NavItem { href: string; label: string; icon: string }

const buyerNav = (): NavItem[] => [
  { href: '/dashboard/buyer',              label: 'Overview',          icon: 'fa-solid fa-house-chimney' },
  { href: '/dashboard/buyer/favorites',    label: 'Saved Properties',  icon: 'fa-regular fa-heart' },
  { href: '/dashboard/buyer/transactions', label: 'Purchases',         icon: 'fa-solid fa-file-invoice' },
  { href: '/dashboard/buyer/messages',     label: 'Messages',          icon: 'fa-regular fa-message' },
  { href: '/dashboard/buyer/profile',      label: 'Profile',           icon: 'fa-regular fa-user' },
]

const agentNav = (): NavItem[] => [
  { href: '/dashboard/agent',              label: 'Overview',     icon: 'fa-solid fa-chart-line' },
  { href: '/dashboard/agent/listings',     label: 'My Listings',  icon: 'fa-solid fa-list-ul' },
  { href: '/dashboard/agent/new-listing',  label: 'Add Property', icon: 'fa-solid fa-plus' },
  { href: '/dashboard/agent/transactions', label: 'Earnings',     icon: 'fa-solid fa-wallet' },
  { href: '/dashboard/agent/messages',     label: 'Messages',     icon: 'fa-regular fa-message' },
  { href: '/dashboard/agent/profile',      label: 'Profile',      icon: 'fa-regular fa-user' },
]

const adminNav = (): NavItem[] => [
  { href: '/dashboard/admin',              label: 'Overview',          icon: 'fa-solid fa-gauge-high' },
  { href: '/dashboard/admin/approvals',    label: 'Pending Approvals', icon: 'fa-solid fa-circle-check' },
  { href: '/dashboard/admin/listings',     label: 'All Listings',      icon: 'fa-solid fa-building' },
  { href: '/dashboard/admin/transactions', label: 'Transactions',      icon: 'fa-solid fa-money-bill-transfer' },
  { href: '/dashboard/admin/users',        label: 'Manage Users',      icon: 'fa-solid fa-users' },
]

export default function DashboardSidebar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  const navItems = user?.role === 'admin' ? adminNav() : user?.role === 'agent' ? agentNav() : buyerNav()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const isActive = (href: string) => {
    const roots = ['/dashboard/admin', '/dashboard/agent', '/dashboard/buyer']
    if (roots.includes(href)) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col h-[calc(100vh-5rem)] sticky top-20">
      <div className="flex flex-col h-full rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}>

        {/* User info */}
        <div className="p-5" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }}>
              {user ? getInitials(user.name) : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-primary font-heading">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
            </div>
          </div>
          <span className="inline-block mt-3 px-2.5 py-1 text-xs font-semibold rounded-lg capitalize" style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }}>
            {user?.role} Account
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
                style={active
                  ? { backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }
                  : { color: 'var(--color-text-secondary)' }
                }
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{ backgroundColor: 'var(--brand-500)' }} />
                )}
                <i className={cn(item.icon, 'w-4 text-center text-xs', active ? 'text-[var(--brand-600)]' : 'text-muted')} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 space-y-0.5" style={{ borderTop: '1px solid var(--color-border-light)' }}>
          <Link
            href="/listings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-secondary"
          >
            <i className="fa-solid fa-arrow-up-right-from-square w-4 text-center text-xs text-muted" />
            Browse Properties
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ color: 'var(--color-danger-text)' }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center text-xs" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
