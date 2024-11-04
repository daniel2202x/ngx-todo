import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OfflineService {
    readonly isOffline = signal(false);
}