import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

/** Styles - WindiCSS */
import 'virtual:windi.css';

/** Router - Vue Router */
import { router } from './router';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Toast, {
  position: 'bottom-center',
  hideProgressBar: true,
});

app.mount('#app');
