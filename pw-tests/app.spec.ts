import { expect, test } from '@playwright/test';

test('navigation and uwp parser work', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-uwp-parser-btn').click();

  const input = await page.getByTestId('uwp-input');
  await input.fill('A865AB7-C');

  const submitButton = await page.getByTestId('parse-uwp-button');
  await submitButton.click();

  const table = await page.getByTestId('parsed-uwp-table');
  await expect(table).toBeVisible();
});
