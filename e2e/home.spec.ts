import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('redirects to home when visiting the protected game route without a player', async ({
    page,
  }) => {
    await page.goto('/game');

    await expect(page).toHaveURL(/\/home$/);
  });

  test('redirects unknown routes to home', async ({ page }) => {
    await page.goto('/some-unknown-route');

    await expect(page).toHaveURL(/\/home$/);
  });

  test('shows a validation error for an invalid name and stays on home', async ({ page }) => {
    await page.goto('/home');

    await page.getByLabel('Nombre del jugador').fill('a');
    await page.getByRole('button', { name: 'Comenzar a jugar' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page).toHaveURL(/\/home$/);
  });

  test('registers the player and navigates to the game page', async ({ page }) => {
    await page.goto('/home');

    await page.getByLabel('Nombre del jugador').fill('Ana');
    await page.getByRole('button', { name: 'Comenzar a jugar' }).click();

    await expect(page).toHaveURL(/\/game$/);
    await expect(page.getByText('Ana')).toBeVisible();
  });
});
