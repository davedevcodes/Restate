'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const PROPERTY_TYPES = [
  { value: 'house',      label: 'House',      icon: 'fa-solid fa-house' },
  { value: 'apartment',  label: 'Apartment',  icon: 'fa-solid fa-building' },
  { value: 'land',       label: 'Land',       icon: 'fa-solid fa-mountain-sun' },
  { value: 'commercial', label: 'Commercial', icon: 'fa-solid fa-store' },
]

interface SearchFilterProps { variant?: 'hero' | 'sidebar' }

export default function SearchFilter({ variant = 'hero' }: SearchFilterProps) {
  const router = useRouter()

  const [location, setLocation]         = useState('')
  const [type, setType]                 = useState('')
  const [listingType, setListingType]   = useState('sale')
  const [minPrice, setMinPrice]         = useState('')
  const [maxPrice, setMaxPrice]         = useState('')
  const [bedrooms, setBedrooms]         = useState('')

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const params = new URLSearchParams()
    if (location)    params.set('location', location)
    if (type)        params.set('type', type)
    if (listingType) params.set('listing', listingType)
    if (minPrice)    params.set('min_price', minPrice)
    if (maxPrice)    params.set('max_price', maxPrice)
    if (bedrooms)    params.set('bedrooms', bedrooms)
    router.push(`/listings?${params.toString()}`)
  }

  const clearAll = () => {
    setLocation(''); setType(''); setListingType('sale')
    setMinPrice(''); setMaxPrice(''); setBedrooms('')
    router.push('/listings')
  }

  if (variant === 'hero') {
    return (
      <div
        className="rounded-2xl p-2 shadow-modal"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Tab toggle */}
        <div className="flex rounded-xl p-1 mb-3 gap-1" style={{ backgroundColor: 'var(--color-surface-2)' }}>
          {['sale', 'rent'].map((lt) => (<button key={lt} type="button" onClick={() => setListingType(lt)}
              className="flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all capitalize"
              style={listingType === lt
                ? { backgroundColor: 'var(--color-surface)', color: 'var(--color-text-primary)', boxShadow: 'var(--shadow-card)' }
                : { color: 'var(--color-text-secondary)' }
              }
            >
              For {lt.charAt(0).toUpperCase() + lt.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          {/* Location */}
          <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <i className="fa-solid fa-location-dot text-sm shrink-0" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="City, State or Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1"
              style={{ color: 'var(--color-text-primary)' }}
            />
          </div>

          {/* Property type */}
          <div className="sm:w-44 flex items-center gap-2 px-4 py-3 rounded-xl" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <i className="fa-solid fa-building-columns text-sm shrink-0" style={{ color: 'var(--color-text-muted)' }} />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1 cursor-pointer"
              style={{ color: type ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="px-6 py-3 font-semibold rounded-xl transition-colors flex items-center gap-2 justify-center text-sm text-white"
            style={{ backgroundColor: 'var(--brand-500)' }}
          >
            <i className="fa-solid fa-magnifying-glass text-sm" />
            Search
          </button>
        </form>
      </div>
    )
  }

  /* Sidebar variant */
  return (
    <div className="rounded-2xl p-5 space-y-5 shadow-card" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}>
      <h3 className="font-semibold text-primary font-heading">Filter Properties</h3>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Location</label>
        <div className="relative">
          <i className="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--color-text-muted)' }} />
          <input type="text" placeholder="City or state..." value={location} onChange={(e) => setLocation(e.target.value)} className="input-base pl-9" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Listing Type</label>
        <div className="flex gap-2">
          {['sale', 'rent'].map((lt) => (<button key={lt} type="button" onClick={() => setListingType(lt === listingType ? '' : lt)}
              className="flex-1 py-2 text-sm rounded-xl border transition-all font-medium capitalize"
              style={listingType === lt
                ? { borderColor: 'var(--brand-400)', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }
                : { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }
              }
            >
              {lt.charAt(0).toUpperCase() + lt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Property Type</label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((t) => (<button key={t.value} type="button" onClick={() => setType(type === t.value ? '' : t.value)}
              className="py-2 px-3 text-xs rounded-xl border transition-all font-medium flex items-center gap-1.5"
              style={type === t.value
                ? { borderColor: 'var(--brand-400)', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }
                : { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }
              }
            >
              <i className={`${t.icon} text-xs`} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Price Range (₦)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="flex-1 input-base" />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="flex-1 input-base" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Min Bedrooms</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, '5+'].map((num) => (<button key={num} type="button" onClick={() => setBedrooms(bedrooms === String(num) ? '' : String(num))}
              className="flex-1 py-2 text-xs rounded-xl border transition-all font-medium"
              style={bedrooms === String(num)
                ? { borderColor: 'var(--brand-400)', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }
                : { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }
              }
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSearch}
        className="w-full py-3 font-semibold rounded-xl text-sm text-white transition-colors"
        style={{ backgroundColor: 'var(--brand-500)' }}
      >
        <i className="fa-solid fa-filter mr-2" />
        Apply Filters
      </button>

      <button
        type="button"
        onClick={clearAll}
        className="w-full py-2 text-sm transition-colors text-muted hover:text-secondary"
      >
        <i className="fa-solid fa-rotate-left mr-1.5 text-xs" />
        Clear all filters
      </button>
    </div>
  )
}
