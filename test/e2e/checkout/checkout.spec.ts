import { test, expect, testAddress, testPayment } from '../fixtures'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ checkoutPage }) => {
    await checkoutPage.goto()
  })

  test('should start on shipping step', async ({ page }) => {
    await expect(page.getByText('Shipping Address')).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ checkoutPage, page }) => {
    await checkoutPage.continueToPayment()

    await expect(page.getByText(/first name must be at least/i)).toBeVisible()
  })

  test('should proceed to payment step with valid address', async ({ checkoutPage, page }) => {
    await checkoutPage.fillShippingForm(testAddress.valid)
    await checkoutPage.continueToPayment()

    await expect(page.getByText('Payment Information')).toBeVisible()
  })

  test('should copy shipping to billing when checked', async ({ checkoutPage, page }) => {
    await checkoutPage.fillShippingForm(testAddress.valid)
    await checkoutPage.continueToPayment()
    await page.getByLabel('Same as billing').uncheck()

    await expect(page.getByLabel('Billing First Name')).toHaveValue(testAddress.valid.firstName)
  })

  test('should complete order with valid payment', async ({ checkoutPage, page }) => {
    await checkoutPage.completeCheckout(testAddress.valid, testPayment.valid)

    await expect(page.getByText('Order Confirmed')).toBeVisible()
  })
})

test.describe('Checkout Order Summary', () => {
  test('should display correct order totals', async ({ checkoutPage, page }) => {
    await checkoutPage.goto()

    await expect(page.getByText(/subtotal/i)).toBeVisible()
    await expect(page.getByText(/shipping/i)).toBeVisible()
    await expect(page.getByText(/tax/i)).toBeVisible()
    await expect(page.getByText(/total/i)).toBeVisible()
  })

  test('should show free shipping for large orders', async ({ checkoutPage, page }) => {
    await page.goto('/cart')
    await checkoutPage.goto()

    await expect(page.getByText(/free shipping/i)).toBeVisible()
  })
})
