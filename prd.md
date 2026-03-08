# PRD: Berino Guided Selling Widget — Showing Agent

> **Huidige implementatie** (bijgewerkt maart 2026) — zie onderstaande sectie voor de actuele architectuur.
> De rest van dit document beschrijft de originele opzet en kan afwijken van de huidige staat.

---

## Wat doet deze applicatie?

Een **embeddable voice-AI widget** voor Shopify webshops waarbij de AI **tijdens het gesprek** al producten toont via de `toon_product` client tool. De agent zoekt producten op via een webhook tool (`zoek_producten`) die de Shopify Admin API aanroept.

Dit is de **showing variant** van `guided-selling`. Verschil:

| | `guided-selling` | `guided-selling-showing` |
|---|---|---|
| Producten tonen | Achteraf, op advies pagina | Inline tijdens gesprek |
| Agent | Standaard | Showing agent |
| Client tool | — | `toon_product` |
| Webhook tool | — | `zoek_producten` → `/api/shopify-search` |

### Huidige flow

```
1. Widget (public/widget.js)
   └── Floating knop op de webshop
       └── Opent een popup iframe (380×560px)

2. Gesprek (/)
   └── Klant klikt op de microfoonknop
       └── ElevenLabs voice AI start via WebRTC
           └── AI stelt vragen en zoekt producten op via zoek_producten webhook tool
               └── Agent roept toon_product({ handle }) aan
                   └── Browser toont productkaart inline (afbeelding, prijs, "Toevoegen")

3. Rapport formulier (/rapport)
   └── Na het gesprek vult de klant in:
       naam, e-mail, geslacht, leeftijdscategorie
       └── → POST /api/submit-rapport

4. Verwerking (/api/submit-rapport)
   └── Haalt het transcript op via ElevenLabs API
       └── Maakt een sessie aan (in-memory)
           └── Stuurt alles naar Make.com webhook

5. Advies (/advies/[userId])
   └── Pollt elke 3 seconden op de sessie
       └── Zodra Make.com het advies terugschrijft:
           toont samenvatting + diagnose + aanbevolen producten
```

### Client tool: `toon_product`

```
Agent → toon_product({ handle: "product-handle" })
  └── Browser → POST /api/products { handles: ["product-handle"] }
      └── Shopify Admin API → productdata
          ├── Inline kaart in widget: afbeelding + titel + prijs + "Toevoegen" knop
          └── postMessage naar parent → webshop opent productpagina in nieuw tabblad
```

### postMessage bridge

De widget stuurt bij elk `toon_product` een bericht naar de webshop zodat die zelf kan reageren.

**Integratie op de webshop (naast het widget script):**

```html
<script>
  window.addEventListener('gs:toon_product', function(e) {
    window.open('/products/' + e.detail.handle, '_blank')
  })
</script>
```

### Huidige tech stack

| Component | Technologie |
|-----------|-------------|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Hosting | Vercel |
| Voice AI | ElevenLabs Conversational AI (WebRTC via `@elevenlabs/react`) |
| Client tool | `toon_product` — toont producten inline tijdens gesprek |
| Webhook tool | `zoek_producten` — ElevenLabs roept `/api/shopify-search` aan |
| Productzoekopdracht | Shopify Admin API via `searchProducts()` in `src/lib/shopify.ts` |
| Widget | Vanilla JS drop-in script (`public/widget.js`) |
| E-commerce | Shopify Admin API (OAuth Client Credentials) |
| Automation | Make.com (webhook + AI verwerking van transcript) |

### Huidige API routes

| Endpoint | Method | Beschrijving |
|----------|--------|--------------|
| `/api/products` | POST | Haalt producten op via handle (voor `toon_product` client tool) |
| `/api/shopify-search` | POST | Zoekt producten via Shopify Admin API (voor `zoek_producten` webhook tool) |
| `/api/submit-rapport` | POST | Ontvangt formulier, haalt transcript op, stuurt webhook |
| `/api/advies/[userId]` | GET | Poll voor advies status |
| `/api/advies/[userId]` | POST | Callback van Make.com met resultaat |

### Environment variables

```bash
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=     # ElevenLabs showing agent ID
ELEVENLABS_API_KEY=                  # Voor transcript ophalen
SHOPIFY_SHOP_DOMAIN=                 # Admin API
SHOPIFY_CLIENT_ID=
SHOPIFY_CLIENT_SECRET=
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN=     # Voor cart URL (client-side)
WEBHOOK_URL=                         # Make.com webhook
WEBHOOK_SECRET=                      # Optioneel
```

---

# Originele PRD (historisch)

## Problem Statement

Klanten met haar- en hoofdhuidproblemen weten vaak niet welke producten het beste bij hun specifieke situatie passen. Ze kopen op gevoel of advies van derden, wat leidt tot:
- Verkeerde productaankopen die niet werken
- Frustratie en verminderd vertrouwen in haarproducten
- Gemiste omzet voor Berino door gebrek aan persoonlijke begeleiding

Er is behoefte aan een laagdrempelige, gepersonaliseerde manier om klanten te helpen de juiste producten te vinden, zonder dat ze fysiek naar een specialist hoeven.

---

## Objective

Een AI-gestuurd analyse platform bouwen dat:

1. **Bezoekers converteert** door een interactieve, persoonlijke ervaring te bieden
2. **Vertrouwen opbouwt** door professionele uitstraling en relevante adviezen
3. **Verkoop stimuleert** door gerichte productaanbevelingen direct koppelbaar aan de Shopify checkout
4. **Data verzamelt** voor toekomstige marketing en productverbetering

### Succes Metrics

| Metric | Doel |
|--------|------|
| Analyse completion rate | > 70% van gestarte analyses wordt afgerond |
| Conversie naar product pagina | > 40% klikt door naar aanbevolen product |
| Add-to-cart rate | > 20% voegt product toe aan winkelwagen |
| Gemiddelde sessieduur | > 3 minuten |

---

## Target Users

### Primaire Doelgroep
- **Vrouwen 25-55 jaar** met haar- of hoofdhuidklachten
- Zoeken naar oplossingen voor: droge hoofdhuid, roos, haarverlies, vet haar, gevoelige hoofdhuid
- Bereid om te investeren in kwaliteitsproducten
- Comfortabel met online chat/AI interactie

### Secundaire Doelgroep
- **Mannen 30-50 jaar** met specifieke klachten (vooral haarverlies, roos)
- Partners/familieleden die producten zoeken voor anderen

### User Personas

**Persona 1: "Zoekende Sophie" (32)**
- Heeft al jaren last van droge hoofdhuid
- Heeft veel producten geprobeerd zonder succes
- Wil begrijpen WAAROM ze dit probleem heeft
- Zoekt betrouwbaar, professioneel advies

**Persona 2: "Praktische Peter" (45)**
- Merkt haarverlies op, wil snel een oplossing
- Geen zin in lange vragenlijsten
- Wil direct weten welk product hij moet kopen
- Prijs is minder belangrijk dan resultaat

---

## Requirements

### Must-have (MVP)

#### Website & Design
- [ ] Responsive website (mobile-first + desktop)
- [ ] Homepage met hero sectie en CTA "Start Jouw Analyse"
- [ ] "Hoe het werkt" stappenplan sectie
- [ ] Testimonials/reviews sectie
- [ ] Herbruikbare Header met navigatie
- [ ] Herbruikbare Footer
- [ ] "Over Ons" placeholder pagina

#### AI Analyse Chat
- [ ] Modal-based chat interface
- [ ] Integratie met OpenAI Assistants API (ID: `asst_ZMYlpfsJCQlqEB6p1W8DVwpz`)
- [ ] AI tool `analyse_afronden`: knop ontgrendelt alleen wanneer AI deze tool aanroept (niet op berichtenaantal)
- [ ] Progress bar tijdens conversatie
- [ ] "Afronden en krijg rapport" knop
- [ ] Gegevens formulier (naam + email)
- [ ] Smooth animaties en micro-interacties

#### Advies Pagina
- [ ] Unieke URL per gebruiker (`/advies/[userId]`)
- [ ] Wachtscherm met loading animatie
- [ ] Automatische polling voor resultaat (elke 3 sec)
- [ ] Timeout handling (max 2 minuten)
- [ ] Weergave van AI analyse/diagnose
- [ ] Gepersonaliseerde productaanbevelingen

#### Shopify Integratie
- [ ] Product data ophalen via Shopify Admin API
- [ ] Specifieke producten ophalen op basis van handle
- [ ] Product cards met afbeelding, titel, prijs
- [ ] "Toevoegen aan winkelwagen" functionaliteit
- [ ] Direct checkout via Shopify cart URL
- [ ] Bestaande `/store` pagina (alle producten)
- [ ] Bestaande `/store/[handle]` pagina (product detail)

#### Backend & Integraties
- [ ] API route voor chat (`/api/chat`)
- [ ] API route voor analyse submit (`/api/submit-analyse`)
- [ ] API route voor advies status/callback (`/api/advies/[userId]`)
- [ ] Webhook naar Make.com
- [ ] Callback endpoint voor Make.com resultaat
- [ ] Tijdelijke sessie opslag (in-memory)

---

### Should-have (Post-MVP)

#### Enhanced UX
- [ ] Chat suggestie chips (snelle antwoorden)
- [ ] Typing indicator tijdens AI response
- [ ] Chat history bewaren tijdens sessie
- [ ] Email bevestiging na analyse completion
- [ ] Social sharing van resultaten (optioneel)

#### Shopify Uitbreidingen
- [ ] Product filtering op categorie in `/store`
- [ ] Zoekfunctionaliteit voor producten
- [ ] "Bekijk ook" gerelateerde producten
- [ ] Voorraad status weergave
- [ ] Product reviews/ratings weergave

#### Analytics & Tracking
- [ ] Google Analytics 4 integratie
- [ ] Conversion tracking
- [ ] Heatmaps (Hotjar/Microsoft Clarity)
- [ ] A/B testing setup

#### Performance
- [ ] Image optimization (Next.js Image)
- [ ] Lazy loading voor product cards
- [ ] Caching strategie voor Shopify data

---

### Nice-to-have (Toekomst)

#### Geavanceerde Features
- [ ] Account aanmaken / inloggen
- [ ] Analyse geschiedenis bekijken
- [ ] Herhaalaankopen / abonnementen
- [ ] Wishlist functionaliteit
- [ ] Product vergelijking tool
- [ ] Live chat met specialist (fallback)

#### Shopify Geavanceerd
- [ ] Volledige cart management (mini-cart in header)
- [ ] Kortingscodes toepassen
- [ ] Bundle deals ("Koop 3 = 10% korting")
- [ ] Loyalty punten systeem

#### Personalisatie
- [ ] Terugkerende bezoekers herkennen
- [ ] Gepersonaliseerde homepage
- [ ] Email nurture campagnes
- [ ] Push notificaties

---

## Technical Architecture

### Tech Stack

| Component | Technologie |
|-----------|-------------|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Hosting | Vercel |
| Database | Supabase (toekomstig) |
| AI Chat | Mistral AI Agent API |
| E-commerce | Shopify (Admin API + Cart URL) |
| Automation | Make.com (webhook) |
| Email | Via Make.com |

### Shopify Integratie Details

#### Authenticatie Methode
```
Client Credentials Flow (OAuth 2.0)
├── Client ID: [via Shopify Partners Dashboard]
├── Client Secret: shpss_xxxxx
└── Scope: read_products
```

#### API Endpoints Gebruikt

| Endpoint | Methode | Doel |
|----------|---------|------|
| `/admin/oauth/access_token` | POST | Token verkrijgen |
| `/admin/api/2024-01/graphql.json` | POST | Product queries |

#### GraphQL Queries

**Alle producten ophalen:**
```graphql
query getProducts($first: Int!) {
  products(first: $first, query: "status:active") {
    edges {
      node {
        id
        title
        handle
        description
        vendor
        featuredImage { url, altText }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              availableForSale
            }
          }
        }
        priceRangeV2 {
          minVariantPrice { amount, currencyCode }
        }
      }
    }
  }
}
```

**Specifiek product ophalen (voor aanbevelingen):**
```graphql
query getProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    handle
    description
    featuredImage { url, altText }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price
          availableForSale
        }
      }
    }
    priceRangeV2 {
      minVariantPrice { amount, currencyCode }
    }
  }
}
```

#### Cart/Checkout Flow

```
Gebruiker klikt "Toevoegen aan winkelwagen"
           │
           ▼
┌─────────────────────────────────────┐
│ buildDirectCheckoutUrl(variantId)   │
│                                     │
│ Output:                             │
│ https://store.myshopify.com/cart/   │
│ {variantId}:{quantity}              │
└─────────────────────────────────────┘
           │
           ▼
    Redirect naar Shopify
    Hosted Checkout
```

#### Environment Variables

```bash
# Shopify Admin API (server-side)
SHOPIFY_SHOP_DOMAIN=berino-store.myshopify.com
SHOPIFY_CLIENT_ID=xxxxx
SHOPIFY_CLIENT_SECRET=shpss_xxxxx

# Shopify Cart (client-side)
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN=berino-store.myshopify.com
```

---

## Data Models

### Analyse Sessie

```typescript
interface AnalyseSessie {
  // Identifiers
  userId: string              // Uniek ID: "usr_" + nanoid()
  
  // Status
  status: 'created' | 'pending' | 'ready' | 'expired' | 'error'
  
  // User Input
  naam: string
  email: string
  transcript: ChatMessage[]
  
  // AI Output (na Make.com callback)
  advies?: {
    samenvatting: string
    diagnose: string[]
    aanbevolenProducten: string[]  // Shopify product handles
  }
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  expiresAt: Date              // +24 uur
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
```

### Product (van Shopify)

```typescript
interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  vendor: string
  productType: string
  featuredImage: {
    url: string
    altText: string | null
  } | null
  variants: ShopifyVariant[]
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
}

interface ShopifyVariant {
  id: string
  title: string
  price: { amount: string; currencyCode: string }
  availableForSale: boolean
}
```

---

## API Contracts

### POST /api/chat

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Ik heb last van droge hoofdhuid" }
  ]
}
```

**Response:**
```json
{
  "content": "Vervelend om te horen! Hoe lang heb je hier al last van?"
}
```

---

### POST /api/submit-analyse

**Request:**
```json
{
  "naam": "Jan Jansen",
  "email": "jan@email.nl",
  "transcript": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "userId": "usr_abc123def456",
  "redirectUrl": "/advies/usr_abc123def456"
}
```

---

### GET /api/advies/[userId]

**Response (pending):**
```json
{
  "status": "pending",
  "message": "Je rapport wordt gemaakt..."
}
```

**Response (ready):**
```json
{
  "status": "ready",
  "advies": {
    "samenvatting": "Op basis van je antwoorden...",
    "diagnose": [
      "Droge hoofdhuid",
      "Verminderde talgproductie"
    ],
    "aanbevolenProducten": [
      "hydraterende-shampoo",
      "hoofdhuid-serum",
      "voedend-haarmasker"
    ]
  }
}
```

---

### POST /api/advies/[userId] (Make.com Callback)

**Request:**
```json
{
  "secret": "WEBHOOK_SECRET_KEY",
  "advies": {
    "samenvatting": "...",
    "diagnose": ["...", "..."],
    "aanbevolenProducten": ["product-handle-1", "product-handle-2"]
  }
}
```

**Response:**
```json
{
  "success": true
}
```

---

## User Stories

### Epic 1: Homepage & Navigatie

| ID | Als... | Wil ik... | Zodat... |
|----|--------|-----------|----------|
| H1 | Bezoeker | Een duidelijke homepage zien | Ik begrijp wat deze site biedt |
| H2 | Bezoeker | Een opvallende CTA button zien | Ik weet hoe ik de analyse kan starten |
| H3 | Bezoeker | Zien hoe het proces werkt | Ik weet wat me te wachten staat |
| H4 | Bezoeker | Reviews van anderen lezen | Ik vertrouw de dienst meer |
| H5 | Bezoeker | Eenvoudig navigeren | Ik snel kan vinden wat ik zoek |

### Epic 2: AI Analyse

| ID | Als... | Wil ik... | Zodat... |
|----|--------|-----------|----------|
| A1 | Bezoeker | Een chat modal openen | Ik de analyse kan starten |
| A2 | Bezoeker | Vragen beantwoorden via chat | De AI mijn situatie begrijpt |
| A3 | Bezoeker | Mijn voortgang zien | Ik weet hoe ver ik ben |
| A4 | Bezoeker | De analyse kunnen afronden | Ik mijn rapport kan ontvangen |
| A5 | Bezoeker | Mijn gegevens invullen | Ik het rapport kan ontvangen |

### Epic 3: Advies & Producten

| ID | Als... | Wil ik... | Zodat... |
|----|--------|-----------|----------|
| P1 | Bezoeker | Een persoonlijke adviespagina zien | Ik mijn resultaten kan bekijken |
| P2 | Bezoeker | Een duidelijke diagnose lezen | Ik mijn probleem begrijp |
| P3 | Bezoeker | Aanbevolen producten zien | Ik weet wat ik moet kopen |
| P4 | Bezoeker | Direct kunnen afrekenen | Ik snel mijn producten kan bestellen |
| P5 | Bezoeker | Alle producten kunnen bekijken | Ik zelf ook kan rondkijken |

### Epic 4: Shopify Integratie

| ID | Als... | Wil ik... | Zodat... |
|----|--------|-----------|----------|
| S1 | Bezoeker | Productinformatie zien | Ik weet wat ik koop |
| S2 | Bezoeker | De prijs zien | Ik weet wat het kost |
| S3 | Bezoeker | Voorraadstatus zien | Ik weet of het leverbaar is |
| S4 | Bezoeker | Naar checkout gaan | Ik kan afrekenen |
| S5 | Eigenaar | Producten beheren in Shopify | Ik één bron van waarheid heb |

---

## Risico's & Mitigatie

| Risico | Impact | Kans | Mitigatie |
|--------|--------|------|-----------|
| Mistral AI downtime | Hoog | Laag | Fallback error message + retry |
| Make.com webhook faalt | Hoog | Laag | Timeout handling + error page |
| Shopify API rate limits | Medium | Laag | Caching (60 sec) |
| Lange AI response tijd | Medium | Medium | Progress indicators + timeout |
| Gebruiker verlaat chat | Medium | Medium | Progress bar + korte vragen |

---

## Timeline & Milestones

### Fase 1: Foundation (Week 1)
- [x] Project setup (Next.js, Tailwind)
- [x] Shopify integratie basis
- [ ] Design systeem implementatie
- [ ] Header & Footer componenten
- [ ] Homepage layout

### Fase 2: Core Features (Week 2)
- [ ] Chat modal component
- [ ] Mistral AI integratie
- [ ] Submit flow naar Make.com
- [ ] Advies pagina basis

### Fase 3: Polish & Launch (Week 3)
- [ ] Wachtscherm + polling
- [ ] Product aanbevelingen
- [ ] Styling refinement
- [ ] Testing & bugfixes
- [ ] Deployment

---

## Success Criteria voor Launch

- [ ] Homepage laadt in < 3 seconden
- [ ] Chat modal werkt op mobile en desktop
- [ ] Analyse flow compleet doorloopbaar
- [ ] Producten laden correct van Shopify
- [ ] Checkout redirect werkt
- [ ] Error handling voor alle edge cases
- [ ] Responsive design op alle breakpoints

---

## Appendix

### A. Shopify Product Handle Mapping

De AI in Make.com moet product handles teruggeven. Hier is de mapping van problemen naar producten:

| Probleem | Product Handle(s) |
|----------|-------------------|
| Droge hoofdhuid | `hydraterende-shampoo`, `hoofdhuid-serum` |
| Roos | `anti-roos-shampoo`, `scalp-treatment` |
| Vet haar | `balancing-shampoo`, `clay-mask` |
| Haarverlies | `strengthening-shampoo`, `hair-growth-serum` |
| Gevoelige hoofdhuid | `gentle-shampoo`, `calming-tonic` |

*Note: Exacte handles moeten overeenkomen met Shopify producten*

### B. Environment Variables Checklist

```bash
# Vercel Environment Variables

# Shopify
SHOPIFY_SHOP_DOMAIN=
SHOPIFY_CLIENT_ID=
SHOPIFY_CLIENT_SECRET=
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN=

# Mistral AI
MISTRAL_API_KEY=
MISTRAL_AGENT_ID=ag_019ba0dc73d275c7aa1c9a0f1f1045b9

# Make.com
WEBHOOK_URL=
WEBHOOK_SECRET=
```

### C. Gerelateerde Documenten

- [FLOW.md](./FLOW.md) - User en data flows
- [DESIGN.md](./DESIGN.md) - Visuele identiteit en componenten
