import { InjectionToken } from '@angular/core';

export const DEVICE_PLATFORM = new InjectionToken<ReturnType<typeof getDevicePlatform>>('device-platform');

export function getDevicePlatform() {
    const userAgent = navigator.userAgent;

    const isiOS = /iPhone|iPad/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    // running inside installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
        if (isiOS) {
            return 'ios-app'; // user added the app to their homescreen and thinks it's installed as a native app
        } else if (isAndroid) {
            return 'android-app'; // user installed the app as an APK built with Capacitor
        }
    }

    if (isiOS) {
        return 'ios-web'; // running on iOS in a browser
    } else if (isAndroid) {
        return 'android-web'; // running on Android in a browser
    }

    return 'desktop';
}
