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
              @click="editGood(scope.row.goods_id)"
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

    <el-dialog title="修改商品信息"
      :visible="editGoodsDialogVisible"
      width="50%"
      @close="editGoodsDialogClosed"
      >
      <el-form :model="goodsInfo" :rules="goodsInfoRules" ref="goodsInfoRef">
        <el-form-item label="商品名称">
          <el-input v-model="goodsInfo.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="goodsInfo.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="goodsInfo.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="goodsInfo.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-input v-model="goodsInfo.add_time"></el-input>
        </el-form-item>
      </el-form>
      <div class="buts">
        <el-button @click="editGoodsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveGoodsInfo(goodsInfo.id, goodsInfo)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsInfoById, upDateGoodsInfoById } from '../../server/business/goods'

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
      total: 0,
      editGoodsDialogVisible: false,
      goodsInfo: {
        id: 0,
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        add_time: 0
      },
      goodsInfoRules: {
        goods_name: { required: true, message: '请输入商品名称', trigger: 'blur' },
        goods_price: { required: false, message: '请输入商品价格', trigger: 'blur' },
        goods_weight: { required: false, message: '请输入商品重量', trigger: 'blur' },
        add_time: { required: false, message: '请输入商品添加时间', trigger: 'blur' }
      }
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
    },
    getGoodsInfos(goodId) {
      getGoodsInfoById(goodId).then(res => {
        this.goodsInfo.id = res.data.goods_id
        this.goodsInfo.goods_name = res.data.goods_name
        this.goodsInfo.goods_price = res.data.goods_price
        this.goodsInfo.goods_number = res.data.goods_number
        this.goodsInfo.goods_weight = res.data.goods_weight
        this.goodsInfo.add_time = res.data.add_time
      })
    },
    editGood(goodId) {
      this.editGoodsDialogVisible = true
      this.getGoodsInfos(goodId)
    },
    editGoodsDialogClosed() {
      this.$refs.goodsInfoRef.resetFields()
      this.editGoodsDialogVisible = false
    },
    saveGoodsInfo(id, data) {
      upDateGoodsInfoById(id, {
        id: data.id,
        goods_name: data.goods_name,
        goods_price: data.goods_price,
        goods_number: data.goods_number,
        goods_weight: data.goods_weight
      }).then((res) => {
        if (res.meta.status !== 201) {
          this.$message.error(`更新商品信息失败(${res.meta.msg})`)
        } else {
          this.$message.success('更新商品信息成功')
        }
      })
      this.editGoodsDialogVisible = false
      this.getGoodsList()
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
</style>
