import DeliveryTime from './index.vue'

const install = function(Vue) {
    if (install.installed) return
    install.installed = true
    Vue.component(DeliveryTime.name, DeliveryTime)
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default {
    install,
    DeliveryTime
}