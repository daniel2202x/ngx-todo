# NGX Todo

The only todo app you'll ever need.

[![Lint & Test](https://github.com/daniel2202x/ngx-todo/actions/workflows/build-checks.yml/badge.svg)](https://github.com/daniel2202x/ngx-todo/actions/workflows/build-checks.yml)
[![Deploy Apps](https://github.com/daniel2202x/ngx-todo/actions/workflows/deploy-release.yml/badge.svg)](https://github.com/daniel2202x/ngx-todo/actions/workflows/deploy-release.yml)

## Basic Setup
1. Clone the repository with `git clone https://github.com/daniel2202x/ngx-todo`
2. Run `npm install --force` (the Angular PWA package, unfortunately, cannot install without `--force`)
3. Run `ng serve` or `npm run serve` to spin up a dev server on `http://localhost:4200`

## Explanation of scripts in package.json
- `serve`: Same as `ng serve`, uses the default locale (en)
- `serve:de`: Same as `npm run serve` but uses the German locale (de)
- `build`: Builds the app using the default configuration (production). Mainly used for Cypress and testing
- `build:capacitor`: Builds the app using the configurations `absolute-root-urls` and `include-service-worker`. Only used when the app gets deployed
- `lint`: Runs the configured linter
- `extract-i18n`: Builds the app and recreates `src/locale/messages.xlf`. Should always be run when any HTML has changed
- `e2e`: Same as `npm run serve` and `npm run cypress:open`
- `cypress:open`: Opens the Cypress UI ready for testing
- `cypress:run`: Runs all Cypress tests in headless mode
- `docker:*`: Mimics a production build of the app. Only used by Cypress in GitHub Actions. To use locally run `npm run build` first, then `npm run docker:serve`. This doesn't include the service worker

## Backlog (prioritised)
- nginx http to https redirect
- fix dependabot ssl issue
- add full offline sync support
- make capacitor app work on ios
- replace firebase with self-hosted supabase in docker
- alert user to download mobile app when on mobile browser
- add tests for responsiveness
- code coverage measurement
- i18n tests
- pentesting
- display loading placeholders instead of plain 'Loading' text