# DESIGN.md - Berino Haar & Hoofdhuid Specialist

## Overzicht

Dit document beschrijft de visuele identiteit, component architectuur en design specificaties voor de Berino website. Het design balanceert "Clean Science" met "High-end Wellness" - een digitale ervaring die aanvoelt als een luxe kliniek.

---

## 1. Visuele Identiteit: "The Medical Spa"

### Design Filosofie

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│    CLEAN SCIENCE          +          HIGH-END WELLNESS                      │
│    ─────────────                     ─────────────────                      │
│    • Precisie                        • Rust                                 │
│    • Technologie                     • Luxe                                 │
│    • Vertrouwen                      • Natuurlijk                           │
│    • Data-gedreven                   • Persoonlijk                          │
│                                                                             │
│                              ═══════════                                    │
│                                                                             │
│                           BERINO IDENTITY                                   │
│                           ───────────────                                   │
│                     Professioneel • Transparant • Zorgzaam                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Kleurenpalet

### Primaire Kleuren

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRIMAIR                                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │          │  │          │  │          │  │          │  │          │      │
│  │  Forest  │  │  Forest  │  │  Sage    │  │  Sage    │  │  Mint    │      │
│  │  Dark    │  │  Green   │  │  Green   │  │  Light   │  │  Cream   │      │
│  │          │  │          │  │          │  │          │  │          │      │
│  │ #1B4332  │  │ #2D5A45  │  │ #52796F  │  │ #84A98C  │  │ #CAD2C5  │      │
│  │          │  │          │  │          │  │          │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                             │
│  Accent/CTA    Hover        Text          Subtle        Backgrounds        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Neutrale Kleuren

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NEUTRALS                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │          │  │          │  │          │  │          │  │          │      │
│  │  Warm    │  │  Nude    │  │  Cream   │  │  Off     │  │  Pure    │      │
│  │  Charcoal│  │  Gray    │  │  Beige   │  │  White   │  │  White   │      │
│  │          │  │          │  │          │  │          │  │          │      │
│  │ #2F2F2F  │  │ #6B6B6B  │  │ #F5F1EB  │  │ #FAFAF8  │  │ #FFFFFF  │      │
│  │          │  │          │  │          │  │          │  │          │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                             │
│  Headings      Body Text    Warm BG       Page BG       Cards              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Functionele Kleuren

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FUNCTIONAL                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Success       Warning       Error         Info                             │
│  #4ADE80       #FBBF24       #F87171       #60A5FA                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tailwind Config Extensie

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        berino: {
          forest: {
            dark: '#1B4332',
            DEFAULT: '#2D5A45',
          },
          sage: {
            DEFAULT: '#52796F',
            light: '#84A98C',
          },
          mint: '#CAD2C5',
          cream: '#F5F1EB',
          offwhite: '#FAFAF8',
          charcoal: '#2F2F2F',
          gray: '#6B6B6B',
        }
      }
    }
  }
}
```

---

## 3. Typografie

### Font Pairing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TYPOGRAFIE                                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HEADINGS                                                                   │
│  ─────────                                                                  │
│  Font: Cormorant Garamond                                                   │
│  Weights: 500 (Medium), 600 (SemiBold), 700 (Bold)                         │
│  Style: Elegant serif met luxe uitstraling                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  Ontdek de Gezondheid                                              │   │
│  │  van Jouw Hoofdhuid                                                │   │
│  │                                                                     │   │
│  │  Cormorant Garamond, 600, 48px/56px                                │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  BODY TEXT                                                                  │
│  ─────────                                                                  │
│  Font: DM Sans                                                              │
│  Weights: 400 (Regular), 500 (Medium), 600 (SemiBold)                      │
│  Style: Modern, leesbaar, wetenschappelijk                                  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  Onze AI-gestuurde analyse bekijkt jouw unieke haar- en            │   │
│  │  hoofdhuidkenmerken om een gepersonaliseerd verzorgingsplan        │   │
│  │  samen te stellen.                                                 │   │
│  │                                                                     │   │
│  │  DM Sans, 400, 16px/28px                                           │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Type Scale

| Element | Font | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---------|------|----------------|---------------|--------|-------------|
| H1 | Cormorant Garamond | 56px | 36px | 600 | 1.1 |
| H2 | Cormorant Garamond | 42px | 28px | 600 | 1.2 |
| H3 | Cormorant Garamond | 32px | 24px | 500 | 1.3 |
| H4 | DM Sans | 24px | 20px | 600 | 1.4 |
| Body Large | DM Sans | 18px | 16px | 400 | 1.75 |
| Body | DM Sans | 16px | 15px | 400 | 1.75 |
| Body Small | DM Sans | 14px | 13px | 400 | 1.6 |
| Caption | DM Sans | 12px | 12px | 500 | 1.5 |
| Button | DM Sans | 16px | 15px | 600 | 1.25 |

### Next.js Font Setup

```typescript
// src/app/layout.tsx
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// In <html> tag:
<html className={`${cormorant.variable} ${dmSans.variable}`}>
```

---

## 4. Component Architectuur

### Folder Structuur

```
src/
├── app/
│   ├── layout.tsx              # Root layout met Header/Footer
│   ├── page.tsx                # Homepage
│   ├── store/
│   │   ├── page.tsx            # Alle producten
│   │   └── [handle]/
│   │       └── page.tsx        # Product detail
│   ├── advies/
│   │   └── [userId]/
│   │       └── page.tsx        # Persoonlijk advies pagina
│   ├── over-ons/
│   │   └── page.tsx            # Over ons (placeholder)
│   └── api/
│       ├── chat/
│       │   └── route.ts        # Mistral AI chat
│       ├── submit-analyse/
│       │   └── route.ts        # Submit naar Make.com
│       └── advies/
│           └── [userId]/
│               └── route.ts    # GET status, POST callback
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigatie header
│   │   ├── Footer.tsx          # Site footer
│   │   └── Container.tsx       # Max-width wrapper
│   │
│   ├── home/
│   │   ├── HeroSection.tsx     # Hero met CTA
│   │   ├── HowItWorks.tsx      # Stappenplan
│   │   └── Testimonials.tsx    # Reviews
│   │
│   ├── analyse/
│   │   ├── AnalyseModal.tsx    # Chat modal wrapper
│   │   ├── ChatInterface.tsx   # Chat UI
│   │   ├── ChatMessage.tsx     # Individueel bericht
│   │   ├── ProgressBar.tsx     # Voortgangsbalk
│   │   └── GegevensForm.tsx    # Naam/email formulier
│   │
│   ├── advies/
│   │   ├── WachtScherm.tsx     # Loading state
│   │   ├── AnalyseResultaat.tsx# Diagnose weergave
│   │   └── ProductAanbevelingen.tsx
│   │
│   ├── store/
│   │   ├── ProductCard.tsx     # Product kaart
│   │   ├── ProductGrid.tsx     # Grid layout
│   │   └── AddToCartButton.tsx # Winkelwagen knop
│   │
│   └── ui/
│       ├── Button.tsx          # Herbruikbare button
│       ├── Modal.tsx           # Modal wrapper
│       ├── Input.tsx           # Form input
│       └── LoadingSpinner.tsx  # Laad animatie
│
├── lib/
│   ├── shopify.ts              # Shopify API client
│   ├── cart.ts                 # Cart/checkout helpers
│   └── session.ts              # Tijdelijke sessie opslag
│
└── styles/
    └── globals.css             # Tailwind + custom styles
```

---

## 5. Pagina Layouts

### Homepage

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🌿 Haar & Hoofdhuid Specialist    Analyse  Producten  Over Ons  🛒  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HERO SECTION                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                    Ontdek de Gezondheid                             │   │
│  │                    van Jouw Hoofdhuid                               │   │
│  │                                                                     │   │
│  │         Onze AI-analyse geeft je persoonlijk advies                │   │
│  │         en product aanbevelingen binnen enkele minuten.            │   │
│  │                                                                     │   │
│  │                  [ Start Jouw Analyse ]                             │   │
│  │                                                                     │   │
│  │                     ✓ Gratis  ✓ 2 minuten  ✓ Persoonlijk           │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  HOW IT WORKS                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                    Hoe Het Werkt                                    │   │
│  │                                                                     │   │
│  │   ┌─────────┐       ┌─────────┐       ┌─────────┐                  │   │
│  │   │    1    │       │    2    │       │    3    │                  │   │
│  │   │   💬    │  ───▶ │   🔬    │  ───▶ │   🎁    │                  │   │
│  │   │         │       │         │       │         │                  │   │
│  │   │ Beant-  │       │ AI      │       │ Krijg   │                  │   │
│  │   │ woord   │       │ Analy-  │       │ Jouw    │                  │   │
│  │   │ Vragen  │       │ seert   │       │ Advies  │                  │   │
│  │   └─────────┘       └─────────┘       └─────────┘                  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  TESTIMONIALS                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                  Wat Onze Klanten Zeggen                            │   │
│  │                                                                     │   │
│  │   ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │   │
│  │   │ ★★★★★         │  │ ★★★★★         │  │ ★★★★★         │          │   │
│  │   │               │  │               │  │               │          │   │
│  │   │ "Eindelijk    │  │ "Super        │  │ "Binnen een   │          │   │
│  │   │  begrijp ik   │  │  persoonlijk  │  │  week al      │          │   │
│  │   │  mijn haar!"  │  │  advies."     │  │  resultaat."  │          │   │
│  │   │               │  │               │  │               │          │   │
│  │   │ - Anna K.     │  │ - Mark V.     │  │ - Sophie B.   │          │   │
│  │   └───────────────┘  └───────────────┘  └───────────────┘          │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🌿 Haar & Hoofdhuid Specialist                                    │   │
│  │                                                                     │   │
│  │  Navigatie          Contact            Volg Ons                    │   │
│  │  ──────────         ───────            ────────                    │   │
│  │  Home               info@berino.nl     Instagram                   │   │
│  │  Analyse            +31 6 12345678     Facebook                    │   │
│  │  Producten                                                         │   │
│  │  Over Ons                                                          │   │
│  │                                                                     │   │
│  │  ─────────────────────────────────────────────────────────────     │   │
│  │  © 2025 Berino. Alle rechten voorbehouden.                        │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chat Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                          MODAL OVERLAY                                │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │  🌿 Haar & Hoofdhuid Analyse              [ × Sluiten ] │   │ │ │
│  │  │  └─────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │  PROGRESS BAR                                           │   │ │ │
│  │  │  │  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░  35%         │   │ │ │
│  │  │  └─────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │                    CHAT MESSAGES                        │   │ │ │
│  │  │  │                                                         │   │ │ │
│  │  │  │        ┌────────────────────────────────────────┐      │   │ │ │
│  │  │  │        │ Welkom! Ik help je graag met het       │      │   │ │ │
│  │  │  │   🤖   │ analyseren van je haar en hoofdhuid.   │      │   │ │ │
│  │  │  │        │ Waar heb je last van?                  │      │   │ │ │
│  │  │  │        └────────────────────────────────────────┘      │   │ │ │
│  │  │  │                                                         │   │ │ │
│  │  │  │  ┌────────────────────────────────────────┐            │   │ │ │
│  │  │  │  │ Ik heb last van een droge hoofdhuid    │   👤       │   │ │ │
│  │  │  │  │ en mijn haar voelt dof aan.            │            │   │ │ │
│  │  │  │  └────────────────────────────────────────┘            │   │ │ │
│  │  │  │                                                         │   │ │ │
│  │  │  │        ┌────────────────────────────────────────┐      │   │ │ │
│  │  │  │        │ Dat klinkt vervelend. Hoe lang heb je  │      │   │ │ │
│  │  │  │   🤖   │ hier al last van? En heb je recent     │      │   │ │ │
│  │  │  │        │ iets veranderd aan je haarroutine?     │      │   │ │ │
│  │  │  │        └────────────────────────────────────────┘      │   │ │ │
│  │  │  │                                                         │   │ │ │
│  │  │  └─────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │                                                         │   │ │ │
│  │  │  │  [ Type je antwoord...                          ] [➤]  │   │ │ │
│  │  │  │                                                         │   │ │ │
│  │  │  └─────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │            [ Afronden en krijg rapport ]                │   │ │ │
│  │  │  └─────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                 │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Advies Pagina (/advies/[userId])

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HEADER                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WACHTSCHERM (terwijl analyse loopt)                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                         ┌─────────┐                                 │   │
│  │                         │  ◠ ◡ ◠  │  ← DNA/Scan animatie           │   │
│  │                         │  ◡ ◠ ◡  │                                 │   │
│  │                         └─────────┘                                 │   │
│  │                                                                     │   │
│  │                 Hoi [Naam], we analyseren                          │   │
│  │                   nu je resultaten...                               │   │
│  │                                                                     │   │
│  │                    Dit duurt ongeveer                               │   │
│  │                      30-60 seconden                                 │   │
│  │                                                                     │   │
│  │                 ████████████░░░░░░░░░░░                             │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  RESULTAAT (na analyse)                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                    Jouw Persoonlijke Analyse                        │   │
│  │                                                                     │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │  🔬 DIAGNOSE                                                  │ │   │
│  │  │  ─────────────────────────────────────────────────────────    │ │   │
│  │  │                                                               │ │   │
│  │  │  Op basis van je antwoorden zien we dat je hoofdhuid          │ │   │
│  │  │  tekenen vertoont van dehydratie. Dit kan veroorzaakt         │ │   │
│  │  │  worden door...                                               │ │   │
│  │  │                                                               │ │   │
│  │  │  Belangrijkste bevindingen:                                   │ │   │
│  │  │  • Droge hoofdhuid                                            │ │   │
│  │  │  • Verminderde haarglans                                      │ │   │
│  │  │  • Mogelijke productopbouw                                    │ │   │
│  │  │                                                               │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │                                                                     │   │
│  │                    Aanbevolen Voor Jou                              │   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │   [Image]   │  │   [Image]   │  │   [Image]   │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │  Hydrating  │  │  Scalp      │  │  Nourishing │                 │   │
│  │  │  Shampoo    │  │  Serum      │  │  Mask       │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │  €24,95     │  │  €34,95     │  │  €29,95     │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  │ [Toevoegen] │  │ [Toevoegen] │  │ [Toevoegen] │                 │   │
│  │  │             │  │             │  │             │                 │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Component Specificaties

### Header

```typescript
// components/layout/Header.tsx
interface HeaderProps {
  onAnalyseClick: () => void  // Opent chat modal
}

/*
 * Layout:
 * - Logo links (🌿 + "Haar & Hoofdhuid Specialist")
 * - Navigatie rechts:
 *   - "Analyse" (button, opent modal)
 *   - "Alle Producten" (link naar /store)
 *   - "Over Ons" (link naar /over-ons)
 *   - Winkelmandje icoon (link naar Shopify checkout)
 *
 * Responsive:
 * - Desktop: Horizontale navigatie
 * - Mobile: Hamburger menu
 *
 * Styling:
 * - Achtergrond: white/transparent
 * - Sticky on scroll
 * - Subtiele shadow bij scroll
 */
```

### Footer

```typescript
// components/layout/Footer.tsx

/*
 * Secties:
 * - Logo + korte beschrijving
 * - Navigatie links
 * - Contact informatie
 * - Social media links
 * - Copyright
 *
 * Styling:
 * - Achtergrond: berino-cream (#F5F1EB)
 * - Tekst: berino-charcoal
 */
```

### Button Varianten

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

/*
 * Primary:
 * - Achtergrond: berino-forest (#1B4332)
 * - Tekst: white
 * - Hover: berino-forest-dark
 * - Shadow: subtle green glow
 *
 * Secondary:
 * - Achtergrond: white
 * - Border: berino-sage
 * - Tekst: berino-forest
 * - Hover: berino-mint background
 *
 * Ghost:
 * - Achtergrond: transparent
 * - Tekst: berino-forest
 * - Hover: berino-mint/20 background
 */
```

---

## 7. Micro-interacties & Animaties

### Scroll Animaties

```css
/* Elementen faden in bij scroll */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Button Hover

```css
.btn-primary {
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(27, 67, 50, 0.3);
}
```

### Chat Message Entrance

```css
.chat-message {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Loading/Scan Animatie

```css
/* DNA/Scan effect voor wachtscherm */
.scan-animation {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 8. Responsive Breakpoints

| Breakpoint | Naam | Gebruik |
|------------|------|---------|
| < 640px | Mobile | Single column, hamburger menu |
| 640px - 768px | Tablet Small | 2 column grids |
| 768px - 1024px | Tablet | Adjusted spacing |
| 1024px - 1280px | Desktop | Full navigation |
| > 1280px | Desktop Large | Max-width containers |

### Container Max-widths

```css
.container-sm { max-width: 640px; }   /* Forms, modals */
.container-md { max-width: 768px; }   /* Content */
.container-lg { max-width: 1024px; }  /* Page content */
.container-xl { max-width: 1280px; }  /* Full layouts */
```

---

## 9. Spacing Systeem

Gebruik Tailwind's standaard spacing schaal, met nadruk op:

| Gebruik | Spacing | Tailwind Class |
|---------|---------|----------------|
| Tussen elementen (klein) | 8px | `gap-2`, `space-y-2` |
| Tussen elementen (medium) | 16px | `gap-4`, `space-y-4` |
| Tussen secties | 48px - 64px | `py-12`, `py-16` |
| Padding containers | 16px - 32px | `px-4 lg:px-8` |
| Margin secties | 80px - 120px | `my-20`, `my-30` |

---

## 10. Accessibility Richtlijnen

1. **Kleurcontrast**: Alle tekst moet minimaal 4.5:1 contrast ratio hebben
2. **Focus states**: Duidelijke focus rings op alle interactieve elementen
3. **Aria labels**: Alle knoppen en iconen hebben beschrijvende labels
4. **Keyboard navigatie**: Volledige site navigeerbaar met toetsenbord
5. **Screen readers**: Semantische HTML, proper heading hierarchy
6. **Reduced motion**: Respecteer `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Overzicht Pagina's

| Route | Pagina | Status |
|-------|--------|--------|
| `/` | Homepage | Te bouwen |
| `/store` | Alle producten | Bestaand (styling update) |
| `/store/[handle]` | Product detail | Bestaand (styling update) |
| `/advies/[userId]` | Persoonlijk advies | Te bouwen |
| `/over-ons` | Over ons | Placeholder |

---

## 12. Design Tokens Export

```javascript
// design-tokens.js
export const tokens = {
  colors: {
    primary: {
      forest: { dark: '#1B4332', DEFAULT: '#2D5A45' },
      sage: { DEFAULT: '#52796F', light: '#84A98C' },
      mint: '#CAD2C5',
    },
    neutral: {
      charcoal: '#2F2F2F',
      gray: '#6B6B6B',
      cream: '#F5F1EB',
      offwhite: '#FAFAF8',
      white: '#FFFFFF',
    },
  },
  fonts: {
    heading: 'Cormorant Garamond, serif',
    body: 'DM Sans, sans-serif',
  },
  spacing: {
    section: '5rem',      // 80px
    sectionLg: '7.5rem',  // 120px
  },
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    full: '9999px',
  },
  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.04)',
    card: '0 4px 16px rgba(0, 0, 0, 0.08)',
    modal: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
}
```
