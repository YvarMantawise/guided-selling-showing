'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Header from './Header'
import Footer from './Footer'

function Shell({ children }: { children: React.ReactNode }) {
  const params = useSearchParams()
  const isEmbed = params.get('embed') === '1'

  if (isEmbed) {
    return <main className="flex-1">{children}</main>
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}

// Suspense is required because useSearchParams() suspends during SSR
export default function EmbedShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </>
      }
    >
      <Shell>{children}</Shell>
    </Suspense>
  )
}
