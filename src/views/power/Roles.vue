<template>
  <div class="roles">
    <x-breadcrumbs>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </x-breadcrumbs>

    <el-card>
      <el-row>
        <el-col>
          <el-button @click="showAddRoleVisible">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border
        :highlight-current-row="true"
        :row-class-name="tableRowClassName"
        >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['dbbottom', i1 === 0 ? 'dbtop' : '', 'vcenter']"
              >
              <el-col :span="5">
                <el-tag closable
                  @close="removeRightById(scope.row, item1.id)"
                  >
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'dbtop', 'vcenter']"
                  >
                  <el-col :span="6">
                    <el-tag closable type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      >
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                      >
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit"
              size="mini"
              @click="showEditRoleVisible(scope.row.id)"
              >
              编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
              >
              删除
            </el-button>
            <el-button type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >
              分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="分配权限"
      :visible="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
      >
      <el-tree :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
        >
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="allotRights">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title"
      :visible="setRolesDialogVisible"
      width="50%"
      @close="setRolesDialogClosed"
      >
      <el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole(title, roleForm.roleId)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, getRoleInfo, editRoles, deleteRoles } from '../../server/business/power'

export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: '',
      setRolesDialogVisible: false,
      roleForm: {
        roleId: 0,
        roleName: '',
        roleDesc: ''
      },
      title: '',
      roleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入角色描述', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在5-15个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    async removeRightById(role, rightId) {
      // $confirm 返回promise 使用await/async 简化操作
      const confirmResult = await this.$confirm('是否确认删除该权限?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除权限成功')

      // this.getRolesList()
      // 删除后，重新赋值新的权限列表，不关闭展开框
      role.children = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id

      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightslist = res.data
      // console.log(this.rightslist)

      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 递归函数，获取当前角色的第三级权限
    getLeafKeys(node, arr) {
      // 当前节点无children,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      // 对象展开运算符，合并到新数组, 得到所有全选和半选节点id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: idStr
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    showAddRoleVisible() {
      this.title = '添加角色'
      this.setRolesDialogVisible = true
    },
    /* 自定义接口 */
    addRoles() {
      addRole({
        roleName: this.roleForm.roleName,
        roleDesc: this.roleForm.roleDesc
      }).then(res => {
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        } else {
          this.$message.success('添加角色成功')
        }
      })
      this.setRolesDialogVisible = false
      // this.getRolesList()
    },
    getRoleInfo(roleId) {
      getRoleInfo(roleId).then((res) => {
        this.roleForm.roleId = res.data.roleId
        this.roleForm.roleName = res.data.roleName
        this.roleForm.roleDesc = res.data.roleDesc
      })
    },
    editRoles(roleId) {
      editRoles(roleId).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('编辑角色失败')
        } else {
          this.$message.success('编辑角色成功')
        }
      })
    },
    async removeUserById(roleId) {
      const confirmResult = await this.$confirm('是否确认删除该角色?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除操作')
      }

      deleteRoles(roleId).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('删除角色失败')
        } else {
          this.$message.success('删除角色成功')
        }
      })
      this.getRolesList()
    },
    setRolesDialogClosed() {
      // this.$refs.roleFormRef.resetFields()
      this.roleForm.roleName = ''
      this.roleForm.roleDesc = ''
      this.setRolesDialogVisible = false
    },
    showEditRoleVisible(roleId) {
      this.title = '编辑角色'
      this.setRolesDialogVisible = true
      this.getRoleInfo(roleId)
    },
    confirmRole(title, roleId) {
      if (title === '添加角色') {
        this.addRoles()
      } else {
        this.editRoles(roleId)
      }
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
.dbtop {
  border-top: 1px solid #eee;
}
.dbbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
// 垂直居中
.vcenter {
  display: flex;
  align-items: center;
}
</style>
