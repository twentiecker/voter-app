import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';
import './style.css';
import App from './App.vue';
import router from './router/index.js';

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark',
      },
    },
  })
  .use(ToastService)
  .use(router)
  .use(createPinia())
  .mount('#app');
