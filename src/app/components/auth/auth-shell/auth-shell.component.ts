import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LangauagePickerComponent } from '../../common';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [RouterOutlet, LangauagePickerComponent],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss'
})
export class AuthShellComponent {

}
