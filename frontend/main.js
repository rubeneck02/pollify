import './app.css'
import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('service-worker.js')
  .then(reg => console.log('Service Worker registered'))
  .catch(err => console.error(`Service Worker error: ${err}`));
}