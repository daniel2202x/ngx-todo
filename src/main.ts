/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';

import { initEffects } from '@ngneat/effects';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

initEffects();

document.addEventListener('touchstart', e => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
