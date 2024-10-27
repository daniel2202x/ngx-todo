import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Capacitor } from '@capacitor/core';

import { catchError, throwError } from 'rxjs';

import { AuthService } from '@app/services';
import { BootstrapValidationDirective, IconComponent, SpinnerDirective } from '@app/directives';
import { LangauagePickerComponent } from '@app/components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, BootstrapValidationDirective, SpinnerDirective, RouterLink, LangauagePickerComponent, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isWorking = signal(false);
  loginError = signal(false);

  sessionExpired = input<boolean>();

  get isWeb() {
    return Capacitor.getPlatform() === 'web';
  }

  login() {
    this.isWorking.set(true);

    const form = this.loginForm.getRawValue();
    this.auth.login(form)
      .pipe(catchError(error => {
        this.isWorking.set(false);
        this.loginError.set(true);
        return throwError(() => error);
      }))
      .subscribe(() => this.router.navigateByUrl('/todos'));
  }
}
