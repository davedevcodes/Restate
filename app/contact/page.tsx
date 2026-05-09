'use client'

import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const contactInfo = [
  { icon: 'fa-solid fa-location-dot', label: 'Address', value: 'Plot 4B, Ozumba Mbadiwe, Lagos Island, Lagos' },
  { icon: 'fa-solid fa-envelope',     label: 'Email',   value: 'hello@restate.ng' },
  { icon: 'fa-solid fa-phone',        label: 'Phone',   value: '+234 800 RESTATE' },
  { icon: 'fa-solid fa-clock',        label: 'Hours',   value: 'Mon-Fri: 8AM - 6PM WAT' },
]

const subjects = ['Technical Support','Listing Issue','Payment Question','Report Fraud','Partnership Inquiry','Other']

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success("Message sent! We'll get back to you within 24 hours.")
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 bg-surface">
        <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-500)' }}>Contact Us</p>
            <h1 className="text-4xl font-extrabold font-heading text-primary mb-4" style={{ letterSpacing: '-0.03em' }}>Get In Touch</h1>
            <p className="text-sm max-w-xl mx-auto text-secondary leading-relaxed">Have a question, feedback, or need support? Our team is here to help.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="rounded-2xl p-5 flex items-start gap-4 shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--brand-100)' }}>
                    <i className={info.icon + ' text-sm'} style={{ color: 'var(--brand-600)' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-0.5 text-muted">{info.label}</p>
                    <p className="text-sm font-medium text-primary">{info.value}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl overflow-hidden aspect-video flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border-light)' }}>
                <div className="text-center text-muted">
                  <i className="fa-solid fa-map-location-dot text-4xl mb-2 block" />
                  <p className="text-xs">Google Maps</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-8 shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                <h2 className="font-extrabold font-heading text-primary text-xl mb-6" style={{ letterSpacing: '-0.02em' }}>Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-secondary">Full Name *</label>
                      <div className="relative">
                        <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted" />
                        <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" className="input-base pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-secondary">Email *</label>
                      <div className="relative">
                        <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted" />
                        <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@email.com" className="input-base pl-10" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-secondary">Subject</label>
                    <div className="relative">
                      <i className="fa-solid fa-tag absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-muted" />
                      <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input-base pl-10">
                        <option value="">Select a topic...</option>
                        {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5 text-secondary">Message *</label>
                    <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Describe your issue or inquiry..." rows={6} className="input-base resize-none" />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base justify-center">
                    {loading
                      ? <><i className="fa-solid fa-spinner animate-spin text-sm" /> Sending...</>
                      : <><i className="fa-solid fa-paper-plane text-sm" /> Send Message</>
                    }
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
