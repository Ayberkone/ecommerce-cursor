// app/register/page.tsx

import { Suspense } from 'react'
import RegisterPageContent from "./RegisterPageContent"

export default function RegisterPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  )
}
