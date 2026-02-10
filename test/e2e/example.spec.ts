// @ts-check
// const { test, expect } = require('@playwright/test');
import { test, expect } from '@playwright/test'


test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test.describe("testing a eCommerce playground", () => {
  test("has title", async ({ page }) => {
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    await expect(page).toHaveTitle(/Your Store/);
  });

  test("special link", async ({ page }) => {
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    await page.getByRole("link", { name: "Special Hot", exact: true }).click();
    await page.getByRole("link", { name: "Continue" }).click();
  });

  test("search products and buy", async ({ page }) => {
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    await page.getByPlaceholder("Search For Products").first().click();
    await page.getByPlaceholder("Search For Products").first().fill("Phone");
    await page.getByRole("button", { name: "SEARCH" }).click();
    await page.locator(".product-thumb").nth(2).click();
    await page.getByRole("button", { name: "BUY NOW" }).click();
  });
});
