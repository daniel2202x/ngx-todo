import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Capacitor } from '@capacitor/core';

import { Actions } from '@ngneat/effects-ng';

import { BootstrapValidationDirective, IconComponent, SpinnerDirective } from '@app/directives';
import { LangauagePickerComponent } from '@app/components';
import { login } from '@app/actions';
import { AuthRepository } from '@app/state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, BootstrapValidationDirective, SpinnerDirective, RouterLink, LangauagePickerComponent, IconComponent, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private readonly authRepository = inject(AuthRepository);
  private readonly actions = inject(Actions);

  readonly loginForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  readonly loginResult$ = this.authRepository.loginResult$;

  readonly sessionExpired = input<boolean>();

  get isWeb() {
    return Capacitor.getPlatform() === 'web';
  }

  login() {
    const form = this.loginForm.getRawValue();
    this.actions.dispatch(login(form));
  }
}
