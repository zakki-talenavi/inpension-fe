import { test, expect, testUsers } from '../fixtures'

test.describe('Registration Flow', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.gotoRegister()
  })

  test('should display registration form', async ({ authPage }) => {
    await expect(authPage.page.getByRole('heading', { name: 'Create Account' })).toBeVisible()
    await expect(authPage.page.getByLabel('Name')).toBeVisible()
    await expect(authPage.page.getByLabel('Email')).toBeVisible()
    await expect(authPage.page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(authPage.page.getByLabel('Confirm Password')).toBeVisible()
    await expect(authPage.page.getByRole('button', { name: 'Create Account' })).toBeVisible()
  })

  test('should show validation errors for short name', async ({ authPage, page }) => {
    await authPage.fillRegistration({
      name: testUsers.invalid.name,
      email: testUsers.valid.email,
      password: testUsers.valid.password,
      confirmPassword: testUsers.valid.password,
    })
    await authPage.submitRegistration()

    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible()
  })

  test('should show validation errors for invalid email', async ({ authPage, page }) => {
    await authPage.fillRegistration({
      name: testUsers.valid.name,
      email: testUsers.invalid.email,
      password: testUsers.valid.password,
      confirmPassword: testUsers.valid.password,
    })
    await authPage.submitRegistration()

    await expect(page.getByText('Invalid email address')).toBeVisible()
  })

  test('should show validation errors for short password', async ({ authPage, page }) => {
    await authPage.fillRegistration({
      name: testUsers.valid.name,
      email: testUsers.valid.email,
      password: testUsers.invalid.password,
      confirmPassword: testUsers.invalid.password,
    })
    await authPage.submitRegistration()

    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()
  })

  test('should show validation error for mismatched passwords', async ({ authPage, page }) => {
    await authPage.fillRegistration({
      name: testUsers.valid.name,
      email: testUsers.valid.email,
      password: testUsers.valid.password,
      confirmPassword: 'password456',
    })
    await authPage.submitRegistration()

    await expect(page.getByText("Passwords don't match")).toBeVisible()
  })

  test('should register successfully with valid data', async ({ authPage }) => {
    const timestamp = Date.now()
    await authPage.register(`Test User ${timestamp}`, `test${timestamp}@example.com`, testUsers.valid.password)

    await expect(authPage.page).toHaveURL('/')
  })

  test('should navigate to login page', async ({ authPage }) => {
    await authPage.page.getByRole('link', { name: 'Sign in' }).click()

    await expect(authPage.page).toHaveURL('/login')
    await expect(authPage.page.getByRole('heading', { name: 'Sign In' })).toBeVisible()
  })

  test('should be accessible from keyboard', async ({ authPage, page }) => {
    await page.keyboard.press('Tab')
    await expect(authPage.page.getByLabel('Name')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(authPage.page.getByLabel('Email')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(authPage.page.getByLabel('Password', { exact: true })).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(authPage.page.getByLabel('Confirm Password')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(authPage.page.getByRole('button', { name: 'Create Account' })).toBeFocused()
  })

  test('should clear password field on validation error', async ({ authPage, page }) => {
    await authPage.fillRegistration({
      name: testUsers.valid.name,
      email: testUsers.valid.email,
      password: testUsers.invalid.password,
      confirmPassword: testUsers.invalid.password,
    })
    await authPage.submitRegistration()

    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible()

    await authPage.fillRegistration({
      name: testUsers.valid.name,
      email: testUsers.valid.email,
      password: testUsers.valid.password,
      confirmPassword: testUsers.valid.password,
    })

    const passwordValue = await authPage.page.getByLabel('Password', { exact: true }).inputValue()
    expect(passwordValue).toBe(testUsers.valid.password)
  })
})

test.describe('Registration with Existing User', () => {
  test('should show error for existing email', async ({ authPage, page }) => {
    await authPage.gotoRegister()
    await authPage.fillRegistration({
      name: testUsers.valid.name,
      email: testUsers.valid.email,
      password: testUsers.valid.password,
      confirmPassword: testUsers.valid.password,
    })
    await authPage.submitRegistration()

    await expect(page.getByText(/registration failed/i)).toBeVisible()
  })
})
