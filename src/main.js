/*
 * @Author: Billy
 * @Date: 2023-05-08 10:46:05
 * @LastEditors: Billy
 * @LastEditTime: 2023-05-08 12:05:47
 * @Description: 请输入
 */
import './assets/main.css'

import {
    createApp
} from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')