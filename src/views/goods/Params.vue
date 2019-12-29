/* eslint-disable camelcase */
<template>
  <div class="params">
    <x-breadcrumbs>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </x-breadcrumbs>

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
        >
      </el-alert>
      <el-row class="cat-opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader expand-trigger="hover" :options="catelist"
            v-model="selectedCateKeys"
            :props="cateProps"
            @change="handleChanged"
            clearable
            :change-on-select="true"
            >
          </el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >
            添加参数
          </el-button>
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >
                {{item}}
                </el-tag>
                <el-input size="small" ref="saveTagInput"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  class="input-new-tag"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  >
                </el-input>
                <el-button v-else @click="showInput(scope.row)">+New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
            >
            添加属性
          </el-button>
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >
                {{item}}
                </el-tag>
                <el-input size="small" ref="saveTagInput"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  class="input-new-tag"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  >
                </el-input>
                <el-button v-else @click="showInput(scope.row)">+New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog :title="'添加' + titleText" width="50%"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
      >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
        label-width="100px"
        >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addParams">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'修改' + titleText" width="50%"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef"
        label-width="100px"
        >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="editParams">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      catelist: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称.', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称.', trigger: 'blur' }
        ]
      }
      // inputVisible: false,
      // inputValue: ''
    }
  },
  computed: {
    // 按钮是否禁用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
    },
    handleChanged() {
      // console.log(this.selectedCateKeys)
      this.getParamsData()
    },
    handleClick() {
      // console.log(this.activeName)
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // console.log(this.selectedCateKeys)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      // 将返回的attr_vals字符串处理为数组
      res.data.forEach(item => {
        // item.attr_vals = item.attr_vals.split(' ')
        // 解决空字符串
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 添加布尔值，控制自身New Tag
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data

      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改参数成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    async removeParams(attrId) {
      // $confirm 会返回一个promise
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数，是否继续？',
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
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数信息失败')
      }
      this.$message.success('删除参数信息成功')
      this.getParamsData()
    },
    showInput(row) {
      // this.inputVisible = true
      row.inputVisible = true
      // 输入框自动获取焦点
      // $nextTick() 当页面中元素被重新渲染后，才会执行回调函数中代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm(row) {
      // row.inputVisible = false
      // 输入内容不合理
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 没有return出去，需要对内容进行后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      /* const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        // 保存到数据库，重新处理为字符串
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功') */
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        // 保存到数据库，重新处理为字符串
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.cat-opt {
  margin: 15px 5px;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
  margin-left: 5px;
}
</style>
