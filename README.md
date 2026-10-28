# 🧠 Memory Cards

A "Memory Cards" memory game PWA built with **Angular 21** (standalone, signals, `OnPush`), **Tailwind CSS v4** and **Vitest**. The player registers with their name, picks a difficulty level, and has to remember the position of the numbers before they disappear in order to clear as many rounds as possible.

🔗 **Live demo**: https://gemapast.github.io/memory_cards_game/
📦 **Repository**: https://github.com/gemapast/memory_cards_game

## Features

- **Simple login**: the player enters their name (validated) to access the game; the `game` route is protected by a guard that requires a registered player, and any unknown route redirects to `home`.
- **3 difficulty levels**, each with its own memorization time and points per correct answer:

  | Difficulty | Visible time | Points per hit |
  | ---------- | ------------ | -------------- |
  | Easy       | 10 s         | 10             |
  | Normal     | 5 s          | 20             |
  | Hard       | 2 s          | 30             |

- **9-cell board** with the numbers 1 to 9 in random positions; once hidden, the player must find the position of the requested number. Correct guess = green cell, points added and a new round. Wrong guess = red cell revealing the number and game over, with a short vibration on devices that support the [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) (e.g. Android Chrome; not supported on iOS Safari).
- **Game info bar**: shows the current difficulty, the countdown of remaining seconds and the score while playing.
- **Installable PWA with real offline support**: it can be added to the Android/iOS home screen as a native-like app, with its own icon and fullscreen display (`display: standalone`), and the `@angular/service-worker` service worker precaches assets and i18n files so it works without a connection.
- **Internationalization** (es/en) with `@ngx-translate`.
- **Unit tests** for services, guards, pages and components with Vitest.
- **E2E tests** with Playwright covering the login flow, route protection and a full game round (correct guess, wrong guess/game over, and replay).
- **Code quality**: ESLint + Prettier + Husky/lint-staged (pre-commit runs lint + test).
- **CI/CD**: GitHub Actions runs lint + unit tests + e2e tests + build on every push/PR; pushing a `vX.Y.Z` tag on `master` automatically deploys to GitHub Pages.

## Tech stack

- [Angular 21](https://angular.dev/) (standalone components, `signal`/`computed`, `ChangeDetectionStrategy.OnPush`, the new `@if`/`@for` control flow)
- [Tailwind CSS v4](https://tailwindcss.com/) (via PostCSS) with a mobile-first design
- [Vitest](https://vitest.dev/) as the test runner (integrated through the `@angular/build:unit-test` builder)
- [Playwright](https://playwright.dev/) for end-to-end tests
- [@ngx-translate](https://github.com/ngx-translate/core) for i18n
- [@angular/service-worker](https://angular.dev/ecosystem/service-workers) for the offline/PWA layer
- ESLint (`angular-eslint`) + Prettier + Husky + lint-staged

## Prerequisites

- Node.js `^20.19.0 || ^22.12.0 || >=24.0.0` (required by Angular 21)
- npm `10.x`

## Installation

```bash
git clone https://github.com/gemapast/memory_cards_game.git
cd memory_cards_game
npm install
```

## Available scripts

| Command                     | Description                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm start`                 | Starts the dev server (`ng serve`) on `http://localhost:4200`. **The service worker is disabled in development mode.** |
| `npm run build`             | Production build in `dist/memory-cards-app/browser` (includes the service worker).                                     |
| `npm test`                  | Runs the Vitest test suite (watch mode).                                                                               |
| `npm test -- --watch=false` | Runs the full suite once (used in CI).                                                                                 |
| `npm run test:coverage`     | Runs the tests and generates a coverage report.                                                                        |
| `npm run lint`              | Lints (ESLint) `.ts`/`.html` files.                                                                                    |     | `npm run e2e`        | Runs the Playwright e2e suite (starts `ng serve` automatically).                             |
| `npm run e2e:ui`            | Runs the Playwright e2e suite in UI mode, useful to debug tests interactively.                                         |     | `npm run serve:dist` | Serves the production build statically (`http-server`), needed to test offline/PWA behavior. |

## How to test offline / PWA mode locally

`ng serve` does not register the service worker, so to check the offline behavior you need to serve the production build:

```bash
npm run build
npm run serve:dist
```

Open `http://127.0.0.1:4300`, browse the app a bit (so the service worker finishes precaching resources) and check in DevTools → Application → Service Workers that it's active. Then enable offline mode (DevTools → Network → Offline, or airplane mode on a real device) and reload: the app should keep working normally, including translations and navigation between routes.

### Installing the app on mobile

The app is installable as a PWA from the mobile browser (requires serving it over HTTPS, as the deployed demo does):

- **Android (Chrome)**: ⋮ menu → "Add to Home screen" / "Install app".
- **iOS (Safari)**: Share button → "Add to Home Screen".

Once installed, it opens fullscreen like a native app and keeps working without a connection.

## Project structure

```
src/app/
├── core/
│   ├── guards/        # playerGuard: protects the "game" route
│   ├── interfaces/     # models (Player, Cell, Difficulty, GameStatus...)
│   ├── services/       # PlayerService and GameService (signal-based state)
│   └── utils/          # pure, testable logic (shuffle, createBoard...)
├── components/          # reusable components (game-board, game-card,
│                        #   difficulty-selector, score-badge, top-bar, button)
└── pages/
    ├── home-page/       # player login / registration
    └── game-page/       # board and game logic
```

## Tests

```bash
npm test -- --watch=false
```

The tests cover: `PlayerService` (persistence in `localStorage`), `playerGuard`, `GameService` (board generation, timer, scoring, game over) using fake timers, pure board utilities, and the pages/components (rendering, form validation, user events).

## E2E tests

```bash
npm run e2e
```

Playwright automatically starts `ng serve` and runs the suite in `e2e/` against a real browser (Chromium):

- `e2e/home.spec.ts`: route protection (`game` redirects to `home` without a registered player, unknown routes redirect to `home`), name validation, and successful registration.
- `e2e/game.spec.ts`: a full round with a correct guess (score increases, a new round starts), and a wrong guess (game over screen, then "play again" / "change difficulty").

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every `push`/`pull request` to `master`/`develop`: `lint` → `test` → `e2e` → `build`. Pushing a `vX.Y.Z` tag whose commit belongs to `master` automatically deploys to GitHub Pages.

## Generated with

This project was bootstrapped with [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
