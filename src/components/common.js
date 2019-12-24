import Vue from 'vue'

import Login from './Login'
import XBreadcrumbs from './XBreadcrumbs'

// 注册全局组件
let components = [Login, XBreadcrumbs]
components.forEach(component => {
  Vue.component(component.name, component)
})
