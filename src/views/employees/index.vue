<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共 19 条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="danger" size="small" @click="uploadBtnFn">导入excel</el-button>
          <el-button type="success" size="small" @click="exportBtnFn">导出excel</el-button>
          <el-button type="primary" size="small" @click="addEmpBtnFn">新增员工</el-button>
        </template>
      </page-tools>

      <!--员工列表 + 分页-->
      <el-card style="margin-top: 10px;">
        <el-table border :data="employeesList">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="staffPhoto" label="头像">
            <template v-slot="scope">
              <ImageHolder class="staffPhoto" :src="scope.row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" />
          <el-table-column prop="workNumber" label="工号" sortable :sort-method="workNumberSortFn" />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatter" />
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" :formatter="timeFormatter" />
          <el-table-column label="操作" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="lookDetailFn(row.id, row.formOfEmployment)">查看</el-button>
              <el-button type="text" size="small" @click="assignRoleBtnFn(row)">分配角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[5, 10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>

      <!--新增员工 - 弹窗-->
      <el-dialog
        title="新增员工"
        :visible.sync="showDialog"
        @close="closeFn"
      >
        <emp-form
          ref="empForm"
          :show.sync="showDialog"
          :tree-data="treeData"
          @addEmpEV="addEmpFn"
        />
      </el-dialog>

      <!-- 员工-分配角色权限 - 弹窗 -->
      <el-dialog title="分配角色" :visible.sync="showRoleDialog">
        <!-- 设置角色组件 -->
        <assign-role-dialog
          ref="assignRoleDialog"
          :show.sync="showRoleDialog"
          :all-role-list="allRoleList"
          @addRoleEV="addRoleFn"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>

import {
  addEmployeesAPI,
  getDepartmentsListAPI,
  getEmployeesListAPI,
  getRoleListAPI,
  getUserInfoAPI,
  saveEmployeesRoleAPI
} from '@/api'
import Employees from '@/api/constant' // 导入回来枚举值
import EmpForm from '@/views/employees/components/empForm'
import AssignRoleDialog from '@/views/employees/components/assignRoleDialog'
import { transTree } from '@/utils'
import dayjs from 'dayjs'

export default {
  components: {
    EmpForm,
    AssignRoleDialog
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      hireTypeList: Employees.hireType, // 聘用形式 - 枚举数组
      showDialog: false, // 新增员工的弹框 -> 显示 | 隐藏
      treeData: [], // 部门列表, 树形结构
      allEmployeesList: [], // 所有员工的列表
      showRoleDialog: false, // 分配角色 -> 弹窗 -> 显示 | 隐藏
      allRoleList: [], // 所有的角色列表
      clickEmpId: '' // 点击分配角色 -> 选中员工 id
    }
  },
  created() {
    // 获取员工列表数据
    this.getEmployeesListFn()
    // 获取部门列表数据
    this.getDepartmentsListFn()
    // 获取所有角色列表数据
    this.getRoleListFn()
  },
  methods: {
    // 请求 -> 员工列表
    async getEmployeesListFn() {
      const res = await getEmployeesListAPI(this.query)
      this.employeesList = res.data.rows
      this.total = res.data.total
      // 第二次请求, 拿到所有数据
      const allRes = await getEmployeesListAPI({
        page: 1,
        size: res.data.total
      })
      this.allEmployeesList = allRes.data.rows
    },

    // 请求 -> 角色列表
    async getRoleListFn() {
      const res = await getRoleListAPI({
        page: 1,
        pagesize: 10
      })
      const allRes = await getRoleListAPI({
        page: 1,
        pagesize: res.data.total
      })
      this.allRoleList = allRes.data.rows
    },

    // 请求 -> 部门列表
    async getDepartmentsListFn() {
      const res = await getDepartmentsListAPI()
      this.treeData = transTree(res.data.depts, '')
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getEmployeesListFn()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getEmployeesListFn()
    },

    // 格式化表格的某一项
    formatter(row, column, cellValue, index) {
      // 用数组的 find 方法找到 id = 1 的元素，再取出它的 value
      const obj = Employees.hireType.find((item) => item.id === parseInt(cellValue))
      return obj ? obj.value : '未知'
    },

    // 工号排序方法
    workNumberSortFn(a, b) {
      return parseInt(a.workNumber) - parseInt(b.workNumber)
    },

    // 时间格式化
    timeFormatter(row) {
      return dayjs(row.timeOfEntry).format('YYYY-MM-DD')
    },

    // 新增员工 按钮 -> 点击方法
    addEmpBtnFn() {
      this.showDialog = true
    },

    // 新增员工 -> 逻辑请求
    async addEmpFn(empObj) {
      await addEmployeesAPI(empObj)
      this.getEmployeesListFn()
    },

    // 新增员工弹窗 -> 关闭事件
    closeFn() {
      this.$refs.empForm.$refs.addForm.resetFields()
    },

    // 导入 Excel 按钮 -> 点击事件 -> 为了跳转到 excel 上传页面
    uploadBtnFn() {
      this.$router.push('/excel')
    },

    // 导出 Excel 按钮 -> 点击事件
    exportBtnFn() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间']
        // 核心: 把请求回来数组套对象的数据, 转成只有值的二维数组
        // 调整对应顺序
        // 序号在遍历的时候就有索引值了, 所以它的值不需要在英文对象中获取, 所以不用映射
        // 1. 中文 -> 英文 映射关系
        const zhAndEnObj = {
          '姓名': 'username',
          '头像': 'staffPhoto',
          '手机号': 'mobile',
          '工号': 'workNumber',
          '聘用形式': 'formOfEmployment',
          '部门': 'departmentName',
          '入职时间': 'timeOfEntry'
        }
        // 2. 遍历每一个英文对象
        const data = this.allEmployeesList.map((enObj, index) => {
          // 3. 遍历每一个中文 key 值
          const newArr3 = []
          tHeader.forEach(zhKey => {
            if (zhKey === '序号') {
              newArr3.push(index + 1)
            } else {
              const enKey = zhAndEnObj[zhKey]
              const value = enObj[enKey]
              if (enKey === 'formOfEmployment') {
                const obj = Employees.hireType.find(item => item.id === parseInt(value))
                newArr3.push(obj ? obj.value : '未知')
              } else {
                newArr3.push(value)
              }
            }
          })
          // 4. 把一行值数组 return 给 map 内
          return newArr3
        })
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '导出数据',
          autoWidth: true,
          bookType: 'xlsx'
        })
        this.downloadLoading = false
      })
    },

    // 员工列表 -> 点击查看详情
    lookDetailFn(empId, formOfEmploymentId) {
      this.$router.push(`/employees/detail?id=${empId}&form=${formOfEmploymentId}`)
    },

    // 分配角色 -> 点击事件 -> 分配角色弹窗出现
    async assignRoleBtnFn(empObj) {
      const res = await getUserInfoAPI(empObj.id)
      this.clickEmpId = empObj.id
      this.showRoleDialog = true
      this.$nextTick(() => {
        this.$refs.assignRoleDialog.roleIdsList = res.data.roleIds
      })
    },

    // 调用接口保存, 员工最新的角色 id
    async addRoleFn(roleIdsList) {
      await saveEmployeesRoleAPI({
        id: this.clickEmpId,
        roleIds: roleIdsList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
