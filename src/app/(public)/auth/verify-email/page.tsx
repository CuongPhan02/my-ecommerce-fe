import VerifyEmailForm from '~/features/public/auth/components/verify-email-form'
import { Suspense } from 'react'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  )
}
