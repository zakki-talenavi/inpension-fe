import { test, expect } from '../fixtures'

test.describe.configure({ mode: 'parallel' })

test.describe('Wishlist Functionality', () => {
  test('should show wishlist icon in header', async ({ page }) => {
    await page.goto('/')
    const wishlistIcon = page.getByTestId('wishlist-icon')
    await expect(wishlistIcon).toBeVisible()
  })

  test('should add product to wishlist', async ({ productsPage }) => {
    await productsPage.goto()

    const initialCount = await productsPage.getWishlistCount().textContent()

    await productsPage.toggleWishlist(0)

    const newCount = await productsPage.getWishlistCount().textContent()
    expect(Number.parseInt(newCount || '0', 10)).toBe(Number.parseInt(initialCount || '0', 10) + 1)
  })

  test('should remove product from wishlist', async ({ productsPage }) => {
    await productsPage.goto()

    await productsPage.toggleWishlist(0)
    const wishlistButton = productsPage.getWishlistButton(0)
    await expect(wishlistButton).toHaveAttribute('data-active', 'true')

    await productsPage.toggleWishlist(0)
    await expect(wishlistButton).not.toHaveAttribute('data-active', 'true')
  })

  test('should show empty state when wishlist is empty', async ({ wishlistPage }) => {
    await wishlistPage.goto()

    await expect(wishlistPage.getEmptyMessage()).toBeVisible()
  })

  test('should persist wishlist across page navigation', async ({ productsPage, wishlistPage }) => {
    await productsPage.goto()
    await productsPage.toggleWishlist(0)

    await wishlistPage.goto()

    const wishlistItems = wishlistPage.getWishlistItems()
    const count = await wishlistItems.count()

    expect(count).toBeGreaterThan(0)
  })

  test('should display wishlist page with all items', async ({ productsPage, wishlistPage }) => {
    await productsPage.goto()
    await productsPage.toggleWishlist(0)

    await wishlistPage.goto()

    await expect(wishlistPage.page.getByRole('heading', { name: /my wishlist/i })).toBeVisible()
  })

  test('should remove item from wishlist page', async ({ productsPage, wishlistPage }) => {
    await productsPage.goto()
    await productsPage.toggleWishlist(0)

    await wishlistPage.goto()
    await wishlistPage.removeFirstItem()

    await expect(wishlistPage.getEmptyMessage()).toBeVisible()
  })

  test('should add all wishlist items to cart', async ({ productsPage, wishlistPage }) => {
    await productsPage.goto()
    await productsPage.toggleWishlist(0)

    await wishlistPage.goto()
    await wishlistPage.addAllToCart()

    const cartCount = await wishlistPage.page.getByTestId('cart-count').textContent()
    expect(Number.parseInt(cartCount || '0', 10)).toBeGreaterThan(0)
  })
})
