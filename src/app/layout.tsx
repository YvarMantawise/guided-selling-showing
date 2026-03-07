import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import "./globals.css"
import EmbedShell from "@/components/layout/EmbedShell"

// Heading font - elegant serif
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

// Body font - modern sans-serif
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Guided Selling",
    template: "%s | Guided Selling",
  },
  description:
    "Krijg persoonlijk productadvies via een AI-gesprek. Snel, eenvoudig en op maat.",
  authors: [{ name: "Mantawise" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    title: "Guided Selling",
    description: "Krijg persoonlijk productadvies via een AI-gesprek.",
    siteName: "Guided Selling",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="nl"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#1B4332" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen flex flex-col">
        <EmbedShell>{children}</EmbedShell>
        <Analytics />
      </body>
    </html>
  )
}
