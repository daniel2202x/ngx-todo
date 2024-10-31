import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OfflineService {
    isOffline = signal(false);
}