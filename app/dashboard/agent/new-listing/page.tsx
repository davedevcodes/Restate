'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import ImageUpload from '@/components/property/ImageUpload'
import { useAuth } from '@/lib/auth-context'
import { createProperty } from '@/lib/api/properties'
import { AMENITIES_LIST, NIGERIAN_STATES } from '@/lib/utils'
import { CloudinaryUploadResult } from '@/lib/cloudinary'
import toast from 'react-hot-toast'

const PTYPES = ['house', 'apartment', 'land', 'commercial'] as const
const LTYPES = ['sale', 'rent'] as const

// Defined OUTSIDE the page component so it is never recreated on re-render
function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-6 shadow-card"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
    >
      <h2
        className="font-extrabold font-heading text-primary mb-5 flex items-center gap-2"
        style={{ letterSpacing: '-0.02em' }}
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }}
        >
          {num}
        </span>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function NewListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<CloudinaryUploadResult[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    city: '',
    state: '',
    country: 'Nigeria',
    property_type: 'house' as typeof PTYPES[number],
    listing_type: 'sale' as typeof LTYPES[number],
    bedrooms: '3',
    bathrooms: '2',
    area_sqft: '',
    video_url: '',
  })

  const u = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }))

  const toggleAmenity = (a: string) =>
    setAmenities((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!form.title || !form.description || !form.price || !form.city || !form.state) {
      toast.error('Please fill all required fields')
      return
    }
    if (!images.length) {
      toast.error('Please upload at least one image')
      return
    }
    setLoading(true)
    try {
      await createProperty({
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area_sqft: form.area_sqft ? Number(form.area_sqft) : undefined,
        amenities,
        images: images.map((i) => ({ url: i.secure_url, public_id: i.public_id, width: i.width, height: i.height })),
        agent_id: user.id,
      })
      toast.success('Property submitted for review!')
      router.push('/dashboard/agent/listings')
    } catch {
      toast.error('Failed to create listing. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex gap-8">
          <DashboardSidebar />
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold font-heading text-primary" style={{ letterSpacing: '-0.02em' }}>
                Add New Property
              </h1>
              <p className="text-sm mt-1 text-muted">
                Fill in the details. Your listing will be reviewed before going live.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. Basic Info */}
              <Section num={1} title="Basic Information">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => u('title', e.target.value)}
                      placeholder="e.g. Modern 4-Bedroom Duplex in Lekki Phase 1"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">
                      Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => u('description', e.target.value)}
                      placeholder="Describe the property in detail..."
                      rows={5}
                      className="input-base resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">
                        Property Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {PTYPES.map((t) => (<button key={t}
                            type="button"
                            onClick={() => u('property_type', t)}
                            className="py-2.5 px-3 rounded-xl border text-sm font-semibold capitalize transition-all"
                            style={
                              form.property_type === t
                                ? { borderColor: 'var(--brand-400)', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }
                                : { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }
                            }
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">
                        Listing Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {LTYPES.map((t) => (<button key={t}
                            type="button"
                            onClick={() => u('listing_type', t)}
                            className="py-2.5 px-3 rounded-xl border text-sm font-semibold capitalize transition-all"
                            style={
                              form.listing_type === t
                                ? { borderColor: 'var(--brand-400)', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }
                                : { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }
                            }
                          >
                            For {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              {/* 2. Pricing & Location */}
              <Section num={2} title="Pricing & Location">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">Price (₦) *</label>
                    <input type="number" value={form.price} onChange={(e) => u('price', e.target.value)} placeholder="e.g. 85000000" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">Area (sq ft)</label>
                    <input type="number" value={form.area_sqft} onChange={(e) => u('area_sqft', e.target.value)} placeholder="e.g. 2500" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">Specific Location *</label>
                    <input type="text" value={form.location} onChange={(e) => u('location', e.target.value)} placeholder="e.g. Lekki Phase 1" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">City *</label>
                    <input type="text" value={form.city} onChange={(e) => u('city', e.target.value)} placeholder="e.g. Lagos" className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">State *</label>
                    <select value={form.state} onChange={(e) => u('state', e.target.value)} className="input-base">
                      <option value="">Select State</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-secondary">Country</label>
                    <input type="text" value="Nigeria" readOnly className="input-base" style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }} />
                  </div>
                </div>
              </Section>

              {/* 3. Property Details */}
              {form.property_type !== 'land' && (
                <Section num={3} title="Property Details">
                  <div className="grid grid-cols-2 gap-6">
                    {[{ label: 'Bedrooms', field: 'bedrooms' }, { label: 'Bathrooms', field: 'bathrooms' }].map((f) => (<div key={f.field}>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-secondary">{f.label}</label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => u(f.field, String(Math.max(0, Number((form as any)[f.field]) - 1)))}
                            className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-lg transition-colors text-secondary"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-extrabold font-heading text-primary text-lg">
                            {(form as any)[f.field]}
                          </span>
                          <button
                            type="button"
                            onClick={() => u(f.field, String(Number((form as any)[f.field]) + 1))}
                            className="w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-lg transition-colors text-secondary"
                            style={{ borderColor: 'var(--color-border)' }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* 4. Amenities */}
              <Section num={4} title="Amenities">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {AMENITIES_LIST.map((a) => (<button key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className="py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center gap-1.5"
                      style={
                        amenities.includes(a)
                          ? { borderColor: 'var(--brand-400)', backgroundColor: 'var(--brand-100)', color: 'var(--brand-700)' }
                          : { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }
                      }
                    >
                      {amenities.includes(a) && <i className="fa-solid fa-check text-xs" />}
                      {a}
                    </button>
                  ))}
                </div>
              </Section>

              {/* 5. Images */}
              <Section num={5} title="Property Images *">
                <p className="text-xs text-muted mb-4">
                  <i className="fa-solid fa-circle-info mr-1.5" />
                  Upload high-quality images. The first image is the main cover photo.
                </p>
                <ImageUpload value={images} onChange={setImages} maxImages={10} />
              </Section>

              {/* 6. Video */}
              <div
                className="rounded-2xl p-6 shadow-card"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
              >
                <h2
                  className="font-extrabold font-heading text-primary mb-4 flex items-center gap-2"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
                  >
                    6
                  </span>
                  Video Tour
                  <span className="text-xs font-normal text-muted ml-1">(optional)</span>
                </h2>
                <div className="relative">
                  <i className="fa-brands fa-youtube absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#ff0000' }} />
                  <input
                    type="url"
                    value={form.video_url}
                    onChange={(e) => u('video_url', e.target.value)}
                    placeholder="YouTube or Vimeo URL"
                    className="input-base pl-10"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-secondary px-6 py-3"
                >
                  <i className="fa-solid fa-arrow-left text-sm" /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3 justify-center text-base"
                >
                  {loading
                    ? <><i className="fa-solid fa-spinner animate-spin text-sm" /> Submitting...</>
                    : <><i className="fa-solid fa-paper-plane text-sm" /> Submit Listing for Review</>
                  }
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
