import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import ajax from './config/ajax'
import './style/common'
import './config/rem'

import VueProgressBar from 'vue-progressbar'
import Loading from 'vue-slim-loading'

Vue.use(VueRouter)
const router = new VueRouter({
	routes
})

Vue.use(Loading, { text: '题目生成中', color: 'green' })

const options = {
    color: '#874b4b',
    failedColor: '#874b4b',
    thickness: '2rem',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: false,
    location: 'top',
    inverse: false
}

Vue.use(VueProgressBar, options)

new Vue({
	router,
	store,
}).$mount('#app')