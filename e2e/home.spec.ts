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

  test('logs in quickly using a previously registered player from "Continuar como"', async ({
    page,
  }) => {
    await page.goto('/home');
    await page.getByLabel('Nombre del jugador').fill('Ana');
    await page.getByRole('button', { name: 'Comenzar a jugar' }).click();
    await expect(page).toHaveURL(/\/game$/);

    await page.getByRole('button', { name: 'Ana' }).click();
    await page.getByRole('button', { name: 'Salir' }).click();
    await expect(page).toHaveURL(/\/home$/);

    await expect(page.getByText('O continúa como:')).toBeVisible();
    await page.getByRole('button', { name: 'Ana', exact: true }).click();

    await expect(page).toHaveURL(/\/game$/);
    await expect(page.getByText('Ana')).toBeVisible();
  });

  test('navigates to the ranking page and back to home without an active player', async ({
    page,
  }) => {
    await page.goto('/home');

    await page.getByRole('button', { name: 'Ranking' }).click();
    await expect(page).toHaveURL(/\/ranking$/);
    await expect(
      page.getByText('Aún no hay partidas registradas en este dispositivo.'),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Volver' }).click();
    await expect(page).toHaveURL(/\/home$/);
  });
});
