import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

import { Actions } from '@ngneat/effects-ng';

import { filter, map } from 'rxjs';

import { SpinnerDirective, BootstrapValidationDirective } from '@app/directives';
import { LangauagePickerComponent } from '@app/components';
import { signup } from '@app/actions';
import { AuthRepository } from '@app/state';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerDirective, RouterLink, LangauagePickerComponent, BootstrapValidationDirective, AsyncPipe],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  private readonly actions = inject(Actions);
  private readonly authRepository = inject(AuthRepository);

  readonly signupForm = inject(FormBuilder).nonNullable.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    passwordRepeated: ['', [Validators.required, this.validatePassword.bind(this)]]
  });

  readonly isLoading$ = this.authRepository.signupResult$.pipe(map(res => res.isLoading));
  readonly errorMessage$ = this.authRepository.signupResult$.pipe(
    filter(res => res.isError),
    map(res => res.error.error.error.message.split(' ')[0])
  )

  signup() {
    const form = this.signupForm.getRawValue();
    this.actions.dispatch(signup(form));
  }

  private validatePassword(control: AbstractControl): ValidationErrors | null {
    if (control.value !== this.signupForm?.value.password) {
      return { passwordMismatch: true };
    }

    return null;
  }

}
