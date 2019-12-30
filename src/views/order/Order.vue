<template>
  <div class="order">
    <x-breadcrumbs>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </x-breadcrumbs>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入关键字.."
            v-model="queryInfo.query"
            clearable
            >
            <el-button slot="append" icon="el-icon-search"
              ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="120"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              @click="showBox(scope.row)"
              ></el-button>
            <el-button type="success" icon="el-icon-location" size="mini"
              @click="showProgressBox"
              ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        >
      </el-pagination>
    </el-card>

    <el-dialog title="修改地址" :visible="addressVisible" width="40%"
      @close="addressClosed"
      >
      <el-form :model="addressForm" :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
        >
        <el-form-item label="省市县/区" prop="address1">
          <el-cascader :options="cityData"
            v-model="addressForm.address1"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="物流进度" :visible="progressVisible" width="40%" ref="progressRef"
      @close="progressClosed"
      >
      <el-timeline>
        <el-timeline-item
          v-for="(progress, index) in progressInfo"
          :key="index"
          :timestamp="progress.time"
          >
          {{progress.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../plugins/citydata.js'

export default {
  name: 'Order',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.$message.success('获取订单列表成功')
      this.orderList = res.data.goods
      this.total = res.data.total
      console.log(this.orderList)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    addressClosed() {
      this.$refs.addressFormRef.resetFields()
      this.addressVisible = false
    },
    showBox() {
      this.addressVisible = true
    },
    async showProgressBox() {
      this.progressVisible = true
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败')
      }
      this.progressInfo = res.data
      console.log(this.progressInfo)
    },
    progressClosed() {
      this.progressVisible = false
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
