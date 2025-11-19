import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'sweetalert2/dist/sweetalert2.min.css'

import App from './App.vue'
import router from './router'

import './assets/styles/main.css'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import PrimeVue from 'primevue/config'


import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import VueSweetalert2 from 'vue-sweetalert2'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ConfirmationService)
app.use(ToastService)
app.use(VueSweetalert2)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.mount('#app')
