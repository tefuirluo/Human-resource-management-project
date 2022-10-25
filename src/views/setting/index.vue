<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtnFn"
              >新增角色</el-button>
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table border :data="rolesList" style="width: 100%">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="companyObj.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyObj.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyObj.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyObj.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 新增角色 - 弹框 -->
      <el-dialog
        :title="isEdit ? '编辑角色' : '新增角色'"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialog"
        @close="roleCloseDialogFn"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancleRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>

      <!--给角色分配权限点 -> 弹框-->
      <el-dialog title="分配权限点" :visible.sync="dialogVisible">
        <assign-permission
          v-model="dialogVisible"
          role-id="roleId"
          :permission-list="permissionList"
          :perm-ids="permIds"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  addRoleAPI,
  delRoleAPI,
  getCompanyInfoAPI,
  getProfileAPI,
  getRoleDetailAPI,
  getRoleListAPI,
  updateRoleAPI,
  getPermissionListAPI
} from '@/api'
import assignPermission from '@/views/setting/assignPermission'
import { transTree } from '@/utils'
export default {
  components: {
    assignPermission
  },
  data() {
    return {
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 20 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      companyObj: {}, // 公司信息
      showDialog: false, // 控制弹框的隐藏和展示
      isEdit: false, // 新增-false | 编辑-true 角色状态
      dialogVisible: false, // 显示 | 隐藏 -> 分配权限点的弹框
      permissionList: [], // 所有权限点数据
      permIds: [], // 此角色现有的角色点数据 -> 权限点 id 字符串值
      // 添加角色
      roleForm: {
        name: '',
        description: ''
      },
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleListFn()
    this.getCompanyDetailFn()
    this.getPermissionListFn()
  },
  methods: {
    // 获取所有权限点列表
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      this.permissionList = transTree(res.data, '0')
    },

    // 获取角色所有列表
    async getRoleListFn() {
      const res = await getRoleListAPI(this.query)
      if (!res.success) return this.$message.error(res.message)
      this.rolesList = res.data.rows
      this.total = res.data.total
    },
    // 获取公司详情
    async getCompanyDetailFn() {
      // 因为刷新网页, 用户信息获取是在路由跳转以后, 可能会让这里限制性, vuex 获取信息后执行
      // 解决: 多发一次请求, 自己获取公司的 id
      const { data: companyId } = await getProfileAPI()
      const res = await getCompanyInfoAPI(companyId)
      this.companyObj = res.data
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.pagesize = newSize
      this.getRoleListFn()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getRoleListFn()
    },

    // 设置角色
    // roleObj -> 角色对象
    async setRoles(roleObj) {
      const res = await getRoleDetailAPI(roleObj.id)
      this.dialogVisible = true
      this.permIds = res.data.permIds
      this.roleId = roleObj.id
    },

    // 编辑角色
    // roleObj -> 行角色对象
    async editRoles(roleObj) {
      this.isEdit = true
      this.showDialog = true
      const res = await getRoleDetailAPI(roleObj.id)
      this.roleForm = res.data
    },

    // 删除角色
    async delRoles(roleObj) {
      await delRoleAPI(roleObj.id)
      if (this.rolesList.length === 1) {
        this.query.page--
        if (this.query.page === 0) {
          this.query.page = 1
        }
      }
      this.getRoleListFn()
    },

    // 角色弹框-> 确定按钮
    roleSubmit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.isEdit) { // 编辑
            await updateRoleAPI(this.roleForm)
          } else { // 新增
            await addRoleAPI(this.roleForm)
          }
          await this.getRoleListFn()
          this.showDialog = false
        }
      })
    },

    // 角色弹框-> 取消按钮
    cancleRoles() {
      this.showDialog = false
    },

    // 新增角色->按钮点击事件
    addRoleBtnFn() {
      this.isEdit = false
      this.showDialog = true
    },

    // 角色弹框 -> 关闭事件
    roleCloseDialogFn() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
