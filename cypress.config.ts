import { defineConfig } from 'cypress'

export default defineConfig({

  e2e: {
    baseUrl: process.env['CYPRESS_BASE_URL'] || 'http://localhost:4200'
  },
  viewportWidth: 400,
  viewportHeight: 700

})