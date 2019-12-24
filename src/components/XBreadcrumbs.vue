<template>
  <div class="breadcrumbs">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <slot></slot>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'XBreadcrumbs'
}
</script>
