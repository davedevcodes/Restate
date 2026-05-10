import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <i className="fa-solid fa-house-circle-exclamation text-4xl" style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <h1 className="text-7xl font-extrabold font-heading text-primary mb-2" style={{ letterSpacing: '-0.05em' }}>404</h1>
          <h2 className="text-2xl font-bold font-heading text-primary mb-4">Page Not Found</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Looks like this property has been taken off the market. The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary px-8 py-3 text-base justify-center">
              <i className="fa-solid fa-house text-sm" />
              Back to Home
            </Link>
            <Link href="/listings" className="btn-secondary px-8 py-3 text-base justify-center">
              <i className="fa-solid fa-building text-sm" />
              Browse Properties
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
