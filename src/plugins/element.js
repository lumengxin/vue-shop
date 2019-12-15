import Vue from 'vue'
// 按需导入
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main,
  Menu, Submenu, MenuItemGroup, MenuItem } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
// 导入弹出框组件，并挂载到vue原型上
Vue.prototype.$message = Message
