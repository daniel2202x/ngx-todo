import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';

import { Capacitor } from '@capacitor/core';

import { map } from 'rxjs';

import { Version } from '@app/models';
import { environment } from '@app/environment';
import version from '@app/version';

@Component({
  selector: 'app-version-check',
  standalone: true,
  imports: [],
  templateUrl: './version-check.component.html',
  styleUrl: './version-check.component.scss'
})
export class VersionCheckComponent {
  platform = Capacitor.getPlatform();

  rootUrl = environment.rootUrl;

  private http = inject(HttpClient);
  needsUpdate = toSignal(this.http
    .get<Version>(environment.rootUrl + '/version')
    .pipe(
      map(serverVersion => serverVersion.build !== version.build)
    )
  );

  private sw = inject(SwUpdate);

  async updatePWA() {
    if (this.sw.isEnabled) {
      await this.sw.checkForUpdate();
    }

    location.reload();
  }
}
