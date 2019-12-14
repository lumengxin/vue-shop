import Vue from 'vue'
// 按需导入
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 导入弹出框组件，并挂载到vue原型上
Vue.prototype.$message = Message
