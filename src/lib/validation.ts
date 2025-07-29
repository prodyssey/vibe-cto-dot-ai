import { z } from 'zod';

// Common validation patterns
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

const optionalNameSchema = nameSchema.optional().or(z.literal(''));

// Sanitize HTML to prevent XSS
const sanitizeHtml = (value: string) => {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Session Email Form Schema
export const sessionEmailFormSchema = z.object({
  email: emailSchema,
  name: z.union([
    z.string().length(0), // Allow empty string if using generated name
    nameSchema,
  ]),
});

// Player Setup Form Schema
export const playerSetupFormSchema = z.object({
  playerName: nameSchema,
});

// Email Opt-In Form Schema
export const emailOptInFormSchema = z.object({
  email: emailSchema,
});

// Waitlist Form Schemas
export const waitlistFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  preferredContact: z.enum(['email', 'text', 'either'], {
    errorMap: () => ({ message: 'Please select a contact preference' }),
  }),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?1?\d{10,14}$/.test(val.replace(/[\s()-]/g, '')),
      'Please enter a valid phone number'
    ),
});

// Qualification Form Schema
export const qualificationFormSchema = z.object({
  budget: z.enum(['ready-high', 'ready-low', 'exploring'], {
    errorMap: () => ({ message: 'Please select a budget option' }),
  }),
  needsRateReduction: z.boolean(),
  rateReductionReason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional()
    .transform((val) => val ? sanitizeHtml(val) : val),
});

// LaunchControl specific waitlist schema
export const launchControlWaitlistSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  notificationPreference: z.enum(['email', 'call', 'either'], {
    errorMap: () => ({ message: 'Please select a notification preference' }),
  }),
});

// Type exports
export type SessionEmailFormData = z.infer<typeof sessionEmailFormSchema>;
export type PlayerSetupFormData = z.infer<typeof playerSetupFormSchema>;
export type EmailOptInFormData = z.infer<typeof emailOptInFormSchema>;
export type WaitlistFormData = z.infer<typeof waitlistFormSchema>;
export type QualificationFormData = z.infer<typeof qualificationFormSchema>;
export type LaunchControlWaitlistData = z.infer<typeof launchControlWaitlistSchema>;

// Validation helper
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { _form: 'Invalid form data' } };
  }
};