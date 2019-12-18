import Vue from 'vue'

import Login from './Login'
import Breadcrumbs from './Breadcrumbs'

// 注册全局组件
let components = [Login, Breadcrumbs]
components.forEach(component => {
  Vue.component(component.name, component)
})
