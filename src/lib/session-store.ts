// src/lib/session-store.ts
// ============================================
// Temporary in-memory storage for analyse sessions
// In production, replace with Redis or database
// ============================================

export interface AdviesResult {
  samenvatting: string
  diagnose: string[]
  aanbevolenProducten: string[]
}

export interface AnalyseSessie {
  userId: string
  status: 'pending' | 'ready' | 'error' | 'expired'
  naam: string
  email: string
  advies?: AdviesResult
  error?: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

// In-memory store (resets on server restart)
// For production, use Redis, Vercel KV, or a database
const sessions = new Map<string, AnalyseSessie>()

// Session expiry time (24 hours)
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000

// Create a new session
export function createSession(userId: string, naam: string, email: string): AnalyseSessie {
  const now = new Date()
  const session: AnalyseSessie = {
    userId,
    status: 'pending',
    naam,
    email,
    createdAt: now,
    updatedAt: now,
    expiresAt: new Date(now.getTime() + SESSION_EXPIRY_MS),
  }
  sessions.set(userId, session)
  return session
}

// Get session by userId
export function getSession(userId: string): AnalyseSessie | null {
  const session = sessions.get(userId)
  
  if (!session) {
    return null
  }
  
  // Check if expired
  if (new Date() > session.expiresAt) {
    session.status = 'expired'
    sessions.set(userId, session)
  }
  
  return session
}

// Update session with advies result
export function updateSessionWithAdvies(userId: string, advies: AdviesResult): AnalyseSessie | null {
  const session = sessions.get(userId)
  
  if (!session) {
    return null
  }
  
  session.status = 'ready'
  session.advies = advies
  session.updatedAt = new Date()
  sessions.set(userId, session)
  
  return session
}

// Update session with error
export function updateSessionWithError(userId: string, error: string): AnalyseSessie | null {
  const session = sessions.get(userId)
  
  if (!session) {
    return null
  }
  
  session.status = 'error'
  session.error = error
  session.updatedAt = new Date()
  sessions.set(userId, session)
  
  return session
}

// Clean up expired sessions (call periodically)
export function cleanupExpiredSessions(): number {
  const now = new Date()
  let cleaned = 0
  
  sessions.forEach((session, userId) => {
    if (now > session.expiresAt) {
      sessions.delete(userId)
      cleaned++
    }
  })
  
  return cleaned
}

// For debugging
export function getSessionCount(): number {
  return sessions.size
}
