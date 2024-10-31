# NGX Todo

The only todo app you'll ever need.

[![Lint & Test](https://github.com/daniel2202x/ngx-todo/actions/workflows/build-checks.yml/badge.svg)](https://github.com/daniel2202x/ngx-todo/actions/workflows/build-checks.yml)
[![Deploy Apps](https://github.com/daniel2202x/ngx-todo/actions/workflows/deploy-release.yml/badge.svg)](https://github.com/daniel2202x/ngx-todo/actions/workflows/deploy-release.yml)

## Basic Setup
1. Clone the repository with `git clone https://github.com/daniel2202x/ngx-todo`
2. Run `npm install --force` (the Angular PWA package cannot install without `--force`)
3. Run `ng serve` or `npm run serve` to spin up a dev server on `http://localhost:4200`

## Important Notes For Advanced Users
- Run `npm run serve:de` to serve the German localisation of the app
- `npm run e2e` will not only create a dev server, but will also open the Cypress UI readily connected to the dev server
- Use `npm run build`, then `npm run docker:serve` to create a web server that serves a production build of the app, localised in all available languages
- Everytime you change something in the code that is a localisable text, make sure to run `npm run extract-i18n` and then manually compare `src/locale/messages.xlf` to all of the xlf files in the same directory
  - _Hint:_ In VS Code, click on both files you want to compare (e. g. `messages.xlf` and `messages.de.xlf`) while holding the `ctrl` key, then right-click and choose **Compare Selected**. This makes the localisation process so much easier.
  - The `messages.xlf` and `messages.de.xlf` should be exactly the same except for the `<target>` tags inside the `de` version (or other languages respectively)

## Backlog (prioritised)
- nginx http to https redirect
- add full offline sync support
- make capacitor app work on ios
- replace firebase with self-hosted supabase in docker
- alert user to download mobile app when on mobile browser
- add tests for responsiveness & offline bevaviour
- code coverage measurement
- fix dependabot ssl issue
- pentesting
- display loading placeholders instead of plain 'Loading' text