import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { Actions } from '@ngneat/effects-ng';

import { BootstrapValidationDirective, IconComponent, SpinnerDirective } from '@app/directives';
import { login } from '@app/actions';
import { AuthRepository } from '@app/state';
import { DEVICE_PLATFORM } from '@app/tokens';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, BootstrapValidationDirective, SpinnerDirective, RouterLink, IconComponent],
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

  private readonly loginResult = toSignal(this.authRepository.loginResult$);
  readonly isLoading = computed(() => this.loginResult()?.isLoading);
  readonly isError = computed(() => this.loginResult()?.isError);

  readonly sessionExpired = input<boolean>();

  readonly devicePlatform = inject(DEVICE_PLATFORM);

  login() {
    const form = this.loginForm.getRawValue();
    this.actions.dispatch(login(form));
  }
}
