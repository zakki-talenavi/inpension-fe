import { test, expect } from '../fixtures'

test.describe('Product Search', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto()
  })

  test('should display search input', async ({ productsPage }) => {
    const searchInput = productsPage.getSearchInput()
    await expect(searchInput).toBeVisible()
    await expect(searchInput).toHaveAttribute('placeholder', /search products/i)
  })

  test('should filter products by search query', async ({ productsPage }) => {
    const searchInput = productsPage.getSearchInput()

    // Search for a product
    await searchInput.fill('wireless')

    // Check that matching product is visible
    await expect(productsPage.page.getByText('Wireless Headphones')).toBeVisible()

    // Verify product cards are displayed
    const productCards = productsPage.getProductCards()
    const count = await productCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should show no results for non-existent products', async ({ productsPage, page }) => {
    const searchInput = productsPage.getSearchInput()

    await searchInput.fill('nonexistent product xyz123')

    // Check for empty state message
    await expect(page.getByText('No products found')).toBeVisible()
  })

  test('should update results as user types', async ({ productsPage, page }) => {
    const searchInput = productsPage.getSearchInput()

    // Type partial search
    await searchInput.fill('head')

    // Should show headphones
    const productCards = productsPage.getProductCards()
    const count = await productCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should clear search and show all products', async ({ productsPage, page }) => {
    const searchInput = productsPage.getSearchInput()

    // First search for something specific
    await searchInput.fill('wireless')

    let productCards = productsPage.getProductCards()
    const filteredCount = await productCards.count()

    // Clear the search
    await searchInput.clear()

    // Should show more products now
    productCards = productsPage.getProductCards()
    const allCount = await productCards.count()

    expect(allCount).toBeGreaterThan(filteredCount)
  })
})

test.describe('Product Filtering', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto()
  })

  test('should filter by category', async ({ productsPage, page }) => {
    await productsPage.filterByCategory('Electronics')

    await expect(page.getByText('Wireless Headphones')).toBeVisible()
    await expect(page.getByText('Laptop Backpack')).toBeVisible()
  })

  test('should filter by price range', async ({ productsPage }) => {
    await productsPage.setPriceRange('50', '100')

    const productCards = productsPage.getProductCards()
    const count = await productCards.count()

    expect(count).toBeGreaterThan(0)
  })

  test('should filter by stock availability', async ({ page }) => {
    await page.getByRole('checkbox', { name: /in stock/i }).check()

    const outOfStockProducts = page.getByText('out of stock')
    await expect(outOfStockProducts).not.toBeVisible()
  })

  test('should filter by minimum rating', async ({ productsPage, page }) => {
    await page.getByRole('button', { name: /rating/i }).click()
    await page.getByRole('option', { name: '4 Stars' }).click()

    const products = productsPage.getProductCards()
    const count = await products.count()

    for (let i = 0; i < count; i++) {
      const ratingText = await products.nth(i).getByTestId('rating').textContent()
      const rating = Number.parseFloat(ratingText || '0')
      expect(rating).toBeGreaterThanOrEqual(4.0)
    }
  })

  test('should combine multiple filters', async ({ productsPage, page }) => {
    await productsPage.filterByCategory('Electronics')
    await page.getByRole('checkbox', { name: /in stock/i }).check()

    const products = productsPage.getProductCards()
    const count = await products.count()

    for (let i = 0; i < count; i++) {
      await expect(products.nth(i)).toContainText('electronics', { ignoreCase: true })
    }
  })

  test('should reset all filters', async ({ productsPage, page }) => {
    await productsPage.filterByCategory('Electronics')
    await page.getByRole('button', { name: /reset/i }).click()

    const allProducts = productsPage.getProductCards()
    const initialCount = await allProducts.count()

    expect(initialCount).toBeGreaterThan(2)
  })
})

test.describe('Product Sorting', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto()
  })

  test('should sort products by name ascending', async ({ productsPage }) => {
    await productsPage.page.getByRole('button', { name: /sort/i }).click()
    await productsPage.page.getByRole('option', { name: /name.*a-z/i }).click()

    const firstProduct = productsPage.getProductCards().first()
    const lastProduct = productsPage.getProductCards().last()

    const firstName = await firstProduct.getByTestId('product-name').textContent()
    const lastName = await lastProduct.getByTestId('product-name').textContent()

    const firstNameLower = firstName?.toLowerCase() ?? ''
    const lastNameLower = lastName?.toLowerCase() ?? ''
    const isValid = firstNameLower < lastNameLower
    expect(isValid).toBe(true)
  })

  test('should sort products by price ascending', async ({ productsPage }) => {
    await productsPage.page.getByRole('button', { name: /sort/i }).click()
    await productsPage.page.getByRole('option', { name: /price.*low/i }).click()

    const prices: number[] = []
    const productCards = productsPage.getProductCards()
    const count = await productCards.count()

    for (let i = 0; i < Math.min(3, count); i++) {
      const priceText = await productCards.nth(i).getByTestId('product-price').textContent()
      const price = Number.parseFloat(priceText?.replace(/[$,]/g, '') || '0')
      prices.push(price)
    }

    expect(prices[0]).toBeLessThanOrEqual(prices[1])
    expect(prices[1]).toBeLessThanOrEqual(prices[2])
  })

  test('should sort products by rating descending', async ({ productsPage }) => {
    await productsPage.page.getByRole('button', { name: /sort/i }).click()
    await productsPage.page.getByRole('option', { name: /rating/i }).click()

    const firstProduct = productsPage.getProductCards().first()
    const rating = await firstProduct.getByTestId('rating').textContent()
    const ratingValue = Number.parseFloat(rating || '0')

    expect(ratingValue).toBeGreaterThanOrEqual(4.0)
  })
})

test.describe('Search and Filter Integration', () => {
  test('should maintain filters when searching', async ({ productsPage, page }) => {
    await productsPage.goto()

    await productsPage.filterByCategory('Electronics')
    await productsPage.search('wireless')

    await expect(page.getByText('Wireless Headphones')).toBeVisible()
    await expect(page.getByText('Found 1 products')).toBeVisible()
  })

  test('should update results dynamically', async ({ productsPage, page }) => {
    await productsPage.goto()

    const searchInput = productsPage.getSearchInput()
    await searchInput.fill('shoes')

    const results = productsPage.getProductCards()
    const count = await results.count()

    expect(count).toBeGreaterThan(0)
    await expect(results.first()).toContainText('shoes', { ignoreCase: true })
  })
})
