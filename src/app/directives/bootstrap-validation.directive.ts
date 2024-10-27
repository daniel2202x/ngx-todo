import { Directive, HostBinding, inject } from '@angular/core';
import { FormControlName, FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[appBootstrapValidation]',
  standalone: true
})
export class BootstrapValidationDirective {

  private formGroup = inject(FormGroupDirective);
  private formControlName = inject(FormControlName);

  @HostBinding('class.is-valid')
  get isValid() {
    const control = this.formGroup.getControl(this.formControlName);
    return control.touched && control.valid;
  }

  @HostBinding('class.is-invalid')
  get isInvalid() {
    const control = this.formGroup.getControl(this.formControlName);
    return control.touched && control.invalid;
  }

}
