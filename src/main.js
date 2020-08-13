import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinusSquare, faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from '@/App'
import '@leanix/reporting'
import '@/assets/styles/tailwind.css'

library.add(faCheckSquare, faSquare, faMinusSquare)

Vue.component('font-awesome-icon', FontAwesomeIcon)

/* global lx */
Vue.prototype.$lx = lx

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
