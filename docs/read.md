# vue-shop

<hr />
相关网站：

- 图标库： [阿里矢量图](https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=1563784)
- ui:  [element-ui](https://element.eleme.cn/#/zh-CN/component/form)

<hr />
### 项目介绍

#### 1. 目标

- 基于vue初始项目
- 基于vue技术栈开发项目
- 使用vue第三方组件
- 熟悉前后端分离开发模式

#### 2. 项目功能

​	登录、退出功能，主页布局，用户管理模块，权限管理模块，分类管理模块，

​	参数管理模块，商品管理模块，订单管理模块，数据统计模块。

####  3. 项目概述

​	电商后台管理系统，用于管理用户的账号、商品分类、商品信息、订单、数据统计等业务功能。

<img src=".\images\功能.png" alt="功能" style="zoom:80%;" />

#### 4. 开发模式

​	前后端分离，前端项目基于vue技术栈的SPA单页面应用。

​	前端技术栈：vue, vue-router, element-ui, axios, echarts

​	后端技术栈：node.js, express, jwt, mysql, sequelize

### 项目准备

#### 1. 环境

- node

  使用nvm管理工具

  ```
  nvm install 12.13.1;
  nvm use 12.13.1;
  npm -v;(6.12.1);
  ```

- vue-cli

  ```
  npm i -g @vue/cli;
  vue -V;(4.1.1)
  ```

- 其他（mysql 数据库，phpstudy 数据库管理工具）

#### 2. 项目初始化

```
/* 新建目录 */
cd d:home; mkdir projects; cd projects;
/* 使用vue ui图形化界面初始项目 */
vue ui;
1. create 创建项目 -> 选择相应依赖安装
2. 配置项目
	Plugins -> Add plugin 安装element-ui插件，选择Import on demand按需导入
	Dependencies -> Install dependency 安装axios依赖，选择Main dependen运行依赖
```

#### 3. 项目托管

- github 中新建vue-shop项目

- 进入本地 vue-shop目录中

  ```
  // 检查本地状态
  git status;
  // 本地提交
  git add *; git commit -m "init";
  // 建立连接
  * git remote add origin(名字随意) git@github.com:lumengxin/vue-shop.git;
  * (没有正确权限)
  * 解除关联 git remote rm origin, 改用http协议
  git remote add origin https://github.com/lumengxin/vue-shop.git;
  /* 问题：
  git pull origin master;
  报错 - fatal: refusing to merge unrelated histories；
  	两个不相干库，无法合并。
  解决：git pull origin master --allow-unrelated-histories；强行合并
  */
  // 推送到远程
  git push (-u) origin master;
  ```

#### 4. 后台项目配置

- 安装mysql, 使用phpStudy 集成环境。开启MySQL.

- 导入数据库。vue_api_server/db/mydb.sql, 使用phpStudy 点击mysql管理器，输入密码root 选择到sql文件位置，数据库名为mydb, 执行导入。

- 验证后台服务，使用Postman测试。

  <img src=".\images\postman.png" alt="postman" />



### 项目开发

### day01

#### 1. 登录、退出功能

<h5>1.1 功能概述: </h5>
业务流程：

- 登录页面输入用户名，密码
- 调用后台接口验证
- 通过验证后，根据后台响应状态跳转到主页

知识点：

- http是无状态的

- cookie 在客户端记录状态，session在服务端记录状态（不支持跨域）

- token方式维护状态。解决客户端与服务端存在跨域问题。token原理：

  ![token](.\images\token.png)

<h5>1.2 登录实现</h5>
新建login分支：

```
// 创建并切换分支
git checkout -b login;
// 查看分支
git branch;
```

...

##### 1.3 提交代码

```
git add *; git commit -m "登录功能";
// 合并到master
git checkout master;
git merge login;
git push origin master;
// login 推送到远程
git checkout login;
git push -u origin login;
```

#### 2. 用户管理

将master 中开发好的代码，转移到user分支。同步代码

```
git checkout -b user;
git add .;
git commit -m "用户管理";
git push -u origin user;
git checkout master;
git merge user;
git push origin master;
```

.......



### 项目优化

#### 1.项目优化策略

- 生成打包报告
  - 命令行参数：vue-cli-service build --report
  - 可视化ui面板

- 第三库启用CDN
- Element-UI等组件按需加载
- 路由懒加载
  - 安装@babel/plugin-syntax-dynamic-impot包 - 配置 - 改变路由加载形式

- 首页内容定制

优化前：

![优化前](.\images\优化前.png)

优化后(externals)：

![](.\images\优化后png.png)

element, CDN加载：

![](.\images\优化el.png)



### 项目上线

#### 1.相关配置

- 通过node创建web服务器

创建node项目，安装express。通过express快速创建web服务器，将vue打包生成的dist文件夹托管为静态资源即可，代码：

```
const express = require('express')
const app = express()

app.use(express.static('./dist'))

app.listen(80, () => {
	console.log('web server running at http://127.0.0.1')
})
```

- 开启gzip配置

使用gzip可以减小文件体积，使得传输速度更快。

```
npm install compression -D;

const compression = require('compression')
app.use(compression())
```



- 配置https服务

 传统HTTP协议传输的数据都是明文，不安全。HTTPS协议对数据进行了加密处理，可以防止被中间人窃取，更安全。

申请SSL证书：https://freessl.org    https://freessl.cn -> 免费。申请好证书，复制到项目根目录。

配置HTTPS服务（后台项目中导入证书）

```
const https = require('http')
const fs = require('fs')
const options = {
	cert: fs.readFileSync('./full_chain.pem')
	key: fs.readFileSync('./private.key')
}
https.createServer(options, app).listen(443)
```



- 使用pm2管理应用

  关闭终端，项目依然可以在后台运行。

  - 服务器上安装pm2: npm i pm2 -g
  - 启动项目：pm2 start 脚本 --name 自定义名称
  - 查看运行项目：pm2 ls
  - 停止：pm2 stop 自定义名称（或者 id）
  - 删除：pm2 delete 自定义名称