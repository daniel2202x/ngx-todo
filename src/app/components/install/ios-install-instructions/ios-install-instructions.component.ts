import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LangauagePickerComponent } from '@app/components';

@Component({
  selector: 'app-ios-install-instructions',
  standalone: true,
  imports: [RouterLink, LangauagePickerComponent],
  templateUrl: './ios-install-instructions.component.html',
  styleUrl: './ios-install-instructions.component.scss'
})
export class IosInstallInstructionsComponent {

}
