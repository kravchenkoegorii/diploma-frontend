import { registerSW } from 'virtual:pwa-register';

export default function registerServiceWorker() {
  // Check if the serviceWorker Object exists in the navigator object ( means if browser supports SW )

  if ('serviceWorker' in navigator) {
    registerSW();
  }
}
