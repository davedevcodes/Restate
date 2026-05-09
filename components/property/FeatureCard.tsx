'use client'

interface FeatureCardProps {
  icon: string
  title: string
  desc: string
}

export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div
      className="rounded-2xl p-6 transition-all"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
    >
      <div
        className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center"
        style={{ backgroundColor: 'var(--brand-100)' }}
      >
        <i className={`${icon} text-base`} style={{ color: 'var(--brand-600)' }} />
      </div>
      <h3 className="font-bold text-sm font-heading text-primary mb-1.5">{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{desc}</p>
    </div>
  )
}
