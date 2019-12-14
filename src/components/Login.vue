<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form
        :model="loginForm"
        class="login-form"
        label-width="0px"
        :rules="loginRules"
        ref="loginRef"
        >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont iconRectangleCopy1"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont iconRectangleCopy"
            type="password"
            >
            </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在5-15个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLogin() {
      // ui中自带重置方法
      this.$refs.loginRef.resetFields()
    },
    login() {
      // 表单提交前预校验
      this.$refs.loginRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 返回的result为一个promise，可以await简化操作，必须配合asnyc使用
        /* const result = await this.$http.post('login', this.loginForm)
        console.log(result) */
        // 解构赋值，取出有用的data数据
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')

        /* 将登录成功后的token，保存到客户端 sessionStorage 中
         * 项目中出登录外的其他接口，都必须在登录后才能访问
         * token 只应在当前网站打开期间生效，故保存在sessionStorage
         *  通过编程式导航跳转到后台主页，/home
         */
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  // 水平居中
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar-box {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
}
</style>
