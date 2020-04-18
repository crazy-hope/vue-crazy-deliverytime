import Vue from 'vue'
import App from './App.vue'
import DeliveryTime from 'vue-crazy-deliverytime'
Vue.use(DeliveryTime)

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')
