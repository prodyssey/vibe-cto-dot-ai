import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { IgnitionQualificationForm } from '@/components/IgnitionQualificationForm'
import { mockSupabaseClient, resetSupabaseMocks, mockSuccessfulInsert, mockFailedInsert } from '@/test/mocks/supabase'

// Mock the analytics module
vi.mock('@/lib/analytics', () => ({
  trackSavvyCalClick: vi.fn(),
}))

describe('IgnitionQualificationForm', () => {
  const mockOnSuccess = vi.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    resetSupabaseMocks()
    mockOnSuccess.mockClear()
    vi.clearAllMocks()
  })

  describe('Budget Selection Step', () => {
    it('renders budget options correctly', () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      expect(screen.getByText("Let's Check Your Readiness")).toBeInTheDocument()
      expect(screen.getByText("What's your budget for this project?")).toBeInTheDocument()
      
      // Check all budget options are present
      expect(screen.getByText('$15K - $50K+')).toBeInTheDocument()
      expect(screen.getByText('$5K - $15K')).toBeInTheDocument()
      expect(screen.getByText('$1 - $4,999')).toBeInTheDocument()
      expect(screen.getByText('Just my time')).toBeInTheDocument()
    })

    it('navigates to contact form when high budget is selected', async () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      const highBudgetOption = screen.getByLabelText(/\$15K - \$50K\+/)
      await user.click(highBudgetOption)
      
      // Should go directly to contact form
      expect(screen.getByText('Contact Information')).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
    })

    it('navigates to rate reduction form when mid budget is selected', async () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      const midBudgetOption = screen.getByLabelText(/\$5K - \$15K/)
      await user.click(midBudgetOption)
      
      // Should go to rate reduction form
      expect(screen.getByText('Rate Reduction Application')).toBeInTheDocument()
      expect(screen.getByText(/What is special about your project/)).toBeInTheDocument()
    })

    it('navigates to alternatives when low/no budget is selected', async () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      const lowBudgetOption = screen.getByLabelText(/\$1 - \$4,999/)
      await user.click(lowBudgetOption)
      
      // Should go to alternatives
      expect(screen.getByText('Alternative Options')).toBeInTheDocument()
      expect(screen.getByText("Let's Start with Learning")).toBeInTheDocument()
    })
  })

  describe('Contact Form Validation', () => {
    beforeEach(async () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      // Select high budget to go straight to contact form
      const highBudgetOption = screen.getByLabelText(/\$15K - \$50K\+/)
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
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      // Select high budget to go straight to contact form
      const highBudgetOption = screen.getByLabelText(/\$15K - \$50K\+/)
      await user.click(highBudgetOption)
      
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('your@email.com'), 'invalid-email')
      
      const submitButton = screen.getByRole('button', { name: /Continue to Scheduling/i })
      await user.click(submitButton)
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
      })
    })

    it('requires phone number when phone/text contact is preferred', async () => {
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com')
      
      // Select phone as preferred contact
      const phoneOption = screen.getByRole('radio', { name: /Phone/i })
      await user.click(phoneOption)
      
      const submitButton = screen.getByRole('button', { name: /Continue to Scheduling/i })
      expect(submitButton).toBeDisabled()
      
      // Add phone number
      await user.type(screen.getByLabelText(/Phone Number/), '+1234567890')
      expect(submitButton).not.toBeDisabled()
    })
  })

  describe('Form Submission', () => {
    it('successfully submits form with valid data', async () => {
      mockSuccessfulInsert('ignition_qualifications')
      
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      // Select high budget
      const highBudgetOption = screen.getByLabelText(/\$15K - \$50K\+/)
      await user.click(highBudgetOption)
      
      // Fill in contact form
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com')
      
      // Submit
      const submitButton = screen.getByRole('button', { name: /Continue to Scheduling/i })
      await user.click(submitButton)
      
      // Should show success state
      await waitFor(() => {
        expect(screen.getByText('Success!')).toBeInTheDocument()
      })
      
      // Should call onSuccess
      expect(mockOnSuccess).toHaveBeenCalled()
      
      // Should have called Supabase insert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('ignition_qualifications')
    })

    it('handles submission errors gracefully', async () => {
      mockFailedInsert('ignition_qualifications', { message: 'Database error' })
      
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      // Select high budget
      const highBudgetOption = screen.getByLabelText(/\$15K - \$50K\+/)
      await user.click(highBudgetOption)
      
      // Fill in contact form
      await user.type(screen.getByLabelText('Name'), 'John Doe')
      await user.type(screen.getByPlaceholderText('your@email.com'), 'john@example.com')
      
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
      mockSuccessfulInsert('ignition_qualifications')
      
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      // Select mid budget
      const midBudgetOption = screen.getByLabelText(/\$5K - \$15K/)
      await user.click(midBudgetOption)
      
      // Fill in rate reduction reason
      const reasonTextarea = screen.getByPlaceholderText(/Tell us about your situation/)
      await user.type(reasonTextarea, 'I have a great idea with strong social impact')
      
      // Continue to contact form
      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)
      
      // Fill in contact form
      await user.type(screen.getByLabelText('Name'), 'Jane Doe')
      await user.type(screen.getByPlaceholderText('your@email.com'), 'jane@example.com')
      
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
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      // Go to contact form via mid budget -> rate reduction
      const midBudgetOption = screen.getByLabelText(/\$5K - \$15K/)
      await user.click(midBudgetOption)
      
      const continueButton = screen.getByRole('button', { name: /Continue/i })
      await user.click(continueButton)
      
      // Should be on contact form
      expect(screen.getByText('Contact Information')).toBeInTheDocument()
      
      // Click back
      const backButton = screen.getByRole('button', { name: /Back/i })
      await user.click(backButton)
      
      // Should be back on rate reduction form
      expect(screen.getByText('Rate Reduction Application')).toBeInTheDocument()
    })

    it('allows going back from alternatives', async () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />)
      
      // Select low budget to go to alternatives
      const lowBudgetOption = screen.getByLabelText(/\$1 - \$4,999/)
      await user.click(lowBudgetOption)
      
      // Should be on alternatives
      expect(screen.getByText('Alternative Options')).toBeInTheDocument()
      
      // Click back
      const backButton = screen.getByRole('button', { name: /Back to Budget Options/i })
      await user.click(backButton)
      
      // Should be back on budget selection
      expect(screen.getByText("Let's Check Your Readiness")).toBeInTheDocument()
    })
  })
})