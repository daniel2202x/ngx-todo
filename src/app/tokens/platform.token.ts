import { InjectionToken } from '@angular/core';

import { Capacitor } from '@capacitor/core';

export const DEVICE_PLATFORM = new InjectionToken<ReturnType<typeof getDevicePlatform>>('device-platform');

export function getDevicePlatform() {
    const userAgent = navigator.userAgent;

    const isiOS = /iPhone|iPad/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    if (window.matchMedia('(display-mode: standalone)').matches && isiOS) {
        return 'ios-app'; // user added the app to their homescreen and thinks it's installed as a native app
    }

    if (Capacitor.getPlatform() === 'android') {
        return 'android-app'; // user installed the app as an APK built with Capacitor
    }

    if (isiOS) {
        return 'ios-web'; // running on iOS in a browser
    } else if (isAndroid) {
        return 'android-web'; // running on Android in a browser
    }

    return 'desktop';
}
