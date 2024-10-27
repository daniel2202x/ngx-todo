import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { catchError, throwError } from 'rxjs';

import { AuthService } from '@app/services';
import { SpinnerDirective, BootstrapValidationDirective } from '@app/directives';
import { LangauagePickerComponent } from '@app/components';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerDirective, RouterLink, LangauagePickerComponent, BootstrapValidationDirective],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  signupForm = inject(FormBuilder).nonNullable.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    passwordRepeated: ['', [Validators.required, this.validatePassword.bind(this)]]
  });

  isWorking = signal(false);
  signupError = signal<string | null>(null);

  signup() {
    this.isWorking.set(true);

    const form = this.signupForm.getRawValue();
    this.auth.signup(form, form.displayName)
      .pipe(
        catchError(error => {
          this.isWorking.set(false);
          this.signupError.set(error?.error?.error?.message?.split(' ')[0]);
          return throwError(() => error);
        })
      )
      .subscribe(() => this.router.navigateByUrl('/todos'));
  }

  private validatePassword(control: AbstractControl): ValidationErrors | null {
    if (control.value !== this.signupForm?.value.password) {
      return { passwordMismatch: true };
    }

    return null;
  }

}
