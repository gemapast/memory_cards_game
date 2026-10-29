import { Locator, Page, expect, test } from '@playwright/test';

async function readRound(
  page: Page,
  cards: Locator,
): Promise<{ values: number[]; target: number }> {
  await expect(cards).toHaveCount(9);
  const values = (await cards.allTextContents()).map((text) => Number(text.trim()));

  const hint = page.getByText(/Encuentra el número \d/);
  await expect(hint).toBeVisible({ timeout: 15_000 });
  const hintText = await hint.textContent();
  const target = Number(hintText?.match(/\d+/)?.[0]);

  return { values, target };
}

test.describe('Game flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
    await page.getByLabel('Nombre del jugador').fill('Ana');
    await page.getByRole('button', { name: 'Comenzar a jugar' }).click();
    await expect(page).toHaveURL(/\/game$/);
  });

  test('plays a correct round and increases the score', async ({ page }) => {
    await page.getByRole('button', { name: 'Difícil' }).click();
    await page.getByRole('button', { name: 'Comenzar', exact: true }).click();

    await expect(page.getByText('Memoriza los números')).toBeVisible();

    const cards = page.locator('.game-board button');
    const { values, target } = await readRound(page, cards);
    const targetIndex = values.indexOf(target);
    expect(targetIndex).toBeGreaterThanOrEqual(0);

    await cards.nth(targetIndex).click();

    await expect(page.locator('.game-info__score')).toHaveText('30 pts');
    await expect(page.getByText('Memoriza los números')).toBeVisible();
  });

  test('ends the game on a wrong guess and allows playing again or changing difficulty', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Fácil' }).click();
    await page.getByRole('button', { name: 'Comenzar', exact: true }).click();

    await expect(page.getByText('Memoriza los números')).toBeVisible();

    const cards = page.locator('.game-board button');
    const { values, target } = await readRound(page, cards);
    const wrongIndex = values.findIndex((value) => value !== target);
    expect(wrongIndex).toBeGreaterThanOrEqual(0);

    await cards.nth(wrongIndex).click();

    await expect(page.getByText('¡Partida terminada!')).toBeVisible();
    await expect(page.locator('.difficulty-selector')).toHaveCount(0);

    const playAgain = page.getByRole('button', { name: 'Jugar de nuevo' });
    const changeDifficulty = page.getByRole('button', { name: 'Cambiar dificultad' });
    await expect(playAgain).toBeVisible();
    await expect(changeDifficulty).toBeVisible();

    await changeDifficulty.click();

    await expect(page.locator('.difficulty-selector')).toBeVisible();
    await expect(page.getByText('¡Partida terminada!')).not.toBeVisible();
  });

  test('exits the game and clears the player session', async ({ page }) => {
    await page.getByRole('button', { name: 'Ana' }).click();
    await page.getByRole('button', { name: 'Salir' }).click();

    await expect(page).toHaveURL(/\/home$/);

    await page.goto('/game');
    await expect(page).toHaveURL(/\/home$/);
  });

  test('ends the game with the "Terminar partida" button and keeps the score reached so far', async ({
    page,
  }) => {
    await page.getByRole('button', { name: 'Difícil' }).click();
    await page.getByRole('button', { name: 'Comenzar', exact: true }).click();

    await expect(page.getByText('Memoriza los números')).toBeVisible();

    const cards = page.locator('.game-board button');
    const { values, target } = await readRound(page, cards);
    const targetIndex = values.indexOf(target);
    await cards.nth(targetIndex).click();

    await expect(page.locator('.game-info__score')).toHaveText('30 pts');

    await page.getByRole('button', { name: 'Terminar partida' }).click();

    await expect(page.getByText('¡Partida terminada!')).toBeVisible();
    await expect(page.locator('.game-info__score')).toHaveText('30 pts');
    await expect(page.getByRole('button', { name: 'Terminar partida' })).toHaveCount(0);
  });

  test('records the score in the ranking page reached via the top bar menu', async ({ page }) => {
    await page.getByRole('button', { name: 'Difícil' }).click();
    await page.getByRole('button', { name: 'Comenzar', exact: true }).click();

    await expect(page.getByText('Memoriza los números')).toBeVisible();

    const cards = page.locator('.game-board button');
    const { values, target } = await readRound(page, cards);
    const targetIndex = values.indexOf(target);
    await cards.nth(targetIndex).click();

    await expect(page.locator('.game-info__score')).toHaveText('30 pts');

    await page.getByRole('button', { name: 'Terminar partida' }).click();
    await expect(page.getByText('¡Partida terminada!')).toBeVisible();

    await page.getByRole('button', { name: 'Ana' }).click();
    await page.getByRole('button', { name: 'Ranking' }).click();

    await expect(page).toHaveURL(/\/ranking$/);
    const rankingRow = page.getByText('Ana').locator('..');
    await expect(rankingRow).toContainText('30 pts');

    await page.getByRole('button', { name: 'Volver' }).click();
    await expect(page).toHaveURL(/\/game$/);
  });
});
