import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/main.css'
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'

const app = createApp(App)

app.use(Toast, {
  transition: "Vue-Toastification__fade",
  position: 'top-right',
  timeout: 1000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: 'button',
  icon: true,
  rtl: false,
})
app.use(router)
app.mount('#app')
