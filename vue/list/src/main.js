import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/global.less'
import '@/assets/font/iconfont.css'
import SocketServer from './utils/socket.js'
Vue.prototype.$echarts = window.echarts
SocketServer.Instance.connect();
Vue.prototype.$socket=SocketServer.Instance
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
