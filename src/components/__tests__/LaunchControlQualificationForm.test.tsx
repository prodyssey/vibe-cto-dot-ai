import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
// Import and activate the Supabase mock BEFORE importing the component
import '@/test/mocks/supabase'
import { mockSupabaseClient, resetSupabaseMocks, mockSuccessfulInsert, mockFailedInsert } from '@/test/mocks/supabase'
import { LaunchControlQualificationForm } from '@/components/LaunchControlQualificationForm'

// Mock the analytics module
vi.mock('@/lib/analytics', () => ({
  trackSavvyCalClick: vi.fn(),
}))

describe('LaunchControlQualificationForm', () => {
  const mockOnSuccess = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    resetSupabaseMocks()
    mockOnSuccess.mockClear()
    vi.clearAllMocks()
  })

  describe('Budget Selection Step', () => {
    it('renders budget options correctly', () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      expect(screen.getByText('Mission Readiness Check')).toBeInTheDocument()
      expect(screen.getByText("What's your budget for this scaling mission?")).toBeInTheDocument()
      
      // Check all budget options are present
      expect(screen.getByText('$40K - $75K+')).toBeInTheDocument()
      expect(screen.getByText('$15K - $40K')).toBeInTheDocument()
      expect(screen.getByText('$1 - $14,999')).toBeInTheDocument()
      expect(screen.getByText('Just my time')).toBeInTheDocument()
    })

    it('navigates to contact form when high budget is selected', async () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      const highBudgetOption = screen.getByLabelText(/\$40K - \$75K\+/)
      await user.click(highBudgetOption)
      
      // Should go directly to contact form
      expect(screen.getByText('Mission Contact Information')).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
    })

    it('navigates to rate reduction form when mid budget is selected', async () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      const midBudgetOption = screen.getByLabelText(/\$15K - \$40K/)
      await user.click(midBudgetOption)
      
      // Should go to rate reduction form
      expect(screen.getByText('Special Mission Application')).toBeInTheDocument()
      expect(screen.getByText(/Why should we consider you for our special mission rate/)).toBeInTheDocument()
    })

    it('navigates to alternatives when low/no budget is selected', async () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      const lowBudgetOption = screen.getByLabelText(/\$1 - \$14,999/)
      await user.click(lowBudgetOption)
      
      // Should go to alternatives
      expect(screen.getByText('Alternative Flight Paths')).toBeInTheDocument()
      expect(screen.getByText('Prepare for Your Mission')).toBeInTheDocument()
    })
  })

  describe('Contact Form Validation', () => {
    beforeEach(async () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      // Select high budget to go straight to contact form
      const highBudgetOption = screen.getByLabelText(/\$40K - \$75K\+/)
      await user.click(highBudgetOption)
    })

    it('validates required fields', async () => {
      const submitButton = screen.getByRole('button', { name: /Continue to Scheduling/i })
      
      // Button should be disabled when fields are empty
      expect(submitButton).toBeDisabled()
      
      // Fill in name
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      expect(submitButton).toBeDisabled()
      
      // Fill in email - use placeholder text to avoid ambiguity with email radio button
      await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com')
      expect(submitButton).not.toBeDisabled()
    })

    it('validates email format', async () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      // Select high budget to go straight to contact form
      const highBudgetOption = screen.getByLabelText(/\$40K - \$75K\+/)
      await user.click(highBudgetOption)
      
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      // Get all email inputs and use the first one
      const emailInputs = screen.getAllByPlaceholderText('your@email.com')
      await user.type(emailInputs[0], 'invalid-email')
      
      const submitButtons = screen.getAllByRole('button', { name: /Continue to Scheduling/i })
      await user.click(submitButtons[0])
      
      // Should show validation error - multiple errors may appear
      await waitFor(() => {
        const errors = screen.getAllByText(/Please enter a valid email address/i)
        expect(errors.length).toBeGreaterThan(0)
      })
    })

    it('requires phone number when phone/text contact is preferred', async () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      // Select high budget to go straight to contact form
      const highBudgetOption = screen.getByLabelText(/\$40K - \$75K\+/)
      await user.click(highBudgetOption)
      
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      const emailInputs = screen.getAllByPlaceholderText('your@email.com')
      await user.type(emailInputs[0], 'john@example.com')
      
      // Select phone as preferred contact - use getAllByRole to handle duplicates
      const phoneOptions = screen.getAllByRole('radio', { name: /Phone/i })
      await user.click(phoneOptions[0])
      
      const submitButtons = screen.getAllByRole('button', { name: /Continue to Scheduling/i })
      const submitButton = submitButtons[0]
      expect(submitButton).toBeDisabled()
      
      // Add phone number
      await user.type(screen.getByLabelText(/Phone Number/), '+1234567890')
      expect(submitButton).not.toBeDisabled()
    })
  })

  describe('Form Submission', () => {
    it('successfully submits form with valid data', async () => {
      mockSuccessfulInsert('launch_control_qualifications')
      
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      // Select high budget
      const highBudgetOption = screen.getByLabelText(/\$40K - \$75K\+/)
      await user.click(highBudgetOption)
      
      // Fill in contact form
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      // Get all email inputs and use the first one
      const emailInputs = screen.getAllByPlaceholderText('your@email.com')
      await user.type(emailInputs[0], 'john@example.com')
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /Continue to Scheduling/i })
      await user.click(submitButton)
      
      // Should show success state
      await waitFor(() => {
        expect(screen.getByText('Mission Briefing Scheduled!')).toBeInTheDocument()
      })
      
      // Should call onSuccess
      expect(mockOnSuccess).toHaveBeenCalled()
      
      // Should have called Supabase insert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('launch_control_qualifications')
    })

    it('handles submission errors gracefully', async () => {
      mockFailedInsert('launch_control_qualifications', { message: 'Database error' })
      
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      // Select high budget
      const highBudgetOption = screen.getByLabelText(/\$40K - \$75K\+/)
      await user.click(highBudgetOption)
      
      // Fill in contact form
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      // Get all email inputs and use the first one
      const emailInputs = screen.getAllByPlaceholderText('your@email.com')
      await user.type(emailInputs[0], 'john@example.com')
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /Continue to Scheduling/i })
      await user.click(submitButton)
      
      // Should show error toast
      await waitFor(() => {
        expect(screen.getByText('Failed to submit your information. Please try again.')).toBeInTheDocument()
      })
      
      // Should not call onSuccess
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })

  describe('Rate Reduction Flow', () => {
    it('allows submission with rate reduction reason', async () => {
      mockSuccessfulInsert('launch_control_qualifications')
      
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      // Select mid budget
      const midBudgetOption = screen.getByLabelText(/\$15K - \$40K/)
      await user.click(midBudgetOption)
      
      // Fill in rate reduction reason
      const reasonTextarea = screen.getByPlaceholderText(/Tell us about your current traction/)
      await user.type(reasonTextarea, 'We have strong traction with 1000 active users')
      
      // Continue to contact form
      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)
      
      // Fill in contact form
      await user.type(screen.getByLabelText('Name'), 'Jane Doe')
      // Get all email inputs and use the first one
      const emailInputs = screen.getAllByPlaceholderText('your@email.com')
      await user.type(emailInputs[0], 'jane@example.com')
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /Submit Application/i })
      await user.click(submitButton)
      
      // Should show success state
      await waitFor(() => {
        expect(screen.getByText('Application Submitted!')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('allows going back from contact form', async () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      // Go to contact form via mid budget -> rate reduction
      const midBudgetOption = screen.getByLabelText(/\$15K - \$40K/)
      await user.click(midBudgetOption)
      
      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)
      
      // Should be on contact form
      expect(screen.getByText('Mission Contact Information')).toBeInTheDocument()
      
      // Click back
      const backButton = screen.getByRole('button', { name: /Back/i })
      await user.click(backButton)
      
      // Should be back on rate reduction form
      expect(screen.getByText('Special Mission Application')).toBeInTheDocument()
    })

    it('allows going back from alternatives', async () => {
      render(<LaunchControlQualificationForm onSuccess={mockOnSuccess} />)
      
      // Select low budget to go to alternatives
      const lowBudgetOption = screen.getByLabelText(/\$1 - \$14,999/)
      await user.click(lowBudgetOption)
      
      // Should be on alternatives
      expect(screen.getByText('Alternative Flight Paths')).toBeInTheDocument()
      
      // Click back
      const backButton = screen.getByRole('button', { name: /Back to Budget Options/i })
      await user.click(backButton)
      
      // Should be back on budget selection
      expect(screen.getByText('Mission Readiness Check')).toBeInTheDocument()
    })
  })
})