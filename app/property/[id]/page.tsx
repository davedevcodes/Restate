'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getPropertyById } from '@/lib/api/properties'
import { addFavorite, removeFavorite, checkIsFavorite, sendMessage, createTransaction } from '@/lib/api/transactions'
import { useAuth } from '@/lib/auth-context'
import { Property } from '@/types'
import { formatPrice, formatDate, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [property, setProperty] = useState<Property|null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showBuy, setShowBuy] = useState(false)
  const [message, setMessage] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [buying, setBuying] = useState(false)

  useEffect(() => {
    const load = async () => {
      const data = await getPropertyById(id as string)
      setProperty(data)
      setLoading(false)
      if (data && user) { const fav = await checkIsFavorite(user.id, data.id); setIsFavorited(fav) }
    }
    load()
  }, [id, user])

  const handleFavorite = async () => {
    if (!user) { toast.error('Please sign in to save properties'); return }
    if (!property) return
    if (isFavorited) { await removeFavorite(user.id, property.id); setIsFavorited(false); toast.success('Removed from favorites') }
    else { await addFavorite(user.id, property.id); setIsFavorited(true); toast.success('Added to favorites') }
  }

  const handleSendMessage = async () => {
    if (!user || !property?.agent_id || !message.trim()) return
    setSendingMsg(true)
    try { await sendMessage(user.id, property.agent_id, message, property.id); toast.success('Message sent!'); setMessage(''); setShowContact(false) }
    catch { toast.error('Failed to send message') }
    finally { setSendingMsg(false) }
  }

  const handleBuyNow = async () => {
    if (!user) { router.push('/auth/login'); return }
    if (!property) return
    if (user.role !== 'buyer') { toast.error('Only buyers can purchase properties'); return }
    setBuying(true)
    try {
      const ref = `RST-${Date.now()}`
      await createTransaction(property.id, user.id, property.agent_id!, property.price, ref)
      toast.success('Purchase initiated! Transaction pending admin approval.')
      setShowBuy(false)
      router.push('/dashboard/buyer/transactions')
    } catch { toast.error('Failed to initiate payment') }
    finally { setBuying(false) }
  }

  if (loading) return <><Navbar /><div className="max-w-7xl mx-auto px-4 py-32 flex justify-center"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--brand-500)', borderTopColor:'transparent' }} /></div></>
  if (!property) return <><Navbar /><div className="max-w-7xl mx-auto px-4 py-32 text-center"><h1 className="text-2xl font-bold font-heading text-primary mb-4">Property Not Found</h1><Link href="/listings" className="btn-primary">Back to Listings</Link></div></>

  const images = property.images?.length > 0 ? property.images : [{ url:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', public_id:'placeholder' }]

  const Modal = ({ show, onClose, title, children }: any) => (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose} className="absolute inset-0 bg-black/50" />
          <motion.div initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:20 }}
            className="relative rounded-2xl p-6 w-full max-w-md shadow-modal" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
            <h3 className="font-extrabold font-heading text-primary text-lg mb-4">{title}</h3>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-20">
        <div style={{ backgroundColor:'var(--color-surface)', borderBottom:'1px solid var(--color-border-light)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs text-muted">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <i className="fa-solid fa-chevron-right text-xs" />
              <Link href="/listings" className="hover:text-primary transition-colors">Properties</Link>
              <i className="fa-solid fa-chevron-right text-xs" />
              <span className="text-primary font-medium truncate">{property.title}</span>
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <div className="rounded-2xl overflow-hidden shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <div className="relative aspect-video">
                  <Image src={images[activeImage]?.url} alt={property.title} fill className="object-cover" priority />
                  {property.is_featured && <div className="absolute top-4 left-4 px-3 py-1 text-white text-xs font-bold rounded-full" style={{ backgroundColor:'var(--brand-500)' }}><i className="fa-solid fa-star mr-1" />FEATURED</div>}
                  <span className={'absolute top-4 right-4 badge status-' + property.status + ' text-xs'}>{property.status.toUpperCase()}</span>
                  {images.length > 1 && (
                    <>
                      <button onClick={() => setActiveImage((activeImage-1+images.length)%images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors" style={{ backgroundColor:'rgba(255,255,255,0.9)' }}>
                        <i className="fa-solid fa-chevron-left text-xs text-primary" />
                      </button>
                      <button onClick={() => setActiveImage((activeImage+1)%images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors" style={{ backgroundColor:'rgba(255,255,255,0.9)' }}>
                        <i className="fa-solid fa-chevron-right text-xs text-primary" />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto" style={{ borderTop:'1px solid var(--color-border-light)' }}>
                    {images.map((img,i) => (
                      <button key={i} onClick={() => setActiveImage(i)} className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all" style={{ borderColor: i===activeImage ? 'var(--brand-500)' : 'transparent', opacity: i===activeImage ? 1 : 0.55 }}>
                        <Image src={img.url} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="rounded-2xl p-6 shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-extrabold font-heading text-primary mb-1" style={{ letterSpacing:'-0.02em' }}>{property.title}</h1>
                    <p className="flex items-center gap-1.5 text-sm text-muted"><i className="fa-solid fa-location-dot text-xs" style={{ color:'var(--brand-400)' }} />{property.location}, {property.city}, {property.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold font-heading" style={{ color:'var(--brand-500)', letterSpacing:'-0.04em' }}>{formatPrice(property.price)}</p>
                    {property.listing_type==='rent' && <p className="text-xs text-muted">per year</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="badge text-xs capitalize" style={{ backgroundColor:'var(--color-surface-2)', color:'var(--color-text-secondary)' }}>{property.property_type}</span>
                  <span className="badge text-xs capitalize" style={{ backgroundColor:'var(--brand-100)', color:'var(--brand-700)' }}>For {property.listing_type}</span>
                  <span className="flex items-center gap-1 text-xs text-muted"><i className="fa-solid fa-eye text-xs" />{property.views_count} views</span>
                  <span className="text-xs text-muted">Listed {formatDate(property.created_at)}</span>
                </div>
                {property.property_type !== 'land' && (
                  <div className="grid grid-cols-3 gap-4 p-4 rounded-xl mb-6" style={{ backgroundColor:'var(--color-surface-2)' }}>
                    {[
                      { label:'Bedrooms', value:property.bedrooms, icon:'fa-solid fa-bed' },
                      { label:'Bathrooms', value:property.bathrooms, icon:'fa-solid fa-bath' },
                      { label:'Area (sqft)', value:property.area_sqft ? property.area_sqft.toLocaleString() : '—', icon:'fa-solid fa-ruler-combined' },
                    ].map((s) => (
                      <div key={s.label} className="text-center">
                        <i className={s.icon + ' text-sm mb-1 block'} style={{ color:'var(--brand-400)' }} />
                        <p className="text-2xl font-extrabold font-heading text-primary">{s.value}</p>
                        <p className="text-xs text-muted mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mb-6">
                  <h2 className="font-extrabold font-heading text-primary mb-3"><i className="fa-solid fa-align-left mr-2 text-sm" style={{ color:'var(--brand-400)' }} />Description</h2>
                  <p className="text-sm text-secondary leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
                {property.amenities?.length > 0 && (
                  <div>
                    <h2 className="font-extrabold font-heading text-primary mb-3"><i className="fa-solid fa-list-check mr-2 text-sm" style={{ color:'var(--brand-400)' }} />Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {property.amenities.map((a) => (
                        <div key={a} className="flex items-center gap-2 text-sm text-secondary">
                          <i className="fa-solid fa-check text-xs" style={{ color:'var(--brand-500)' }} />{a}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="rounded-2xl p-6 shadow-card sticky top-24" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                <p className="text-3xl font-extrabold font-heading mb-1" style={{ color:'var(--brand-500)', letterSpacing:'-0.04em' }}>{formatPrice(property.price)}</p>
                {property.listing_type==='rent' && <p className="text-xs text-muted mb-4">per year</p>}
                <div className="space-y-3 mt-4">
                  {property.status==='approved' && user?.role==='buyer' && (
                    <button onClick={() => setShowBuy(true)} className="w-full btn-primary py-3 text-base justify-center">
                      <i className="fa-solid fa-cart-shopping text-sm" />Buy Now
                    </button>
                  )}
                  {property.status==='sold' && <div className="w-full py-3 text-center rounded-xl font-bold text-sm" style={{ backgroundColor:'var(--color-surface-2)', color:'var(--color-text-muted)' }}><i className="fa-solid fa-lock mr-2" />Property Sold</div>}
                  <button onClick={() => { if (!user) { router.push('/auth/login'); return }; setShowContact(true) }} className="w-full btn-secondary py-3 justify-center">
                    <i className="fa-regular fa-comments text-sm" />Contact Agent
                  </button>
                  <button onClick={handleFavorite} className="w-full py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                    style={isFavorited ? { borderColor:'var(--color-danger-text)', backgroundColor:'var(--color-danger-bg)', color:'var(--color-danger-text)' } : { borderColor:'var(--color-border)', color:'var(--color-text-secondary)' }}>
                    <i className={isFavorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />{isFavorited ? 'Saved' : 'Save Property'}
                  </button>
                </div>
                <div className="mt-4 p-3 rounded-xl flex items-start gap-2" style={{ backgroundColor:'var(--color-success-bg)', border:'1px solid var(--color-border-light)' }}>
                  <i className="fa-solid fa-shield-halved text-sm mt-0.5 shrink-0" style={{ color:'var(--color-success-text)' }} />
                  <p className="text-xs leading-relaxed" style={{ color:'var(--color-success-text)' }}>Payments are held in escrow and only released when you confirm receipt of property.</p>
                </div>
              </div>
              {property.agent && (
                <div className="rounded-2xl p-5 shadow-card" style={{ backgroundColor:'var(--color-surface)', border:'1px solid var(--color-border-light)' }}>
                  <h3 className="font-bold text-sm font-heading text-primary mb-4"><i className="fa-solid fa-id-badge mr-2" style={{ color:'var(--brand-400)' }} />Listed by</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold font-heading" style={{ backgroundColor:'var(--brand-100)', color:'var(--brand-700)' }}>{getInitials(property.agent.name)}</div>
                    <div><p className="font-bold text-primary font-heading">{property.agent.name}</p><p className="text-xs text-muted">Verified Agent</p></div>
                  </div>
                  {property.agent.bio && <p className="text-xs text-secondary mb-4 leading-relaxed">{property.agent.bio}</p>}
                  {property.agent.phone && <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 text-sm font-semibold" style={{ color:'var(--brand-500)' }}><i className="fa-solid fa-phone text-xs" />{property.agent.phone}</a>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Modal show={showContact} onClose={() => setShowContact(false)} title="Contact Agent">
        <p className="text-sm text-muted mb-4">Regarding: {property.title}</p>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Hi, I'm interested in this property. Is it still available?" rows={4} className="input-base resize-none mb-4" />
        <div className="flex gap-3">
          <button onClick={() => setShowContact(false)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSendMessage} disabled={sendingMsg||!message.trim()} className="btn-primary flex-1 justify-center">
            {sendingMsg ? <><i className="fa-solid fa-spinner animate-spin text-sm" />Sending...</> : <><i className="fa-solid fa-paper-plane text-sm" />Send Message</>}
          </button>
        </div>
      </Modal>

      <Modal show={showBuy} onClose={() => setShowBuy(false)} title="Confirm Purchase">
        <div className="rounded-xl p-4 mb-4 space-y-2" style={{ backgroundColor:'var(--color-surface-2)' }}>
          {[['Property', property.title],['Location', property.city],['Amount', formatPrice(property.price)]].map(([k,v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span className="text-muted">{k}</span>
              <span className={`font-bold ${k==='Amount' ? '' : 'text-primary'} truncate ml-4`} style={k==='Amount' ? { color:'var(--brand-500)' } : {}}>{v}</span>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl mb-4 flex items-start gap-2" style={{ backgroundColor:'var(--color-warning-bg)', border:'1px solid var(--color-border-light)' }}>
          <i className="fa-solid fa-circle-info text-sm mt-0.5 shrink-0" style={{ color:'var(--color-warning-text)' }} />
          <p className="text-xs leading-relaxed" style={{ color:'var(--color-warning-text)' }}>
            <strong>Escrow Protection:</strong> Your payment is held securely until the admin verifies and releases it to the seller. You are fully protected.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowBuy(false)} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleBuyNow} disabled={buying} className="btn-primary flex-1 justify-center">
            {buying ? <><i className="fa-solid fa-spinner animate-spin text-sm" />Processing...</> : <><i className="fa-solid fa-lock text-sm" />Proceed to Payment</>}
          </button>
        </div>
      </Modal>
      <Footer />
    </>
  )
}
