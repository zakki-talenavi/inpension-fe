import { test, expect, testUsers } from '../fixtures'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.goto()
  })

  test('should display login form', async ({ authPage }) => {
    await expect(authPage.getHeading()).toBeVisible()
    await expect(authPage.getEmailInput()).toBeVisible()
    await expect(authPage.getPasswordInput()).toBeVisible()
    await expect(authPage.getSignInButton()).toBeVisible()
  })

  test('should show validation errors for invalid email', async ({ authPage, page }) => {
    await authPage.fillLogin(testUsers.invalid.email, testUsers.valid.password)
    await authPage.submitLogin()

    await expect(page.getByText('Invalid email address')).toBeVisible()
  })

  test('should show validation errors for short password', async ({ authPage, page }) => {
    await authPage.fillLogin(testUsers.valid.email, testUsers.invalid.password)
    await authPage.submitLogin()

    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ authPage }) => {
    await authPage.login(testUsers.valid.email, testUsers.valid.password)

    await expect(authPage.page).toHaveURL('/')
  })

  test('should show error for invalid credentials', async ({ authPage, page }) => {
    await authPage.fillLogin(testUsers.valid.email, 'wrong-password')
    await authPage.submitLogin()

    await expect(page.getByText('Invalid email or password')).toBeVisible()
  })

  test('should navigate to registration page', async ({ authPage }) => {
    await authPage.page.getByRole('link', { name: 'Sign up' }).click()

    await expect(authPage.page).toHaveURL('/register')
    await expect(authPage.page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
  })

  test('should be accessible from keyboard', async ({ authPage, page }) => {
    await page.keyboard.press('Tab')
    await expect(authPage.getEmailInput()).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(authPage.getPasswordInput()).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(authPage.getSignInButton()).toBeFocused()
  })
})

test.describe('Authentication Persistence', () => {
  test('should persist login across page reloads', async ({ authPage, context }) => {
    await authPage.login(testUsers.valid.email, testUsers.valid.password)

    const cookies = await context.cookies()
    const authCookie = cookies.find((c) => c.name === 'auth-token')
    expect(authCookie).toBeDefined()
  })
})
