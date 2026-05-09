import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SearchFilter from '@/components/property/SearchFilter'
import PropertyCard from '@/components/property/PropertyCard'
import { getProperties } from '@/lib/api/properties'
import { PropertyFilters } from '@/types'

interface ListingsPageProps {
  searchParams: { location?: string; type?: string; listing?: string; min_price?: string; max_price?: string; bedrooms?: string; sort?: string; page?: string }
}

async function PropertyGrid({ searchParams }: ListingsPageProps) {
  const filters: PropertyFilters = {
    location: searchParams.location,
    property_type: searchParams.type as any,
    listing_type: searchParams.listing as any,
    min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
    max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
    bedrooms: searchParams.bedrooms ? Number(searchParams.bedrooms) : undefined,
    sort: searchParams.sort as any,
  }
  const page = Number(searchParams.page) || 1
  try {
    const { data: properties, count, total_pages } = await getProperties(filters, page, 12)
    if (!properties.length) return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-2)' }}>
          <i className="fa-solid fa-building-circle-xmark text-3xl text-muted" />
        </div>
        <h3 className="text-xl font-bold font-heading text-primary mb-2">No properties found</h3>
        <p className="text-sm text-muted mb-6">Try adjusting your filters or searching in a different location.</p>
        <a href="/listings" className="btn-primary">Clear Filters</a>
      </div>
    )
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted">
            Showing <span className="font-semibold text-primary">{(page-1)*12+1}–{Math.min(page*12,count)}</span> of <span className="font-semibold text-primary">{count}</span> properties
          </p>
          <select className="input-base text-sm w-auto px-3 py-2">
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
        {total_pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {page > 1 && (
              <a href={`/listings?${new URLSearchParams({ ...searchParams, page: String(page-1) })}`} className="btn-secondary px-4 py-2 text-sm">
                <i className="fa-solid fa-arrow-left text-xs" /> Prev
              </a>
            )}
            {Array.from({ length: total_pages }, (_, i) => i+1).map((p) => (
              <a key={p} href={`/listings?${new URLSearchParams({ ...searchParams, page: String(p) })}`}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors"
                style={p === page
                  ? { backgroundColor: 'var(--brand-500)', color: '#fff' }
                  : { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }
                }
              >{p}</a>
            ))}
            {page < total_pages && (
              <a href={`/listings?${new URLSearchParams({ ...searchParams, page: String(page+1) })}`} className="btn-secondary px-4 py-2 text-sm">
                Next <i className="fa-solid fa-arrow-right text-xs" />
              </a>
            )}
          </div>
        )}
      </div>
    )
  } catch {
    return <div className="text-center py-16 text-muted"><p className="text-sm">Failed to load properties. Please try again.</p></div>
  }
}

export default function ListingsPage({ searchParams }: ListingsPageProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-20">
        <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-extrabold font-heading text-primary mb-1" style={{ letterSpacing: '-0.02em' }}>
              {searchParams.location ? `Properties in ${searchParams.location}` : 'All Properties'}
            </h1>
            <p className="text-sm text-muted">Browse verified listings across Nigeria</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <aside className="w-72 shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <Suspense><SearchFilter variant="sidebar" /></Suspense>
              </div>
            </aside>
            <div className="flex-1 min-w-0">
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border-light)', backgroundColor: 'var(--color-surface)' }}>
                      <div className="aspect-[4/3] shimmer" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 shimmer rounded w-3/4" />
                        <div className="h-3 shimmer rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              }>
                <PropertyGrid searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
