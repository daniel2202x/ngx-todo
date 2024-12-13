import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LangauagePickerComponent } from '@app/components';

@Component({
  selector: 'app-android-install-instructions',
  standalone: true,
  imports: [RouterLink, LangauagePickerComponent],
  templateUrl: './android-install-instructions.component.html',
  styleUrl: './android-install-instructions.component.scss'
})
export class AndroidInstallInstructionsComponent {

}
