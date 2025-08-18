import { vi } from 'vitest'

// Mock Supabase client
export const mockSupabaseClient = {
  from: vi.fn(() => ({
    insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    update: vi.fn(() => Promise.resolve({ data: null, error: null })),
    delete: vi.fn(() => Promise.resolve({ data: null, error: null })),
    upsert: vi.fn(() => Promise.resolve({ data: null, error: null })),
  })),
  auth: {
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    signUp: vi.fn(() => Promise.resolve({ data: null, error: null })),
    signInWithPassword: vi.fn(() => Promise.resolve({ data: null, error: null })),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
  },
}

// Mock the entire Supabase module
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}))

// Helper to reset all mocks
export const resetSupabaseMocks = () => {
  vi.clearAllMocks()
}

// Helper to mock a successful insert
export const mockSuccessfulInsert = (table: string) => {
  const mockChain = {
    insert: vi.fn(() => mockChain),
    update: vi.fn(() => mockChain),
    select: vi.fn(() => mockChain),
    eq: vi.fn(() => mockChain),
    single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
  }
  mockSupabaseClient.from.mockReturnValueOnce(mockChain)
}

// Helper to mock a failed insert
export const mockFailedInsert = (table: string, error: any) => {
  const mockChain = {
    insert: vi.fn(() => mockChain),
    update: vi.fn(() => mockChain),
    select: vi.fn(() => mockChain),
    eq: vi.fn(() => mockChain),
    single: vi.fn(() => Promise.resolve({ data: null, error })),
  }
  mockSupabaseClient.from.mockReturnValueOnce(mockChain)
}

// Helper to mock multiple successful operations (for full form flow)
export const mockMultipleOperations = (table: string) => {
  // First operation (insert for contact)
  const insertChain = {
    insert: vi.fn(() => insertChain),
    select: vi.fn(() => insertChain),
    eq: vi.fn(() => insertChain),
    single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
  }
  
  // Second operation (update for budget)
  const updateChain = {
    update: vi.fn(() => updateChain),
    eq: vi.fn(() => updateChain),
    single: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
  }
  
  mockSupabaseClient.from
    .mockReturnValueOnce(insertChain)
    .mockReturnValueOnce(updateChain)
}