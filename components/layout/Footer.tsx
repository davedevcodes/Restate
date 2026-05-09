'use client'

import Link from 'next/link'

const socialLinks = [
  { icon: 'fa-brands fa-x-twitter',  label: 'Twitter' },
  { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn' },
  { icon: 'fa-brands fa-instagram',   label: 'Instagram' },
  { icon: 'fa-brands fa-facebook-f',  label: 'Facebook' },
]

const companyLinks = [
  { href: '/about',         label: 'About Us' },
  { href: '/listings',      label: 'Properties' },
  { href: '/contact',       label: 'Contact' },
  { href: '/auth/register', label: 'List Property' },
]

const propertyLinks = [
  { href: '/listings?type=house',      label: 'Houses' },
  { href: '/listings?type=apartment',  label: 'Apartments' },
  { href: '/listings?type=land',       label: 'Land' },
  { href: '/listings?type=commercial', label: 'Commercial' },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D1117', color: '#F0F6FC' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--brand-500)' }}
              >
                <i className="fa-solid fa-house text-white text-sm" />
              </div>
              <span className="text-xl font-bold font-heading">
                Re<span style={{ color: 'var(--brand-400)' }}>state</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#8B949E' }}>
              Nigeria's premier real estate marketplace. Find, list, and transact properties with confidence and transparency.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (<a key={s.label} key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover-brand"
                  style={{ backgroundColor: '#21262D', color: '#8B949E' }}
                >
                  <i className={`${s.icon} text-xs`} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#8B949E' }}
            >
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover-text-primary"
                    style={{ color: '#8B949E' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#8B949E' }}
            >
              Properties
            </h3>
            <ul className="space-y-3">
              {propertyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover-text-primary"
                    style={{ color: '#8B949E' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#8B949E' }}
            >
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <i
                  className="fa-solid fa-location-dot mt-0.5 text-xs shrink-0"
                  style={{ color: 'var(--brand-400)' }}
                />
                <span className="text-sm" style={{ color: '#8B949E' }}>
                  Port Harcourt, Rivers State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <i
                  className="fa-solid fa-envelope text-xs shrink-0"
                  style={{ color: 'var(--brand-400)' }}
                />
                <a
                  href="mailto:hello@restate.ng"
                  className="text-sm transition-colors"
                  style={{ color: '#8B949E' }}
                >
                  hello@restate.ng
                </a>
              </li>
              <li className="flex items-center gap-3">
                <i
                  className="fa-solid fa-phone text-xs shrink-0"
                  style={{ color: 'var(--brand-400)' }}
                />
                <a
                  href="tel:+2348000000000"
                  className="text-sm transition-colors"
                  style={{ color: '#8B949E' }}
                >
                  +234 800 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid #21262D' }}
        >
          <p className="text-sm" style={{ color: '#6E7681' }}>
            © {new Date().getFullYear()} Restate. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service'].map((t) => (<Link key={t} key={t}
                href="#"
                className="text-sm transition-colors"
                style={{ color: '#6E7681' }}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
