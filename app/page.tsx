import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SearchFilter from '@/components/property/SearchFilter'
import PropertyCard from '@/components/property/PropertyCard'
import PropertyTypeCard from '@/components/property/PropertyTypeCard'
import FeatureCard from '@/components/property/FeatureCard'
import { getFeaturedProperties } from '@/lib/api/properties'

const stats = [
  { value: '2,400+', label: 'Properties Listed',  icon: 'fa-solid fa-building' },
  { value: '1,800+', label: 'Happy Clients',       icon: 'fa-solid fa-users' },
  { value: '320+',   label: 'Verified Agents',     icon: 'fa-solid fa-id-badge' },
  { value: '₦12B+',  label: 'Total Transactions',  icon: 'fa-solid fa-money-bill-trend-up' },
]

const cities = [
  { name: 'Lagos',         count: '820+', image: 'https://images.unsplash.com/photo-1612450660900-e8f5671d48a0?w=400&q=80' },
  { name: 'Abuja',         count: '440+', image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80' },
  { name: 'Port Harcourt', count: '280+', image: 'https://images.unsplash.com/photo-1617634693600-5bf5a6ee0f48?w=400&q=80' },
  { name: 'Enugu',         count: '120+', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80' },
]

const propertyTypes = [
  { type: 'house',      label: 'Houses',     icon: 'fa-solid fa-house',        desc: 'Standalone homes & villas' },
  { type: 'apartment',  label: 'Apartments', icon: 'fa-solid fa-building',      desc: 'Modern flats & units' },
  { type: 'land',       label: 'Land',       icon: 'fa-solid fa-mountain-sun',  desc: 'Plots & development land' },
  { type: 'commercial', label: 'Commercial', icon: 'fa-solid fa-store',         desc: 'Offices & retail spaces' },
]

const features = [
  { icon: 'fa-solid fa-shield-halved', title: 'Secure Escrow',     desc: 'Funds held safely until ownership transfers' },
  { icon: 'fa-solid fa-circle-check',  title: 'Verified Listings', desc: 'Every property reviewed before going live' },
  { icon: 'fa-solid fa-comments',      title: 'Direct Messaging',  desc: 'Chat with agents in real time' },
  { icon: 'fa-solid fa-chart-line',    title: 'Market Insights',   desc: 'Data-driven analytics for smarter decisions' },
]

async function FeaturedProperties() {
  try {
    const properties = await getFeaturedProperties()
    if (!properties.length) return (
      <div
        className="col-span-3 text-center py-12"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <i className="fa-solid fa-house-chimney-crack text-4xl mb-3 block" />
        <p className="text-sm">Featured properties coming soon.</p>
      </div>
    )
    return <>{properties.slice(0, 6).map((p) => <PropertyCard key={p.id} property={p} />)}</>
  } catch {
    return (
      <div className="col-span-3 text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
        <p className="text-sm">Unable to load featured properties.</p>
      </div>
    )
  }
}

function PropertySkeletons() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--color-border-light)', backgroundColor: 'var(--color-surface)' }}
        >
          <div className="aspect-[4/3] shimmer" />
          <div className="p-4 space-y-2">
            <div className="h-4 shimmer rounded w-3/4" />
            <div className="h-3 shimmer rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  )
}

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=90"
            alt="Luxury home"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.18)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 border border-white/20"
              style={{ backgroundColor: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.9)' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--brand-400)' }} />
              Nigeria's Most Trusted Real Estate Platform
            </div>

            <h1
              className="font-heading font-extrabold text-white leading-[1.05] mb-6 text-balance"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.03em' }}
            >
              Find Your Perfect<br />
              <span style={{ color: 'var(--brand-300)' }}>Dream Home</span>
            </h1>

            <p
              className="text-lg sm:text-xl mb-10 max-w-xl leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              Browse thousands of verified listings across Nigeria. Buy, sell, or rent with confidence through our secure escrow platform.
            </p>

            <div className="max-w-2xl">
              <SearchFilter variant="hero" />
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8">
              {['No hidden fees', 'Verified listings', 'Secure payments'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <i className="fa-solid fa-check text-xs" style={{ color: 'var(--brand-400)' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span className="text-xs tracking-widest uppercase font-body">Scroll</span>
          <div className="w-px h-8 animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-14"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border-light)',
          borderBottom: '1px solid var(--color-border-light)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--brand-100)' }}
                >
                  <i className={`${stat.icon} text-sm`} style={{ color: 'var(--brand-600)' }} />
                </div>
                <p
                  className="text-3xl sm:text-4xl font-extrabold font-heading"
                  style={{ color: 'var(--brand-600)', letterSpacing: '-0.04em' }}
                >
                  {stat.value}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-500)' }}>
              Browse by Type
            </p>
            <h2 className="section-title">Explore Property Categories</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {propertyTypes.map((pt) => (
              <PropertyTypeCard key={pt.type} {...pt} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-500)' }}>Hand-picked</p>
              <h2 className="section-title">Featured Properties</h2>
              <p className="section-subtitle">Curated listings from our top verified agents</p>
            </div>
            <Link
              href="/listings"
              className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: 'var(--brand-500)' }}
            >
              View all
              <i className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense fallback={<PropertySkeletons />}>
              <FeaturedProperties />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20" style={{ backgroundColor: '#0D1117' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-400)' }}>
              Top Locations
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold font-heading text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              Popular Cities
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#8B949E' }}>
              Discover properties in Nigeria's fastest-growing cities
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link key={city.name} href={`/listings?location=${city.name}`}>
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4] group cursor-pointer">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)' }}
                  />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-bold text-lg font-heading">{city.name}</h3>
                    <p className="text-sm flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      <i className="fa-solid fa-building text-xs" />
                      {city.count} listings
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Restate */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--brand-500)' }}>
              Why Restate
            </p>
            <h2 className="section-title">Built for Trust</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Every feature is designed to protect buyers, empower agents, and ensure every transaction is safe.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20"
        style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border-light)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Buyer */}
            <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12" style={{ backgroundColor: 'var(--brand-500)' }}>
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"
                style={{ backgroundColor: 'var(--brand-300)' }}
              />
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <i className="fa-solid fa-house-circle-check text-white text-2xl" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-heading"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Looking to Buy or Rent?
                </h3>
                <p className="mb-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Explore thousands of verified listings and find your perfect property today.
                </p>
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-xl text-sm"
                  style={{ backgroundColor: '#fff', color: 'var(--brand-700)' }}
                >
                  Browse Properties
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            </div>

            {/* Agent */}
            <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12" style={{ backgroundColor: '#0D1117' }}>
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                style={{ backgroundColor: 'var(--brand-600)' }}
              />
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <i className="fa-solid fa-briefcase text-white text-2xl" />
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-heading"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Have a Property to List?
                </h3>
                <p className="mb-6 text-sm leading-relaxed" style={{ color: '#8B949E' }}>
                  Join 300+ verified agents. List your first property in minutes.
                </p>
                <Link
                  href="/auth/register?role=agent"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-xl text-sm text-white"
                  style={{ backgroundColor: 'var(--brand-500)' }}
                >
                  Become an Agent
                  <i className="fa-solid fa-arrow-right text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
