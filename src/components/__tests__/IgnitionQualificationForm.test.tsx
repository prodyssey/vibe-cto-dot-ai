import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@/test/utils";
import userEvent from "@testing-library/user-event";
// Import and activate the Supabase mock BEFORE importing the component
import {
  mockSupabaseClient,
  resetSupabaseMocks,
  mockSuccessfulInsert,
  mockFailedInsert,
  mockMultipleOperations,
} from "@/test/mocks/supabase";
import { IgnitionQualificationForm } from "@/components/IgnitionQualificationForm";

// Mock the analytics module
vi.mock("@/lib/analytics", () => ({
  trackSavvyCalClick: vi.fn(),
}));

describe("IgnitionQualificationForm", () => {
  const mockOnSuccess = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    resetSupabaseMocks();
    mockOnSuccess.mockClear();
    vi.clearAllMocks();
  });

  describe("Budget Selection Step", () => {
    it("renders budget options correctly", async () => {
      mockSuccessfulInsert("ignition_qualifications");
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />);

      // Fill in contact form first to get to budget step
      await user.type(screen.getByLabelText("Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");
      
      const continueButton = screen.getByRole("button", { name: /Continue/i });
      await user.click(continueButton);

      // Wait for the step transition
      await waitFor(() => {
        expect(screen.getByText("Investment Planning")).toBeInTheDocument();
      });

      // Check all budget options are present - these are the range labels in quick select buttons
      expect(screen.getAllByText("Just exploring")).toHaveLength(2); // Appears in display and button
      expect(screen.getByText("Starter budget")).toBeInTheDocument();
      expect(screen.getByText("Low-Mid budget")).toBeInTheDocument();
      expect(screen.getByText("Ready to invest")).toBeInTheDocument();
    });

    it("completes when ready to invest budget is selected", async () => {
      mockMultipleOperations("ignition_qualifications");
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />);

      // Fill in contact form first to get to budget step
      await user.type(screen.getByLabelText("Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");
      
      const continueButton = screen.getByRole("button", { name: /Continue/i });
      await user.click(continueButton);

      // Wait for the step transition
      await waitFor(() => {
        expect(screen.getByText("Investment Planning")).toBeInTheDocument();
      });

      // Select high budget option
      const highBudgetOption = screen.getByText("Ready to invest");
      await user.click(highBudgetOption);

      // Complete the registration
      const completeButton = screen.getByRole("button", { name: /Complete Registration/i });
      await user.click(completeButton);

      // Should show success state
      await waitFor(() => {
        expect(screen.getByText("Thank You, John Doe!")).toBeInTheDocument();
      });
    });

  });

  describe("Contact Form Validation", () => {
    beforeEach(async () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />);
      // Form starts with contact step, no need to navigate
    });

    it("validates required fields", async () => {
      const submitButton = screen.getByRole("button", {
        name: /Continue/i,
      });

      // Button should be disabled when fields are empty
      expect(submitButton).toBeDisabled();

      // Fill in name
      await user.type(screen.getByLabelText("Name"), "John Doe");
      expect(submitButton).toBeDisabled();

      // Fill in email - use placeholder text to avoid ambiguity with email radio button
      await user.type(
        screen.getByPlaceholderText("your@email.com"),
        "john@example.com"
      );
      expect(submitButton).not.toBeDisabled();
    });

    it("validates email format", async () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText("Name"), "John Doe");
      // Get all email inputs and use the first one
      const emailInputs = screen.getAllByPlaceholderText("your@email.com");
      await user.type(emailInputs[0], "invalid-email");

      const submitButtons = screen.getAllByRole("button", {
        name: /Continue/i,
      });
      await user.click(submitButtons[0]);

      // Should show validation error - multiple errors may appear
      await waitFor(() => {
        const errors = screen.getAllByText(
          /Please enter a valid email address/i
        );
        expect(errors.length).toBeGreaterThan(0);
      });
    });

    it("requires phone number when phone/text contact is preferred", async () => {
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText("Name"), "John Doe");
      const emailInputs = screen.getAllByPlaceholderText("your@email.com");
      await user.type(emailInputs[0], "john@example.com");

      // Select phone as preferred contact - use getAllByRole to handle duplicates
      const phoneOptions = screen.getAllByRole("radio", { name: /Phone/i });
      await user.click(phoneOptions[0]);

      const submitButtons = screen.getAllByRole("button", {
        name: /Continue/i,
      });
      const submitButton = submitButtons[0];
      expect(submitButton).toBeDisabled();

      // Add phone number
      await user.type(screen.getByLabelText(/Phone Number/), "+1234567890");
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Form Submission", () => {
    it("successfully submits form with valid data", async () => {
      mockMultipleOperations("ignition_qualifications");

      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />);

      // Fill in contact form
      await user.type(screen.getByLabelText("Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");

      // Submit contact form to go to budget step
      const continueButton = screen.getByRole("button", {
        name: /Continue/i,
      });
      await user.click(continueButton);

      // Wait for budget step
      await waitFor(() => {
        expect(screen.getByText("Investment Planning")).toBeInTheDocument();
      });

      // Select a budget option
      const budgetOption = screen.getByText("Ready to invest");
      await user.click(budgetOption);

      // Complete registration
      const completeButton = screen.getByRole("button", {
        name: /Complete Registration/i,
      });
      await user.click(completeButton);

      // Should show success state
      await waitFor(() => {
        expect(screen.getByText("Thank You, John Doe!")).toBeInTheDocument();
      });

      // Should call onSuccess
      expect(mockOnSuccess).toHaveBeenCalled();

      // Should have called Supabase from twice (once for insert, once for update)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith(
        "ignition_qualifications"
      );
    });

    it("handles submission errors gracefully", async () => {
      mockFailedInsert("ignition_qualifications", {
        message: "Database error",
      });

      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />);

      // Fill in contact form
      await user.type(screen.getByLabelText("Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");

      // Submit contact form - this should fail
      const continueButton = screen.getByRole("button", {
        name: /Continue/i,
      });
      await user.click(continueButton);

      // Should show error toast
      await waitFor(() => {
        expect(
          screen.getByText(
            "Failed to save your information. Please try again."
          )
        ).toBeInTheDocument();
      });

      // Should not call onSuccess
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });


  describe("Navigation", () => {
    it("allows going back from budget step to contact", async () => {
      mockSuccessfulInsert("ignition_qualifications");
      render(<IgnitionQualificationForm onSuccess={mockOnSuccess} />);

      // Fill in contact form and proceed to budget
      await user.type(screen.getByLabelText("Name"), "John Doe");
      await user.type(screen.getByPlaceholderText("your@email.com"), "john@example.com");

      const continueButton = screen.getByRole("button", { name: /Continue/i });
      await user.click(continueButton);

      // Should be on budget step
      await waitFor(() => {
        expect(screen.getByText("Investment Planning")).toBeInTheDocument();
      });

      // Click back
      const backButton = screen.getByRole("button", { name: /Back/i });
      await user.click(backButton);

      // Should be back on contact form
      expect(screen.getByText("Let's Get Started")).toBeInTheDocument();
    });
  });
});
