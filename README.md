# NG![X](readme-logo.svg) Todo

The only todo app you'll ever need.

[![Lint & Test](https://github.com/daniel2202x/ngx-todo/actions/workflows/build-checks.yml/badge.svg)](https://github.com/daniel2202x/ngx-todo/actions/workflows/build-checks.yml)
![](./badges/success.svg)

The app is available [here](https://ngx-todo.com/en) and can be used inside any browser on any platform.

## Basic Setup
1. Clone the repository with `git clone https://github.com/daniel2202x/ngx-todo`
2. Run `npm install --force` (the Angular PWA package, unfortunately, cannot install without `--force`)
3. Run `ng serve` or `npm run serve` to spin up a dev server on `http://localhost:4200`

## Explanation of scripts in package.json
- `serve`: Same as `ng serve`, uses the default locale `en`
- `serve:de`: Same as `npm run serve` but uses the German locale `de`
- `build:test`: Builds the app using the default configuration `production`
- `build:prod`: Builds the app using the configurations `production` and `include-service-worker`
- `lint`: Runs the configured linter
- `extract-i18n`: Builds the app and recreates `src/locale/messages.xlf`. Should always be run after any HTML was touched
- `e2e`: Same as running `npm run serve` and then `npm run cypress:open`
- `cypress:open`: Opens the Cypress UI ready for testing
- `cypress:run`: Runs all Cypress tests in headless mode
- `docker:build`: Used by Cypress to build a full Docker image for the app. This comes very close to a production build
- `docker:run`: Also used by Cypress, runs the built Docker image
- `docker:serve`: Same as running `npm run docker:build` and then `npm run docker:run`