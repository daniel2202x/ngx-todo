import { InjectionToken } from '@angular/core';

export const DEVICE_PLATFORM = new InjectionToken<ReturnType<typeof getDevicePlatform>>('device-platform');

export function getDevicePlatform() {
    const userAgent = navigator.userAgent;

    const isiOS = /iPhone|iPad/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    // running as an installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        if (isiOS) {
            return 'ios-pwa';
        } else if (isAndroid) {
            return 'android-pwa';
        } else {
            return 'desktop-pwa';
        }
    }

    // running in a web browser
    if (isiOS) {
        return 'ios-web';
    } else if (isAndroid) {
        return 'android-web';
    } else {
        return 'desktop-web';
    }

}
