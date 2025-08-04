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
  mockSupabaseClient.from.mockReturnValueOnce({
    insert: vi.fn(() => Promise.resolve({ data: { id: 'test-id' }, error: null })),
  })
}

// Helper to mock a failed insert
export const mockFailedInsert = (table: string, error: any) => {
  mockSupabaseClient.from.mockReturnValueOnce({
    insert: vi.fn(() => Promise.resolve({ data: null, error })),
  })
}