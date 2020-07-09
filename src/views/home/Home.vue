<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../../assets/logo.png" width="50" height="50" alt />
        <span>新乡村农贸电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i class="el-icon-s-unfold"></i>
          <!-- ||| -->
        </div>
        <el-menu background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          >
          <!-- index唯一标识不同的导航栏，只接受字符串 -->
          <el-submenu :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
            >
            <template slot="title">
              <!-- <i class="el-icon-message"></i> -->
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savaNavState('/' + subItem.path)"
              >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- home子组件路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont iconyonghu',
        '103': 'iconfont iconpermission',
        '101': 'iconfont iconshangpin',
        '102': 'iconfont iconMPIS-Submit',
        '145': 'iconfont iconMPIS-StatisticalAnalysis'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 路由切换相应菜单保持高亮
    savaNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
// .el-container {
//   height: 100%;
// }
.home-container {
  height: 100%;
}
// 标签名即为类名
.el-header {
  background-color: #373d41;
  display: flex;
  // 贴边对齐
  justify-content: space-between;
  padding-left: 0;
  // 按钮居中
  align-items: center;
  color: #fff;
  font-size: 20px;
  // 标题纵向居中
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button {
    background-color: #4A5064;
    // font-size: 10px;
    // line-height: 24px;
    color: #fff;
    text-align: center;
    // letter-spacing: 0.2rem;
    cursor: pointer;
  }
  .el-menu {
    // 清除el-menu默认右边界1px
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
