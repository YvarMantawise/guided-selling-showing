# FLOW.md - Berino AI Hoofdhuid Analyse

## Overzicht

Dit document beschrijft de gebruikers- en dataflow voor de AI Hoofdhuid Analyse feature.

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GEBRUIKER FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   HOMEPAGE   │
    │              │
    │  [Doe hier   │
    │  je analyse] │──────────────────┐
    └──────────────┘                  │
                                      ▼
                         ┌────────────────────────┐
                         │     CHAT MODAL         │
                         │                        │
                         │  AI stelt vragen over: │
                         │  • Hoofdhuid klachten  │
                         │  • Haar problemen      │
                         │  • Huidige routines    │
                         │                        │
                         │  [Afronden en krijg    │
                         │       rapport]         │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
                         │   GEGEVENS FORMULIER   │
                         │                        │
                         │  • Naam                │
                         │  • Email               │
                         │                        │
                         │  [Verstuur]            │
                         └───────────┬────────────┘
                                     │
                                     ▼
                         ┌────────────────────────┐
                         │   REDIRECT NAAR        │
                         │   /advies/[userid]     │
                         │                        │
                         │   ┌────────────────┐   │
                         │   │  WACHTSCHERM   │   │
                         │   │                │   │
                         │   │  "Je rapport   │   │
                         │   │   wordt        │   │
                         │   │   gemaakt..."  │   │
                         │   │                │   │
                         │   │  [Loading]     │   │
                         │   └────────────────┘   │
                         └───────────┬────────────┘
                                     │
                                     │  (30-60 sec)
                                     │  Automatische update
                                     ▼
                         ┌────────────────────────┐
                         │   ADVIES PAGINA        │
                         │                        │
                         │   Jouw Analyse:        │
                         │   ──────────────       │
                         │   [Samenvatting van    │
                         │    de AI analyse]      │
                         │                        │
                         │   Aanbevolen voor jou: │
                         │   ──────────────────   │
                         │   ┌─────┐ ┌─────┐     │
                         │   │Prod │ │Prod │     │
                         │   │  A  │ │  B  │     │
                         │   │€25  │ │€30  │     │
                         │   └─────┘ └─────┘     │
                         │                        │
                         │   [Toevoegen aan       │
                         │    winkelwagen]        │
                         └────────────────────────┘
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               DATA FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│                  │      │                  │      │                  │
│   FRONTEND       │      │   BACKEND        │      │   EXTERNE        │
│   (Next.js)      │      │   (API Routes)   │      │   SERVICES       │
│                  │      │                  │      │                  │
└────────┬─────────┘      └────────┬─────────┘      └────────┬─────────┘
         │                         │                         │
         │                         │                         │
    ┌────┴────┐               ┌────┴────┐               ┌────┴────┐
    │         │               │         │               │         │
    │ Chat    │───message────▶│ /api/   │───prompt─────▶│ Mistral │
    │ Modal   │◀──response────│ chat    │◀──response────│ AI      │
    │         │               │         │               │         │
    └────┬────┘               └─────────┘               └─────────┘
         │
         │ [Afronden]
         │
    ┌────┴────┐               ┌─────────┐               ┌─────────┐
    │         │               │         │               │         │
    │ Form    │───submit─────▶│ /api/   │───webhook────▶│ Make    │
    │ Modal   │               │ submit  │               │ .com    │
    │         │               │         │               │         │
    └────┬────┘               └────┬────┘               └────┬────┘
         │                         │                         │
         │                         │ Genereer                │
         │                         │ uniek ID                │
         │                         │                         │
         ▼                         │                         │
    ┌─────────┐                    │                         │
    │         │                    │                         │
    │ Redirect│◀───userid──────────┘                         │
    │ naar    │                                              │
    │ /advies │                                              │
    │ /[id]   │                                              │
    │         │                                              │
    └────┬────┘                                              │
         │                                                   │
         │                                                   │
    ┌────┴────┐               ┌─────────┐                    │
    │         │               │         │                    │
    │ Wacht-  │───poll───────▶│ /api/   │◀───POST advisdata──┘
    │ scherm  │◀──status──────│ advies/ │    + product IDs
    │         │               │ [id]    │
    └────┬────┘               └────┬────┘
         │                         │
         │ Advies klaar!           │
         │                         │
    ┌────┴────┐               ┌────┴────┐               ┌─────────┐
    │         │               │         │               │         │
    │ Advies  │───request────▶│ /api/   │───GraphQL────▶│ Shopify │
    │ Pagina  │◀──products────│ shopify │◀──products────│ Store-  │
    │         │               │         │               │ front   │
    └─────────┘               └─────────┘               └─────────┘
```

---

## Technische Flow per Stap

### Stap 1: Homepage → Chat Modal

```typescript
// Gebruiker klikt op CTA button
// Modal opent met AI Chat component
```

**Trigger**: Click op "Doe hier je analyse" button
**Actie**: Open `<AnalyseModal />` component
**State**: `isModalOpen: true`

---

### Stap 2: AI Chat Conversatie

```typescript
// POST /api/chat
{
  messages: [
    { role: "user", content: "Ik heb last van droge hoofdhuid" },
    { role: "assistant", content: "..." },
    // ... conversatie history
  ],
  threadId: "thread_abc123" // optioneel, na eerste bericht
}

// Response
{
  content: "...",
  threadId: "thread_abc123",
  analyseKlaar: false // wordt true wanneer AI analyse_afronden tool aanroept
}
```

**Endpoint**: `POST /api/chat`
**Provider**: OpenAI Assistants API
**Assistant ID**: `asst_ZMYlpfsJCQlqEB6p1W8DVwpz`

**Tool: `analyse_afronden`**
De AI heeft een tool beschikbaar genaamd `analyse_afronden`. Zodra de AI voldoende informatie heeft verzameld, roept hij deze tool aan. De API detecteert dit (`requires_action` status) en geeft `analyseKlaar: true` terug in de response. De frontend gebruikt dit om de "Rapport aanvragen" knop te ontgrendelen — onafhankelijk van het aantal berichten.

---

### Stap 3-4: Afronden → Formulier

```typescript
// Gebruiker klikt "Afronden en krijg rapport"
// Form modal verschijnt
```

**State Change**: `showForm: true`
**Velden**: 
- `naam` (required)
- `email` (required)

---

### Stap 5-6: Submit naar Make.com

```typescript
// POST /api/submit-analyse
{
  userId: "usr_abc123def456",      // Gegenereerd door backend
  naam: "Jan Jansen",
  email: "jan@email.nl",
  transcript: [...messages],       // Volledige chat history
  submittedAt: "2025-01-09T..."
}

// Response
{
  success: true,
  userId: "usr_abc123def456",
  redirectUrl: "/advies/usr_abc123def456"
}
```

**Endpoint**: `POST /api/submit-analyse`
**Acties**:
1. Genereer uniek `userId`
2. Sla tijdelijke sessie op (in-memory of cache)
3. Stuur webhook naar Make.com
4. Return `userId` voor redirect

---

### Stap 7: Wachtscherm met Polling

```typescript
// GET /api/advies/[userId]
// Poll elke 3 seconden

// Response (wachtend)
{
  status: "pending",
  message: "Je rapport wordt gemaakt..."
}

// Response (klaar)
{
  status: "ready",
  advies: {
    samenvatting: "Op basis van je antwoorden...",
    aanbevolenProducten: [
      "hydraterende-shampoo",
      "hoofdhuid-serum"
    ]
  }
}
```

**Endpoint**: `GET /api/advies/[userId]`
**Polling interval**: 3 seconden
**Timeout**: 2 minuten (daarna error tonen)

---

### Stap 8: Make.com → API Callback

```typescript
// POST /api/advies/[userId] (vanuit Make.com)
{
  secret: "WEBHOOK_SECRET",        // Voor authenticatie
  advies: {
    samenvatting: "Analyse tekst...",
    aanbevolenProducten: [
      "product-handle-1",
      "product-handle-2",
      "product-handle-3"
    ]
  }
}
```

**Endpoint**: `POST /api/advies/[userId]`
**Authenticatie**: Webhook secret in header
**Actie**: Update sessie met advies data

---

### Stap 9: Producten Laden van Shopify

```typescript
// Intern in de advies pagina
const producten = await getProductsByHandles(advies.aanbevolenProducten)

// Shopify GraphQL Query
query getProductsByHandles($handles: [String!]!) {
  products(first: 10, query: "handle:handle1 OR handle:handle2") {
    edges {
      node {
        id
        title
        handle
        priceRange { ... }
        featuredImage { ... }
      }
    }
  }
}
```

**Functie**: `getProductsByHandles(handles: string[])`
**API**: Shopify Admin API (bestaande setup)

---

## State Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SESSIE STATE                                      │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   CREATED   │
                    │             │
                    │ userId      │
                    │ transcript  │
                    │ userInfo    │
                    └──────┬──────┘
                           │
                           │ Webhook sent
                           ▼
                    ┌─────────────┐
                    │   PENDING   │
                    │             │
                    │ Wacht op    │
                    │ Make.com    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            │            ▼
       ┌─────────────┐     │     ┌─────────────┐
       │    READY    │     │     │   EXPIRED   │
       │             │     │     │             │
       │ advies      │     │     │ Timeout     │
       │ productIds  │     │     │ > 2 min     │
       └─────────────┘     │     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    ERROR    │
                    │             │
                    │ Make.com    │
                    │ fout        │
                    └─────────────┘
```

---

## Tijdelijke Opslag Structuur

```typescript
// In-memory store (of Redis/Vercel KV voor productie)
interface AnalyseSessie {
  userId: string
  status: 'created' | 'pending' | 'ready' | 'expired' | 'error'
  
  // User data
  naam: string
  email: string
  transcript: Array<{ role: string; content: string }>
  
  // Advies data (na Make.com callback)
  advies?: {
    samenvatting: string
    aanbevolenProducten: string[]  // Product handles
  }
  
  // Timestamps
  createdAt: Date
  expiresAt: Date  // createdAt + 24 uur
}
```

---

## API Endpoints Overzicht

| Endpoint | Method | Beschrijving |
|----------|--------|--------------|
| `/api/chat` | POST | AI chat met Mistral |
| `/api/submit-analyse` | POST | Start analyse, stuur naar Make.com |
| `/api/advies/[userId]` | GET | Poll voor advies status |
| `/api/advies/[userId]` | POST | Callback van Make.com met resultaat |

---

## Error Handling

| Scenario | Actie |
|----------|-------|
| Chat API fout | Toon foutmelding, laat retry toe |
| Submit mislukt | Toon foutmelding, data blijft behouden |
| Webhook timeout (>2 min) | Toon "Er ging iets mis" + contact optie |
| Ongeldige userId | Redirect naar homepage |
| Sessie verlopen | Toon "Sessie verlopen" + nieuwe analyse optie |

---

## Security Overwegingen

1. **Webhook authenticatie**: Make.com callback moet secret header bevatten
2. **Rate limiting**: Max 10 chat requests per minuut per IP
3. **Data expiratie**: Sessies verlopen na 24 uur
4. **Input validatie**: Email format check, naam lengte check
