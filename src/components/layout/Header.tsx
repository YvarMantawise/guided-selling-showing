'use client'

// src/components/layout/Header.tsx
// ============================================
// Navigation Menu
// ============================================

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface HeaderProps {
  onAnalyseClick?: () => void
}

export default function Header({ onAnalyseClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Track scroll voor sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sluit mobile menu bij route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleAnalyseClick = () => {
    // Check of we op de homepage zijn
    if (pathname === '/') {
      // We zijn op de homepage, dus direct modal openen
      if (onAnalyseClick) {
        onAnalyseClick()
      } else {
        // Dispatch custom event dat de homepage kan oppakken
        window.dispatchEvent(new CustomEvent('open-analyse-modal'))
      }
    } else {
      // We zijn niet op de homepage, navigeer erheen met query parameter
      router.push('/?analyse=true')
    }
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { label: 'Analyse', action: handleAnalyseClick, isButton: true },
    { label: 'Behandelingen', href: '/behandelingen' },
    { label: 'Alle Producten', href: '/store' },
    { label: 'Over Ons', href: '/over-ons' },
  ]

  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-subtle'
          : 'bg-transparent'
      }`}
    >
      <div className="container-berino">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            {/* Logo Icon */}
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-berino-forest flex items-center justify-center transition-transform group-hover:scale-105">
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2"
                />
              </svg>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl font-semibold text-berino-charcoal leading-tight">
                Haar & Hoofdhuid
              </span>
              <span className="text-xs md:text-sm text-berino-gray font-medium -mt-0.5">
                Specialist
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) =>
              item.isButton ? (
                <button
                  key={index}
                  onClick={item.action}
                  className="nav-link px-4 py-2 rounded-lg hover:bg-berino-mint/30"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={index}
                  href={item.href!}
                  className={`nav-link px-4 py-2 rounded-lg hover:bg-berino-mint/30 ${
                    pathname === item.href ? 'nav-link-active bg-berino-mint/20' : ''
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Winkelwagen */}
            {shopifyDomain && (
              <a
                href={`https://${shopifyDomain}/cart`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 p-2 rounded-lg text-berino-charcoal hover:text-berino-forest hover:bg-berino-mint/30 transition-colors"
                aria-label="Winkelwagen"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-berino-charcoal hover:bg-berino-mint/30 transition-colors"
            aria-label={isMobileMenuOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-berino-mint/30 space-y-1">
            {navItems.map((item, index) =>
              item.isButton ? (
                <button
                  key={index}
                  onClick={item.action}
                  className="block w-full text-left px-4 py-3 rounded-lg nav-link hover:bg-berino-mint/30"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={index}
                  href={item.href!}
                  className={`block px-4 py-3 rounded-lg nav-link hover:bg-berino-mint/30 ${
                    pathname === item.href ? 'nav-link-active bg-berino-mint/20' : ''
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            
            {/* Mobile Winkelwagen */}
            {shopifyDomain && (
              <a
                href={`https://${shopifyDomain}/cart`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-lg nav-link hover:bg-berino-mint/30"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                Winkelwagen
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
