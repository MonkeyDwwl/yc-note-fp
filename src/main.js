import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '@/styles/_normalize.scss'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
