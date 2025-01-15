import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import routes from './routes'
import store from './vuex/store'
import axios from 'axios'

Vue.config.productionTip = false

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history', // 히스토리 모드로 변경
    routes,
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
