'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

const demoAccounts = [
  { role: 'Admin', email: 'admin@restate.ng',  icon: 'fa-solid fa-shield-halved' },
  { role: 'Agent', email: 'agent@restate.ng',  icon: 'fa-solid fa-id-badge' },
  { role: 'Buyer', email: 'buyer@restate.ng',  icon: 'fa-solid fa-user' },
]

export default function LoginPage() {
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [loading, setLoading]           = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const router     = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get('redirect') || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { toast.error(error); setLoading(false) }
    else {
      toast.success('Welcome back!')
      setTimeout(() => { router.push(redirectTo || '/'); router.refresh() }, 400)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Left: form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-14 py-12">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--brand-500)' }}>
              <i className="fa-solid fa-house text-white text-sm" />
            </div>
            <span className="text-xl font-bold font-heading text-primary">
              Re<span style={{ color: 'var(--brand-500)' }}>state</span>
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold font-heading text-primary mb-1" style={{ letterSpacing: '-0.03em' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>Sign in to your Restate account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Email address</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-text-muted)' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-base pl-10" autoComplete="email" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Password</label>
                <Link href="#" className="text-xs font-medium" style={{ color: 'var(--brand-500)' }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-text-muted)' }} />
                <input type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className="input-base pl-10 pr-10" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}>
                  <i className={`text-xs ${showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}`} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base justify-center mt-2">
              {loading
                ? <><i className="fa-solid fa-spinner animate-spin text-sm" /> Signing in...</>
                : <><i className="fa-solid fa-arrow-right-to-bracket text-sm" /> Sign In</>
              }
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link href="/auth/register" className="font-semibold" style={{ color: 'var(--brand-500)' }}>Create one free</Link>
          </p>

          {/* Demo accounts */}
          <div className="mt-8 p-4 rounded-2xl" style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid var(--color-border-light)' }}>
            <p className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ color: 'var(--color-warning-text)' }}>
              <i className="fa-solid fa-flask text-xs" />
              Demo Accounts — password: password123
            </p>
            <div className="space-y-1.5">
              {demoAccounts.map((d) => (
                <button key={d.role} onClick={() => { setEmail(d.email); setPassword('password123') }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-xs font-medium"
                  style={{ color: 'var(--color-warning-text)' }}
                >
                  <i className={`${d.icon} w-4 text-center`} />
                  <span className="font-bold w-10">{d.role}:</span>
                  <span className="font-mono">{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right: image panel */}
      <div className="hidden lg:block w-5/12 xl:w-1/2 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=90')" }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,10,20,0.7) 0%, rgba(10,10,20,0.4) 100%)' }} />
        <div className="relative flex flex-col justify-end h-full p-12 text-white">
          <div className="mb-8">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star text-sm" style={{ color: 'var(--brand-400)' }} />)}
            </div>
            <blockquote className="text-xl font-medium leading-relaxed mb-4 font-heading">
              "Restate made selling my property effortless. The escrow system gave my buyer complete confidence."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm font-heading" style={{ backgroundColor: 'var(--brand-500)' }}>AO</div>
              <div>
                <p className="font-semibold text-sm">Adaeze Okonkwo</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>Property Agent, Lagos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
