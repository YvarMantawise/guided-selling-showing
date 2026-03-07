// src/app/api/chat/route.ts
// ============================================
// API endpoint for AI chat conversation
// Connects to OpenAI Assistants API
// ============================================

import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_ZMYlpfsJCQlqEB6p1W8DVwpz'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Helper function for OpenAI API calls
async function openaiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`https://api.openai.com/v1${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Beta': 'assistants=v2',
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.text()
    console.error('OpenAI API error:', response.status, error)
    throw new Error(`OpenAI API error: ${response.status}`)
  }
  
  return response.json()
}

// Create a new thread
async function createThread() {
  return openaiRequest('/threads', {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

// Add a message to a thread
async function addMessage(threadId: string, content: string) {
  return openaiRequest(`/threads/${threadId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      role: 'user',
      content: content,
    }),
  })
}

// Tool definition: AI calls this when it has gathered enough information
const ANALYSE_TOOL = {
  type: 'function',
  function: {
    name: 'analyse_afronden',
    description:
      'Roep deze tool aan wanneer je voldoende informatie hebt verzameld om een persoonlijk advies op te stellen. Dit ontgrendelt de "Rapport aanvragen" knop voor de gebruiker.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
}

// Create a run with the analyse_afronden tool available
async function createRun(threadId: string) {
  return openaiRequest(`/threads/${threadId}/runs`, {
    method: 'POST',
    body: JSON.stringify({
      assistant_id: OPENAI_ASSISTANT_ID,
      tools: [ANALYSE_TOOL],
    }),
  })
}

// Check run status
async function getRun(threadId: string, runId: string) {
  return openaiRequest(`/threads/${threadId}/runs/${runId}`, {
    method: 'GET',
  })
}

// Submit tool outputs back to a run
async function submitToolOutputs(
  threadId: string,
  runId: string,
  toolOutputs: { tool_call_id: string; output: string }[]
) {
  return openaiRequest(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
    method: 'POST',
    body: JSON.stringify({ tool_outputs: toolOutputs }),
  })
}

// Get messages from thread
async function getMessages(threadId: string) {
  return openaiRequest(`/threads/${threadId}/messages?order=desc&limit=1`, {
    method: 'GET',
  })
}

// Poll for run completion; returns whether the AI called analyse_afronden
async function waitForRunCompletion(
  threadId: string,
  runId: string,
  maxAttempts = 60
): Promise<{ analyseKlaar: boolean }> {
  let analyseKlaar = false

  for (let i = 0; i < maxAttempts; i++) {
    const run = await getRun(threadId, runId)

    if (run.status === 'completed') {
      return { analyseKlaar }
    }

    if (run.status === 'requires_action' && run.required_action?.type === 'submit_tool_outputs') {
      const toolCalls: { id: string; function: { name: string } }[] =
        run.required_action.submit_tool_outputs.tool_calls || []

      if (toolCalls.some((tc) => tc.function.name === 'analyse_afronden')) {
        analyseKlaar = true
      }

      // Submit outputs for all pending tool calls, then continue polling
      await submitToolOutputs(
        threadId,
        run.id,
        toolCalls.map((tc) => ({ tool_call_id: tc.id, output: JSON.stringify({ success: true }) }))
      )
      continue
    }

    if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'expired') {
      throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`)
    }

    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  throw new Error('Run timed out')
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured')
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { messages, threadId: existingThreadId } = body as { 
      messages: Message[]
      threadId?: string 
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      )
    }

    // Get the latest user message
    const latestUserMessage = [...messages].reverse().find(m => m.role === 'user')
    
    if (!latestUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      )
    }

    let threadId: string

    // Create new thread if none exists, or use existing
    if (existingThreadId) {
      threadId = existingThreadId
    } else {
      const thread = await createThread()
      threadId = thread.id
      console.log('Created new thread:', threadId)
    }

    // Add the latest user message
    await addMessage(threadId, latestUserMessage.content)

    // Create a run
    const run = await createRun(threadId)
    console.log('Created run:', run.id)

    // Wait for completion; check if AI called analyse_afronden
    const { analyseKlaar } = await waitForRunCompletion(threadId, run.id)

    // Get the assistant's response
    const messagesResponse = await getMessages(threadId)
    const assistantMessage = messagesResponse.data?.[0]

    if (!assistantMessage || assistantMessage.role !== 'assistant') {
      throw new Error('No assistant response found')
    }

    // Extract text content
    const textContent = assistantMessage.content?.find((c: { type: string }) => c.type === 'text')
    const responseText = textContent?.text?.value || ''

    if (!responseText) {
      throw new Error('Empty response from assistant')
    }

    return NextResponse.json({
      content: responseText,
      threadId: threadId,
      analyseKlaar: analyseKlaar, // true when AI has called analyse_afronden
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}
