<template>
  <div class="goods-add">
    <x-breadcrumbs>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </x-breadcrumbs>

    <el-card>
      <el-alert title="添加商品信息" type="success"
        center show-icon :closable="false"
        >
      </el-alert>
      <!-- 将name中接受到字符串转为数值型activeIndex -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
        label-width="100px"
        label-position="top"
        >
        <el-tabs :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
          >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader expand-trigger="hover" :options="cateList"
              v-model="addForm.goods_cat"
              :props="cateProps"
              @change="cateChanged"
              clearable
              :change-on-select="true"
              >
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="item in manyTableData"
            :key="item.attr_id"
            >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" border
                v-for="(cb, i) in item.attr_vals"
                :key="i"
                >
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
            :key="item.attr_id"
            >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload :action="uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headerObj"
            :on-success="handleSuccess"
            >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button size="small" type="primary" class="add-button"
            @click="addGoods"
            >
            添加商品
          </el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>

    <el-dialog title="图片预览" :visible="previewVisible" width="40%"
      @close="closedPreviewDialog">
      <img :src="previewUrl" alt="pic" class="preview-pic" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Add',
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // el-upload 自带网络请求，没有用到main中封装的axios, 导致图片上传失败
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewUrl: '',
      previewVisible: false
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    cateChanged() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldName) {
      // console.log(activeName, oldName)
      if (oldName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品动态参数失败')
        }
        // console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品静态属性失败')
        }
        this.onlyTableData = res.data
      }
    },
    handlePreview(file) {
      console.log(file)
      this.previewVisible = true
      this.previewUrl = file.response.data.url
    },
    closedPreviewDialog() {
      this.previewVisible = false
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
      // console.log(this.addForm)
    },
    handleSuccess(response) {
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 报错：级联选择器中绑定的为数组
        // this.addForm.goods_cat = this.addForm.goods_cat.join()
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // console.log(this.addForm, form)

        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 400px;
}
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.preview-pic {
  width: 100%;
  height: 600px;
}
.add-button {
  margin-top: 20px;
}
</style>
