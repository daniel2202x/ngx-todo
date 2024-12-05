import { Directive, HostBinding, inject } from '@angular/core';
import { FormControlName, FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[appBootstrapValidation]',
  standalone: true,
  host: {
    '[class.is-valid]': 'isValid',
    '[class.is-invalid]': 'isInvalid'
  }
})
export class BootstrapValidationDirective {

  private readonly formGroup = inject(FormGroupDirective);
  private readonly formControlName = inject(FormControlName);

  get isValid() {
    const control = this.formGroup.getControl(this.formControlName);
    return control.touched && control.valid;
  }

  get isInvalid() {
    const control = this.formGroup.getControl(this.formControlName);
    return control.touched && control.invalid;
  }

}
