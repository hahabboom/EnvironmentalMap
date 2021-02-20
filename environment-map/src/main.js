import Vue from 'vue';
import App from './App.vue';
import echarts from 'echarts';
import VueCookie from 'vue-cookie'; // https://github.com/alfhen/vue-cookie
import ElementUI from 'element-ui'; // https://element.eleme.cn/#/zh-CN/component/installation
import 'element-ui/lib/theme-chalk/index.css'
import $axios from '/src/config/axios-config'
import BaiduMap from 'vue-baidu-map'

// Vue.use(echarts)
Vue.use(ElementUI)
Vue.use(VueCookie)
Vue.use(BaiduMap, {
  ak: 'VNGVy1GpKyp9xfGZyGNjEr9v0G7Z9kS0'
})
Vue.prototype.$axios = $axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
