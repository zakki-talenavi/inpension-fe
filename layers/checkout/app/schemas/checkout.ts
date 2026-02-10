import { z } from 'zod'

export const CheckoutAddressSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  phone: z.string().regex(/^\d{10,}$/, 'Invalid phone number'),
})

export const CheckoutPaymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  cardName: z.string().min(3, 'Name on card must be at least 3 characters'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
  saveCard: z.boolean().optional(),
})

export const CheckoutSchema = z.object({
  shippingAddress: CheckoutAddressSchema,
  billingAddress: CheckoutAddressSchema.optional(),
  sameAsBilling: z.boolean().default(true),
  payment: CheckoutPaymentSchema,
  notes: z.string().max(500, 'Notes too long').optional(),
})

export type CheckoutAddress = z.infer<typeof CheckoutAddressSchema>
export type CheckoutPayment = z.infer<typeof CheckoutPaymentSchema>
export type Checkout = z.infer<typeof CheckoutSchema>
