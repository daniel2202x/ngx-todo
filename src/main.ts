/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';

import { initEffects } from '@ngneat/effects';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

initEffects();

// when the user rotates the device from landscape to portait the zoom sometimes breaks, reload the page to fix that
// as of now this only occurs on iOS and interestingly ONLY when the PWA is installed, but NOT if it is used as a normal website in Safari
window.addEventListener('orientationchange', () => {
  location.reload();
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
