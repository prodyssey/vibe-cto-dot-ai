import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { mockSupabaseClient, resetSupabaseMocks } from '@/test/mocks/supabase'
import { CommunityWaitlistForm } from '@/components/CommunityWaitlistForm'

// Mock the ConvertKit module
vi.mock('@/lib/convertkit', () => ({
  subscribeToConvertKit: vi.fn().mockResolvedValue({ success: true }),
  getContextualTags: vi.fn().mockReturnValue(['community-waitlist']),
  getCustomFields: vi.fn().mockReturnValue({}),
}))

// Mock the Slack module  
vi.mock('@/lib/slack', () => ({
  sendSlackNotification: vi.fn().mockResolvedValue(undefined),
}))

describe('CommunityWaitlistForm', () => {
  const mockOnSuccess = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    resetSupabaseMocks()
    mockOnSuccess.mockClear()
    vi.clearAllMocks()
  })

  it('submits form with preferred_contact set to contact method (not contact info)', async () => {
    // Mock successful insert
    const mockInsert = vi.fn().mockResolvedValue({ data: { id: '123' }, error: null })
    mockSupabaseClient.from.mockReturnValue({
      insert: mockInsert,
    })

    render(
      <CommunityWaitlistForm 
        onSuccess={mockOnSuccess}
        source="test"
      />
    )

    // Fill out the form
    await user.type(screen.getByLabelText('Your Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com')
    await user.type(screen.getByLabelText(/Phone Number/), '555-123-4567')
    
    // Select phone as preferred contact method
    await user.click(screen.getByRole('radio', { name: /Phone/ }))
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Join Community Waitlist/i }))

    // Wait for form submission
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled()
    })

    // Verify the insert was called with correct data structure
    expect(mockInsert).toHaveBeenCalledWith({
      session_id: null,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      preferred_contact: 'phone', // This should be the contact method, not the phone number
      contact_method: 'phone',
      source: 'test',
      status: 'pending',
      opt_in_to_marketing: true,
      notes: null,
    })
  })

  it('submits form with preferred_contact set to email when email is selected', async () => {
    // Mock successful insert
    const mockInsert = vi.fn().mockResolvedValue({ data: { id: '123' }, error: null })
    mockSupabaseClient.from.mockReturnValue({
      insert: mockInsert,
    })

    render(
      <CommunityWaitlistForm 
        onSuccess={mockOnSuccess}
        source="test"
      />
    )

    // Fill out the form
    await user.type(screen.getByLabelText('Your Name'), 'Jane Smith')
    await user.type(screen.getByLabelText('Email Address'), 'jane@example.com')
    
    // Email is the default, but click it to be explicit
    await user.click(screen.getByLabelText(/Email \(recommended\)/))
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Join Community Waitlist/i }))

    // Wait for form submission
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled()
    })

    // Verify the insert was called with correct data structure
    expect(mockInsert).toHaveBeenCalledWith({
      session_id: null,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: null,
      preferred_contact: 'email', // This should be the contact method, not the email address
      contact_method: 'email',
      source: 'test',
      status: 'pending',
      opt_in_to_marketing: true,
      notes: null,
    })
  })

  it('submits form with preferred_contact set to either when either is selected', async () => {
    // Mock successful insert
    const mockInsert = vi.fn().mockResolvedValue({ data: { id: '123' }, error: null })
    mockSupabaseClient.from.mockReturnValue({
      insert: mockInsert,
    })

    render(
      <CommunityWaitlistForm 
        onSuccess={mockOnSuccess}
        source="test"
      />
    )

    // Fill out the form
    await user.type(screen.getByLabelText('Your Name'), 'Bob Johnson')
    await user.type(screen.getByLabelText('Email Address'), 'bob@example.com')
    await user.type(screen.getByLabelText(/Phone Number/), '555-987-6543')
    
    // Select "either" as preferred contact method
    await user.click(screen.getByLabelText(/Either works for me/))
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Join Community Waitlist/i }))

    // Wait for form submission
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled()
    })

    // Verify the insert was called with correct data structure
    expect(mockInsert).toHaveBeenCalledWith({
      session_id: null,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '555-987-6543',
      preferred_contact: 'either', // This should be the contact method, not combined contact info
      contact_method: 'either',
      source: 'test',
      status: 'pending',
      opt_in_to_marketing: true,
      notes: 'Phone: 555-987-6543', // Phone goes in notes when method is "either"
    })
  })

  it('handles database constraint violation error gracefully', async () => {
    // Mock constraint violation error (the bug this test is ensuring we fixed)
    const constraintError = {
      code: '23514',
      message: 'new row for relation "community_waitlist" violates check constraint "community_waitlist_preferred_contact_check"'
    }
    
    const mockInsert = vi.fn().mockResolvedValue({ 
      data: null, 
      error: constraintError 
    })
    mockSupabaseClient.from.mockReturnValue({
      insert: mockInsert,
    })

    render(
      <CommunityWaitlistForm 
        onSuccess={mockOnSuccess}
        source="test"
      />
    )

    // Fill out the form
    await user.type(screen.getByLabelText('Your Name'), 'Test User')
    await user.type(screen.getByLabelText('Email Address'), 'test@example.com')
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Join Community Waitlist/i }))

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to submit\. Please try again\./)).toBeInTheDocument()
    })

    // Ensure onSuccess was not called
    expect(mockOnSuccess).not.toHaveBeenCalled()
  })
})