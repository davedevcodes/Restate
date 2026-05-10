import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const team = [
  { name: 'Emeka Okonkwo', role: 'CEO & Co-founder', initials: 'EO' },
  { name: 'Amara Nwosu',   role: 'CTO & Co-founder', initials: 'AN' },
  { name: 'Chisom Eze',    role: 'Head of Operations', initials: 'CE' },
  { name: 'Bode Adeyemi',  role: 'Head of Growth',    initials: 'BA' },
]

const values = [
  { icon: 'fa-solid fa-shield-halved', title: 'Trust & Security',  desc: 'Every transaction is protected by our escrow system and verified by our team.' },
  { icon: 'fa-solid fa-circle-check',  title: 'Verified Listings', desc: 'All properties are reviewed and approved before going live on our platform.' },
  { icon: 'fa-solid fa-eye',           title: 'Transparency',      desc: 'No hidden fees. What you see is what you pay — full price clarity at every step.' },
  { icon: 'fa-solid fa-handshake',     title: 'Partnership',       desc: 'We work as a team with agents and buyers to create win-win outcomes.' },
]

const stats = [
  { value: '2,400+', label: 'Properties Listed' },
  { value: '₦12B+',  label: 'Safely Transacted' },
  { value: '320+',   label: 'Verified Agents' },
  { value: '36',     label: 'States Covered' },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden" style={{ backgroundColor: '#0D1117' }}>
          <div className="absolute inset-0 opacity-20">
            <Image src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80" alt="" fill className="object-cover" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--brand-400)' }}>About Us</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white mb-6 text-balance" style={{ letterSpacing: '-0.03em' }}>
              Building Nigeria&apos;s Most Trusted<br />Real Estate Platform
            </h1>
            <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              We started Restate because Nigerians deserved a safer, more transparent way to buy and sell property. No more cash under the table. No more scams.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--brand-500)' }}>Our Mission</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-primary mb-6" style={{ letterSpacing: '-0.03em' }}>
                  Making Property Transactions Safe for Every Nigerian
                </h2>
                <p className="text-sm leading-relaxed mb-5 text-secondary">
                  Real estate fraud costs Nigerians billions of naira every year. Restate was built to change that. Our escrow-first model ensures every payment is protected until ownership is properly transferred.
                </p>
                <p className="text-sm leading-relaxed mb-8 text-secondary">
                  We connect verified agents with genuine buyers across all 36 states, providing tools that make listing, discovering, and transacting property as easy and safe as it should be.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-3xl font-extrabold font-heading" style={{ color: 'var(--brand-500)', letterSpacing: '-0.04em' }}>{s.value}</p>
                      <p className="text-xs mt-1 text-muted">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" alt="Team working" fill className="object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-2xl p-5 shadow-modal" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                  <p className="text-3xl font-extrabold font-heading" style={{ color: 'var(--brand-500)', letterSpacing: '-0.04em' }}>98%</p>
                  <p className="text-xs text-muted">Customer satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-surface" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-500)' }}>What We Stand For</p>
              <h2 className="section-title">Our Core Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl p-6 text-center shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--brand-100)' }}>
                    <i className={`${v.icon} text-lg`} style={{ color: 'var(--brand-600)' }} />
                  </div>
                  <h3 className="font-bold text-sm font-heading text-primary mb-2">{v.title}</h3>
                  <p className="text-xs leading-relaxed text-muted">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-500)' }}>The People</p>
              <h2 className="section-title">Meet Our Team</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((m) => (
                <div key={m.name} className="text-center">
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center font-extrabold text-xl font-heading shadow-card" style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }}>
                    {m.initials}
                  </div>
                  <h3 className="font-bold text-sm font-heading text-primary">{m.name}</h3>
                  <p className="text-xs mt-0.5 text-muted">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{ backgroundColor: 'var(--brand-500)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 font-heading" style={{ letterSpacing: '-0.03em' }}>Ready to Get Started?</h2>
            <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Join thousands of Nigerians transacting property safely on Restate.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/listings" className="px-8 py-4 font-bold rounded-xl text-sm transition-colors" style={{ backgroundColor: '#fff', color: 'var(--brand-700)' }}>
                <i className="fa-solid fa-building mr-2" />Browse Properties
              </Link>
              <Link href="/auth/register" className="px-8 py-4 font-bold rounded-xl text-sm text-white transition-colors border border-white/30" style={{ backgroundColor: 'var(--brand-600)' }}>
                <i className="fa-solid fa-user-plus mr-2" />Create Account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
