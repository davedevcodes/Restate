'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import { cn, getInitials } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/listings', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()

  const isHome = pathname === '/'
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setDropdownOpen(false)
  }

  const getDashboardLink = () => {
    if (!user) return '/auth/login'
    if (user.role === 'admin') return '/dashboard/admin'
    if (user.role === 'agent') return '/dashboard/agent'
    return '/dashboard/buyer'
  }

  return (
    <header
      className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', isTransparent ? 'bg-transparent' : 'backdrop-blur-md border-b shadow-nav')}
      style={isTransparent ? {} : { backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-light)' }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--brand-500)' }}>
              <i className="fa-solid fa-house text-white text-sm" />
            </div>
            <span className={cn('text-xl font-bold tracking-tight font-heading', isTransparent ? 'text-white' : 'text-primary')}>
              Re<span style={{ color: isTransparent ? '#EFB86A' : 'var(--brand-500)' }}>state</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors relative group pb-0.5',
                  isTransparent
                    ? pathname === link.href ? 'text-brand-300' : 'text-white/80 hover:text-white'
                    : pathname === link.href ? 'text-[var(--brand-500)]' : 'text-secondary hover:text-primary'
                )}
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full transition-transform"
                  style={{
                    backgroundColor: 'var(--brand-500)',
                    transform: pathname === link.href ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                  }}
                />
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className={cn('w-9 h-9 rounded-xl flex items-center justify-center transition-all', isTransparent ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-secondary hover:text-primary hover:bg-card-2')}
              aria-label="Toggle theme"
            >
              <i className={cn('text-sm', theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon')} />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={cn('flex items-center gap-2 px-3 py-2 rounded-xl transition-colors', isTransparent ? 'hover:bg-white/10' : 'hover:bg-card-2')}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }}>
                    {getInitials(user.name)}
                  </div>
                  <span className={cn('text-sm font-medium', isTransparent ? 'text-white' : 'text-primary')}>{user.name.split(' ')[0]}</span>
                  <i className={cn('text-xs transition-transform', dropdownOpen ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down', isTransparent ? 'text-white/60' : 'text-muted')} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden"
                      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-modal)' }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
                        <p className="text-sm font-semibold text-primary">{user.name}</p>
                        <p className="text-xs text-muted mt-0.5">{user.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 text-xs rounded-full font-medium capitalize" style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }}>
                          {user.role}
                        </span>
                      </div>
                      <div className="p-1.5">
                        <Link href={getDashboardLink()} className="flex items-center gap-2.5 px-3 py-2 text-sm text-secondary rounded-lg transition-colors hover:bg-card-2" onClick={() => setDropdownOpen(false)}>
                          <i className="fa-solid fa-gauge w-4 text-center text-muted text-xs" />
                          Dashboard
                        </Link>
                        <div className="h-px my-1" style={{ backgroundColor: 'var(--color-border-light)' }} />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-[var(--color-danger-bg)]"
                          style={{ color: 'var(--color-danger-text)' }}
                        >
                          <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center text-xs" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className={cn('text-sm font-medium transition-colors px-4 py-2 rounded-lg', isTransparent ? 'text-white/80 hover:text-white' : 'text-secondary hover:text-primary')}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm text-white" style={{ backgroundColor: 'var(--brand-500)' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-1">
            <button onClick={toggle} className={cn('w-9 h-9 rounded-xl flex items-center justify-center', isTransparent ? 'text-white/70' : 'text-secondary')}>
              <i className={cn('text-sm', theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon')} />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className={cn('w-9 h-9 rounded-lg flex items-center justify-center', isTransparent ? 'text-white' : 'text-secondary')}>
              <i className={cn('text-base', mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars')} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b overflow-hidden"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border-light)' }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={pathname === link.href ? { backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' } : { color: 'var(--color-text-secondary)' }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--color-border-light)' }}>
                {user ? (
                  <>
                    <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-secondary hover:bg-card-2">
                      <i className="fa-solid fa-gauge text-muted text-xs" /> Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ color: 'var(--color-danger-text)' }}>
                      <i className="fa-solid fa-arrow-right-from-bracket text-xs" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-center text-secondary hover:bg-card-2">Sign In</Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white text-center" style={{ backgroundColor: 'var(--brand-500)' }}>Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
