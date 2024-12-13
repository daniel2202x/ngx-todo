import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';

import { map } from 'rxjs';

import { Version } from '@app/models';
import localVersion from '@app/version';
import { SpinnerDirective } from '@app/directives';
import { DEVICE_PLATFORM } from '@app/tokens';

@Component({
  selector: 'app-version-check',
  standalone: true,
  imports: [SpinnerDirective],
  templateUrl: './version-check.component.html',
  styleUrl: './version-check.component.scss'
})
export class VersionCheckComponent {
  readonly platform = inject(DEVICE_PLATFORM)

  readonly isLoading = signal(false);

  private readonly http = inject(HttpClient);
  readonly needsUpdate = toSignal(this.http
    .get<Version>('/version')
    .pipe(
      map(serverVersion => serverVersion.build !== localVersion.build)
    )
  );

  private readonly sw = inject(SwUpdate);

  async updatePWA() {
    this.isLoading.set(true);

    if (this.sw.isEnabled) {
      await this.sw.checkForUpdate();
    }

    location.reload();
  }
}
