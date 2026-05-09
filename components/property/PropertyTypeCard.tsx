'use client'

import Link from 'next/link'

interface PropertyTypeCardProps {
  type: string
  label: string
  icon: string
  desc: string
}

export default function PropertyTypeCard({ type, label, icon, desc }: PropertyTypeCardProps) {
  return (
    <Link href={`/listings?type=${type}`}>
      <div
        className="rounded-2xl p-6 transition-all group text-center cursor-pointer hover:shadow-card-hover"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)', boxShadow: 'var(--shadow-card)' }}
      >
        <div
          className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: 'var(--brand-100)' }}
        >
          <i className={`${icon} text-lg`} style={{ color: 'var(--brand-600)' }} />
        </div>
        <h3 className="font-bold text-sm font-heading text-primary group-hover:text-[var(--brand-500)] transition-colors">
          {label}
        </h3>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
      </div>
    </Link>
  )
}
