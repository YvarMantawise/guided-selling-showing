import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-berino-cream border-t border-berino-mint/50">
      <div className="container-berino py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-berino-gray text-sm">
            © {currentYear} Mantawise. Powered by AI.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-berino-gray hover:text-berino-forest transition-colors text-sm">
              Privacybeleid
            </Link>
            <Link href="/voorwaarden" className="text-berino-gray hover:text-berino-forest transition-colors text-sm">
              Algemene Voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
