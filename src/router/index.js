import Vue from 'vue';
import VueRouter from 'vue-router';

import MatList from '../view/matList.vue'
// import Detail from '../view/detail.vue'
import List from '../view/list.vue'
import Detail from '../view/detail.vue'
Vue.use(VueRouter);


// // 创建路由实例对象
const router = new VueRouter({
    // base:'/mativue/',
    mode: 'history',
    routes: [
        {
            path: '/matList', name: 'matList', component: MatList, meta: {
                title: "客户列表"
            }
        },
        { path: '/list', name: 'list', component: List, meta: {
            title: "对账单信息"
        }},
        { path: '/detail', name: 'detail', component: Detail,meta: {
            title: "对账单明细"
        } }
        // { path: '*', redirect: 'matList' }
        // { path: '/detail', name: 'detail', component: () => import('@/view/detail.vue') }
    ]
})
// 导出路由实例对象
export default router


router.afterEach((to, from) => {
    document.title = to.meta.title;
})