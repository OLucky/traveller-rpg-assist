import { test, expect } from '@playwright/test';

test('should input text into uwp-input on home page', async ({ page }) => {
  await page.goto('/');
  const input = await page.getByTestId('uwp-input');
  await input.fill('A865AB7-C');

  const submitButton = await page.getByTestId('parse-uwp-button');
  await submitButton.click();

  const table = await page.getByTestId('parsed-uwp-table');
  await expect(table).toBeVisible();
});
