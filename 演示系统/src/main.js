import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 引入Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入FontAwesome (使用CDN) - 在index.html中已引入

// 引入Vue Router
import router from './router'

const app = createApp(App)

// 使用插件
app.use(ElementPlus)
app.use(router)

app.mount('#app')
