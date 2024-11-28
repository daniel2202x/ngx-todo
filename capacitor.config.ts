import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ngx_todo.app',
  appName: 'NGX Todo',
  webDir: 'dist/ngx-todo/browser',
  android: {
    buildOptions: {
      signingType: 'apksigner'
    }
  }
};

export default config;
