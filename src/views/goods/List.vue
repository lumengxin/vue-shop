<template>
  <div class="goods-list">
    <x-breadcrumbs>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </x-breadcrumbs>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入关键字.."
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
            >
            <el-button slot="append" icon="el-icon-search"
              @click="getGoodsList"
              ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price" width="120"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="120"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="200">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              @click="editGood(scope.row)"
              >编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
              >删除</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'List',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    editGood() {},
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeGoodsById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          canceButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getGoodsList()
    },
    goAddPage() {
      this.$router.push('/goods/add')
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
</style>
