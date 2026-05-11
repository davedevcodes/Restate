import { Suspense } from 'react'
import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--brand-500)', borderTopColor: 'transparent' }} /></div>}>
      <RegisterForm />
    </Suspense>
  )
}
