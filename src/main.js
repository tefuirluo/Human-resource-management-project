import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import GlobalComponentObj from '@/components'
import powerObj from '@/directive/power'
import i18n from '@/lang'
import ElementUI from 'element-ui'
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import '@/icons'
import '@/permission'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(GlobalComponentObj)
Vue.directive('power', powerObj)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
