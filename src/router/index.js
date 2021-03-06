import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login'
// import Home from '../views/home/Home'
// import Welcome from '../views/home/Welcome'
// import Users from '../views/user/Users'
// import Rights from '../views/power/Rights'
// import Roles from '../views/power/Roles'
// import Categore from '../views/goods/Categore'
// import Params from '../views/goods/Params'
// import List from '../views/goods/List'
// import Add from '../views/goods/Add'
// import Order from '../views/order/Order'
// import Report from '../views/report/Report'
const Login = () => import(/* webpackChunkName: 'login_home_welocome' */ '../components/Login')
const Home = () => import(/* webpackChunkName: 'login_home_welocome' */ '../views/home/Home')
const Welcome = () => import(/* webpackChunkName: 'login_home_welocome' */ '../views/home/Welcome')
const Users = () => import(/* webpackChunkName: 'user_rights_roles' */ '../views/user/Users')
const Rights = () => import(/* webpackChunkName: 'user_rights_roles' */ '../views/power/Rights')
const Roles = () => import(/* webpackChunkName: 'user_rights_roles' */ '../views/power/Roles')
const Categore = () => import(/* webpackChunkName: 'cate_params' */ '../views/goods/Categore')
const Params = () => import(/* webpackChunkName: 'cate_params' */ '../views/goods/Params')
const List = () => import(/* webpackChunkName: 'goodlist_add' */ '../views/goods/List')
const Add = () => import(/* webpackChunkName: 'goodlist_add' */ '../views/goods/Add')
const Order = () => import(/* webpackChunkName: 'roder_report' */ '../views/order/Order')
const Report = () => import(/* webpackChunkName: 'roder_report' */ '../views/report/Report')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Categore
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: List
        },
        {
          path: '/goods/add',
          component: Add
        },
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})

// 挂载路由导航守卫
// 使用beforeEach路由导航守卫控制权限
router.beforeEach((to, from, next) => {
  /*
  * to: 要访问的路径，from: 从哪个路径跳转来
  * next: 函数 next() 放行 next('/login') 强制跳转
  */
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 保存token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token,强制跳转
  if (!tokenStr) return next('/login')
  next()
})

export default router
