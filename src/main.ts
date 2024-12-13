/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';

import { initEffects } from '@ngneat/effects';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { applyMobileFixes } from './mobile-fixes';

applyMobileFixes();

initEffects();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
