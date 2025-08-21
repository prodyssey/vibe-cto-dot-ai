import { vi } from 'vitest'

// Helper functions for setting up common mock scenarios
export const mockSuccessfulInsert = (data: any = { id: '123' }) => {
  const mockResult = {
    data,
    error: null,
  }
  
  const mockSingleChain = vi.fn().mockResolvedValue(mockResult)
  const mockSelectChain = vi.fn().mockReturnValue({
    single: mockSingleChain
  })
  const mockInsertChain = vi.fn().mockReturnValue({
    select: mockSelectChain
  })
  
  return { mockInsertChain, mockSelectChain, mockSingleChain, mockResult }
}

export const mockFailedInsert = (error: any = { message: 'Database error' }) => {
  const mockResult = {
    data: null,
    error,
  }
  
  const mockSingleChain = vi.fn().mockResolvedValue(mockResult)
  const mockSelectChain = vi.fn().mockReturnValue({
    single: mockSingleChain
  })
  const mockInsertChain = vi.fn().mockReturnValue({
    select: mockSelectChain
  })
  
  return { mockInsertChain, mockSelectChain, mockSingleChain, mockResult }
}

export const mockMultipleOperations = (operations: { data?: any; error?: any }[]) => {
  let callIndex = 0
  
  const mockSingleChain = vi.fn().mockImplementation(() => {
    const result = operations[callIndex] || operations[0]
    callIndex++
    return Promise.resolve(result)
  })
  
  const mockSelectChain = vi.fn().mockReturnValue({
    single: mockSingleChain
  })
  
  const mockInsertChain = vi.fn().mockReturnValue({
    select: mockSelectChain
  })
  
  return { mockInsertChain, mockSelectChain, mockSingleChain }
}

// Create a mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    signInAnonymously: vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: null
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    }),
  },
}

// Mock the Supabase client module
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}))

export const resetSupabaseMocks = () => {
  vi.clearAllMocks()
  mockSupabaseClient.from.mockClear()
  mockSupabaseClient.auth.signInAnonymously.mockClear()
  mockSupabaseClient.auth.getSession.mockClear()
  mockSupabaseClient.auth.onAuthStateChange.mockClear()
  
  // Set up default successful behavior for all operations
  const { mockInsertChain } = mockSuccessfulInsert()
  
  // Mock update operations with eq chains
  const mockUpdateResult = { data: { id: '123' }, error: null }
  const mockEqChain = vi.fn().mockResolvedValue(mockUpdateResult)
  const mockUpdateChain = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      eq: mockEqChain
    })
  })
  
  mockSupabaseClient.from.mockReturnValue({
    insert: mockInsertChain,
    update: mockUpdateChain,
  })
}

export { mockSupabaseClient }