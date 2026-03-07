import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

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
    default: "Haar & Hoofdhuid Specialist",
    template: "%s | Haar & Hoofdhuid Specialist",
  },
  description:
    "Ontdek de gezondheid van jouw haar en hoofdhuid met onze AI-gestuurde analyse. Krijg persoonlijk advies en product aanbevelingen binnen enkele minuten.",
  keywords: [
    "haar",
    "hoofdhuid",
    "analyse",
    "haarverzorging",
    "hoofdhuidproblemen",
    "droge hoofdhuid",
    "roos",
    "haarverlies",
    "haarproducten",
  ],
  authors: [{ name: "Berino" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://haarenhoofdhuidspecialist.vercel.app",
    title: "Haar & Hoofdhuid Specialist",
    description:
      "Ontdek de gezondheid van jouw haar en hoofdhuid met onze AI-gestuurde analyse.",
    siteName: "Haar & Hoofdhuid Specialist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Haar & Hoofdhuid Specialist",
    description:
      "Ontdek de gezondheid van jouw haar en hoofdhuid met onze AI-gestuurde analyse.",
  },
  robots: {
    index: true,
    follow: true,
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
