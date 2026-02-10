import { test as base, type Page } from '@playwright/test'

export class AuthPage {
  constructor(public readonly page: Page) { }

  async goto() {
    await this.page.goto('/login')
  }

  async gotoRegister() {
    await this.page.goto('/register')
  }

  async fillLogin(email: string, password: string) {
    // Revert to placeholder approach which was working for Firefox
    // Use type() for more realistic typing that works better with Vue reactivity
    const emailInput = this.page.getByPlaceholder('you@example.com')
    await emailInput.waitFor({ state: 'visible', timeout: 10000 })
    await emailInput.click()
    await this.page.waitForTimeout(50)
    await emailInput.type(email, { delay: 50 })

    const passwordInput = this.page.getByPlaceholder('••••••••')
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 })
    await passwordInput.click()
    await this.page.waitForTimeout(50)
    await passwordInput.type(password, { delay: 50 })
  }

  async submitLogin() {
    await this.page.getByRole('button', { name: 'Sign In' }).click()
  }

  async login(email: string, password: string) {
    await this.fillLogin(email, password)
    await this.submitLogin()
    await this.page.waitForURL('/')
  }

  async fillRegistration(data: { name: string; email: string; password: string; confirmPassword: string }) {
    await this.page.getByLabel('Name').fill(data.name)
    await this.page.getByLabel('Email').fill(data.email)
    await this.page.getByLabel('Password', { exact: true }).fill(data.password)
    await this.page.getByLabel('Confirm Password').fill(data.confirmPassword)
  }

  async submitRegistration() {
    await this.page.getByRole('button', { name: 'Create Account' }).click()
  }

  async register(name: string, email: string, password: string) {
    await this.fillRegistration({ name, email, password, confirmPassword: password })
    await this.submitRegistration()
    await this.page.waitForURL('/')
  }

  getHeading() {
    return this.page.getByRole('heading')
  }

  getEmailInput() {
    return this.page.getByPlaceholder('you@example.com')
  }

  getPasswordInput() {
    return this.page.getByPlaceholder('••••••••')
  }

  getSignInButton() {
    return this.page.getByRole('button', { name: 'Sign In' })
  }

  getCreateAccountButton() {
    return this.page.getByRole('button', { name: 'Create Account' })
  }
}

export class ProductsPage {
  constructor(public readonly page: Page) { }

  async goto() {
    await this.page.goto('/')
    // Wait for the search input to be visible
    await this.page.getByPlaceholder(/search/i).waitFor({ state: 'visible', timeout: 10000 })
  }

  async gotoSearch() {
    await this.page.goto('/search')
  }

  getSearchInput() {
    return this.page.getByPlaceholder(/search/i)
  }

  getSearchButton() {
    return this.page.getByRole('button', { name: 'Search' })
  }

  getProductCards() {
    return this.page.locator('[data-testid="product-card"]')
  }

  async search(query: string) {
    const searchInput = this.getSearchInput()
    await searchInput.waitFor({ state: 'visible', timeout: 10000 })
    await searchInput.fill(query)
  }

  async filterByCategory(category: string) {
    await this.page.getByRole('button', { name: /category/i }).click()
    await this.page.getByRole('option', { name: category }).click()
  }

  async sortBy(option: string) {
    await this.page.getByRole('button', { name: /sort/i }).click()
    await this.page.getByRole('option', { name: option }).click()
  }

  async setPriceRange(min: string, max: string) {
    await this.page.getByRole('button', { name: /price/i }).click()
    await this.page.getByLabel(/min price/i).fill(min)
    await this.page.getByLabel(/max price/i).fill(max)
    await this.page.getByRole('button', { name: 'Apply' }).click()
  }

  getWishlistButton(productIndex: number) {
    return this.getProductCards().nth(productIndex).getByRole('button', { name: /wishlist|love|favorite/i })
  }

  async toggleWishlist(productIndex: number) {
    await this.getWishlistButton(productIndex).click()
  }

  getWishlistCount() {
    return this.page.getByTestId('wishlist-count')
  }
}

export class CheckoutPage {
  constructor(public readonly page: Page) { }

  async goto() {
    await this.page.goto('/checkout')
  }

  async fillShippingForm(data: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }) {
    await this.page.getByLabel('First Name').fill(data.firstName)
    await this.page.getByLabel('Last Name').fill(data.lastName)
    await this.page.getByLabel('Address').fill(data.address)
    await this.page.getByLabel('City').fill(data.city)
    await this.page.getByLabel('State').fill(data.state)
    await this.page.getByLabel('ZIP Code').fill(data.zipCode)
    await this.page.getByLabel('Country').fill(data.country)
    await this.page.getByLabel('Phone').fill(data.phone)
  }

  async fillPaymentForm(data: {
    cardNumber: string
    nameOnCard: string
    expiryDate: string
    cvv: string
  }) {
    await this.page.getByLabel('Card Number').fill(data.cardNumber)
    await this.page.getByLabel('Name on Card').fill(data.nameOnCard)
    await this.page.getByLabel('Expiry Date').fill(data.expiryDate)
    await this.page.getByLabel('CVV').fill(data.cvv)
  }

  async continueToPayment() {
    await this.page.getByRole('button', { name: /continue to payment/i }).click()
  }

  async placeOrder() {
    await this.page.getByRole('button', { name: /place order/i }).click()
  }

  async completeCheckout(shipping: any, payment: any) {
    await this.fillShippingForm(shipping)
    await this.continueToPayment()
    await this.fillPaymentForm(payment)
    await this.placeOrder()
  }
}

export class WishlistPage {
  constructor(public readonly page: Page) { }

  async goto() {
    await this.page.goto('/wishlist')
  }

  getWishlistItems() {
    return this.page.locator('[data-testid="wishlist-item"]')
  }

  getEmptyMessage() {
    return this.page.getByText(/no items in wishlist/i)
  }

  getAddAllToCartButton() {
    return this.page.getByRole('button', { name: /add all to cart/i })
  }

  async removeFirstItem() {
    await this.getWishlistItems().first().getByRole('button', { name: /remove/i }).click()
  }

  async addAllToCart() {
    await this.getAddAllToCartButton().click()
  }
}

export interface MyFixtures {
  authPage: AuthPage
  productsPage: ProductsPage
  checkoutPage: CheckoutPage
  wishlistPage: WishlistPage
}

export const test = base.extend<MyFixtures>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page))
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page))
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page))
  },

  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page))
  },
})

export { expect } from '@playwright/test'

export const testUsers = {
  valid: {
    email: 'dplk@example.com',
    password: '12345',
    name: 'Test User',
  },
  invalid: {
    email: 'invalid-email',
    password: 'wrong',
    name: 'T',
  },
}

export const testAddress = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    country: 'USA',
    phone: '1234567890',
  },
}

export const testPayment = {
  valid: {
    cardNumber: '4242424242424242',
    nameOnCard: 'John Doe',
    expiryDate: '12/25',
    cvv: '123',
  },
}
