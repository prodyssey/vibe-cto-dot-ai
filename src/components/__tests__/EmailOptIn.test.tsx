import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { EmailOptIn } from '@/components/EmailOptIn'

// Mock fetch for ConvertKit API
global.fetch = vi.fn()

describe('EmailOptIn', () => {
  const user = userEvent.setup()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnSuccess.mockClear()
    // Reset fetch mock
    ;(global.fetch as any).mockReset()
  })

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<EmailOptIn />)
      
      expect(screen.getByText('Stay in the Loop')).toBeInTheDocument()
      expect(screen.getByText("Let's ride this wave together.")).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument()
    })

    it('renders with custom title and description', () => {
      render(
        <EmailOptIn 
          title="Custom Title" 
          description="Custom description text"
        />
      )
      
      expect(screen.getByText('Custom Title')).toBeInTheDocument()
      expect(screen.getByText('Custom description text')).toBeInTheDocument()
    })

    it('renders with custom button text', () => {
      render(<EmailOptIn buttonText="Join Now" />)
      
      expect(screen.getByRole('button', { name: /Join Now/i })).toBeInTheDocument()
    })

    it('renders minimal variant', () => {
      render(<EmailOptIn variant="minimal" />)
      
      // In minimal variant, there's no title or description
      expect(screen.queryByText('Stay in the Loop')).not.toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Subscribe/i })).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('successfully submits with valid email', async () => {
      // Mock successful response
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ subscription: { id: '123' } }),
      })
      
      render(<EmailOptIn onSuccess={mockOnSuccess} />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const submitButton = screen.getByRole('button', { name: /Subscribe/i })
      
      // Enter email and submit
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      // Wait for success state
      await waitFor(() => {
        expect(screen.getByText('Successfully subscribed!')).toBeInTheDocument()
      })
      
      // Should have called fetch with ConvertKit endpoint
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('kit.com/forms'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
        })
      )
      
      // Should call onSuccess
      expect(mockOnSuccess).toHaveBeenCalled()
    })

    it('handles submission errors gracefully', async () => {
      // Mock failed response
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      })
      
      render(<EmailOptIn />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const submitButton = screen.getByRole('button', { name: /Subscribe/i })
      
      // Enter email and submit
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      // Should show error state
      await waitFor(() => {
        expect(screen.getByText('Error - Please try again')).toBeInTheDocument()
      })
      
      // Form should still be visible
      expect(emailInput).toBeInTheDocument()
    })

    it('handles network errors gracefully', async () => {
      // Mock network error
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))
      
      render(<EmailOptIn />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const submitButton = screen.getByRole('button', { name: /Subscribe/i })
      
      // Enter email and submit
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      // Should show error state
      await waitFor(() => {
        expect(screen.getByText('Error - Please try again')).toBeInTheDocument()
      })
    })

    it('disables form during submission', async () => {
      // Mock successful response
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ subscription: { id: '123' } }),
      })
      
      render(<EmailOptIn />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const submitButton = screen.getByRole('button', { name: /Subscribe/i })
      
      // Enter email and submit
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      // Wait for success - form should be disabled after success
      await waitFor(() => {
        expect(screen.getByText('Successfully subscribed!')).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
        expect(emailInput).toBeDisabled()
      })
    })
  })

  describe('Email Validation', () => {
    it('requires email field', async () => {
      render(<EmailOptIn />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      
      // Check that email input has required attribute
      expect(emailInput).toHaveAttribute('required')
    })

    it('uses email input type for built-in validation', () => {
      render(<EmailOptIn />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      
      // Check that input has type="email"
      expect(emailInput).toHaveAttribute('type', 'email')
    })
  })

  describe('Minimal Variant', () => {
    it('handles submission in minimal variant', async () => {
      // Mock successful response
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ subscription: { id: '123' } }),
      })
      
      render(<EmailOptIn variant="minimal" onSuccess={mockOnSuccess} />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const submitButton = screen.getByRole('button', { name: /Subscribe/i })
      
      // Enter email and submit
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      // Should show success state
      await waitFor(() => {
        // In minimal variant, it shows a checkmark icon instead of text
        const button = screen.getByRole('button')
        expect(button.querySelector('svg')).toBeInTheDocument()
      })
      
      // Should call onSuccess
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
})