# NGX Todo

The only todo app you'll ever need.

[![Lint & Test](https://github.com/daniel2202x/ngx-todo/actions/workflows/build-checks.yml/badge.svg)](https://github.com/daniel2202x/ngx-todo/actions/workflows/build-checks.yml)
[![Deploy Apps](https://github.com/daniel2202x/ngx-todo/actions/workflows/deploy-release.yml/badge.svg)](https://github.com/daniel2202x/ngx-todo/actions/workflows/deploy-release.yml)

The app is available at https://ngx-todo.com and can be used from any platform. On there you will also find this app as a native Android app which is strongly recommended if you use an Android phone.
> **Note**: A native app for iOS is on the way! For now you can use the web app, install instructions also on the website.

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
- `extract-i18n`: Builds the app and recreates `src/locale/messages.xlf`. Should always be run after any HTML was touched
- `e2e`: Same as running `npm run serve` and then `npm run cypress:open`
- `cypress:open`: Opens the Cypress UI ready for testing
- `cypress:run`: Runs all Cypress tests in headless mode
- `docker:kill`: Forcefully removes the ngx-todo-frontend image from the local machine (only used in conjunction with `npm run docker:serve`)
- `docker:build`: Builds a Docker image that mimics a production build of the app (only used by Cypress and for local testing)
- `docker:run`: Runs the image built with `npm run docker:build` (also only used by Cypress and for local testing)
- `docker:serve`: Same as running `docker:kill`, `docker:build` and `docker:run`. Useful for testing a production build locally. Run `npm run build` beforehand. This doesn't include the service worker

## Backlog (prioritised)
- add full offline sync support
- make capacitor app work on ios
- replace firebase with self-hosted supabase in docker
- alert user to download mobile app when on mobile browser
- add tests for responsiveness
- code coverage measurement
- i18n tests
- pentesting
- display loading placeholders instead of plain 'Loading' text