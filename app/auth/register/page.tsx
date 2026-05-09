'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import toast from 'react-hot-toast'

type Role = 'buyer' | 'agent'

const roleOptions = [
  {
    value: 'buyer' as Role,
    label: 'Buy or Rent Property',
    desc: 'Browse listings, save favorites, and purchase properties safely.',
    icon: 'fa-solid fa-house-circle-check',
  },
  {
    value: 'agent' as Role,
    label: 'List & Sell Properties',
    desc: 'Create listings, manage clients, and earn commissions.',
    icon: 'fa-solid fa-briefcase',
  },
]

const highlights = [
  { icon: 'fa-solid fa-shield-halved', text: 'Secure Escrow Payments' },
  { icon: 'fa-solid fa-circle-check',  text: 'Verified Listings Only' },
  { icon: 'fa-regular fa-comments',    text: 'Direct Agent Messaging' },
  { icon: 'fa-solid fa-chart-line',    text: 'Market Analytics' },
]

export default function RegisterPage() {
  const [step, setStep]               = useState<1 | 2>(1)
  const [role, setRole]               = useState<Role>('buyer')
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirm, setConfirm]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signUp } = useAuth()
  const router       = useRouter()
  const searchParams = useSearchParams()

  const defaultRole = searchParams.get('role') as Role
  if (defaultRole === 'agent' && role !== 'agent') setRole('agent')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirm) { toast.error('Please fill all fields'); return }
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    if (password.length < 8)  { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await signUp(email, password, name, role)
    if (error) { toast.error(error); setLoading(false) }
    else {
      toast.success('Account created!')
      router.push(role === 'agent' ? '/dashboard/agent' : '/dashboard/buyer')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Left */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-14 py-12">
        <div className="w-full max-w-md mx-auto">

          <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--brand-500)' }}>
              <i className="fa-solid fa-house text-white text-sm" />
            </div>
            <span className="text-xl font-bold font-heading text-primary">
              Re<span style={{ color: 'var(--brand-500)' }}>state</span>
            </span>
          </Link>

          <h1 className="text-3xl font-extrabold font-heading text-primary mb-1" style={{ letterSpacing: '-0.03em' }}>Create account</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>Join thousands of Nigerians on Restate</p>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all`}
                  style={step === s
                    ? { backgroundColor: '#0D1117', color: '#fff' }
                    : s < step
                    ? { backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success-text)' }
                    : { backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }
                  }
                >
                  {s < step ? <i className="fa-solid fa-check text-xs" /> : s}
                </div>
                <span className="text-xs font-medium" style={{ color: step === s ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                  {s === 1 ? 'Account Type' : 'Your Details'}
                </span>
                {s < 2 && <div className="flex-1 h-px ml-2" style={{ backgroundColor: 'var(--color-border)' }} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
                <p className="text-sm font-medium mb-4 text-secondary">I want to...</p>
                <div className="space-y-3 mb-8">
                  {roleOptions.map((opt) => (
                    <button key={opt.value} onClick={() => setRole(opt.value)}
                      className="w-full p-5 rounded-2xl border-2 text-left transition-all"
                      style={role === opt.value
                        ? { borderColor: 'var(--brand-500)', backgroundColor: 'var(--brand-100)' }
                        : { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }
                      }
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                          style={{ backgroundColor: role === opt.value ? 'var(--brand-500)' : 'var(--color-surface-2)' }}>
                          <i className={`${opt.icon} text-base`} style={{ color: role === opt.value ? '#fff' : 'var(--color-text-muted)' }} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm font-heading mb-0.5" style={{ color: role === opt.value ? 'var(--brand-700)' : 'var(--color-text-primary)' }}>
                            {opt.label}
                          </h3>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{opt.desc}</p>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-0.5"
                          style={{ borderColor: role === opt.value ? 'var(--brand-500)' : 'var(--color-border)', backgroundColor: role === opt.value ? 'var(--brand-500)' : 'transparent' }}>
                          {role === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="w-full btn-primary py-3 text-base justify-center">
                  Continue
                  <i className="fa-solid fa-arrow-right text-sm" />
                </button>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-secondary">Full Name</label>
                    <div className="relative">
                      <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-text-muted)' }} />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Chidi Okeke" className="input-base pl-10" autoComplete="name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-secondary">Email address</label>
                    <div className="relative">
                      <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-text-muted)' }} />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com" className="input-base pl-10" autoComplete="email" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-secondary">Password</label>
                    <div className="relative">
                      <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-text-muted)' }} />
                      <input type={showPassword ? 'text' : 'password'} value={password}
                        onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                        className="input-base pl-10 pr-10" autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }}>
                        <i className={`text-xs ${showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}`} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-secondary">Confirm Password</label>
                    <div className="relative">
                      <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-text-muted)' }} />
                      <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Repeat password" className="input-base pl-10" autoComplete="new-password" />
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    By creating an account, you agree to our <Link href="#" style={{ color: 'var(--brand-500)' }}>Terms</Link> and <Link href="#" style={{ color: 'var(--brand-500)' }}>Privacy Policy</Link>.
                  </p>
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary px-5">
                      <i className="fa-solid fa-arrow-left text-xs" />
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 justify-center text-base">
                      {loading
                        ? <><i className="fa-solid fa-spinner animate-spin text-sm" /> Creating...</>
                        : `Create ${role === 'agent' ? 'Agent' : ''} Account`
                      }
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold" style={{ color: 'var(--brand-500)' }}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex w-5/12 xl:w-1/2 flex-col justify-center items-center relative overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=90')" }} />
        <div className="relative text-white text-center px-12 max-w-sm">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--brand-500)' }}>
            <i className="fa-solid fa-trophy text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 font-heading" style={{ letterSpacing: '-0.03em' }}>
            Join Nigeria's #1 Real Estate Platform
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#8B949E' }}>
            Access thousands of verified listings, secure escrow payments, and connect with trusted agents across the country.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {highlights.map((h) => (
              <div key={h.text} className="p-4 rounded-xl text-left" style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <i className={`${h.icon} text-sm mb-2 block`} style={{ color: 'var(--brand-400)' }} />
                <p className="text-xs font-medium leading-snug">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
