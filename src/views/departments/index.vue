<template>
  <div class="departments-container">
    <div class="app-container">
      <!-- 卡片组件(分为头部和身体) -->
      <el-card class="box-card">
        <!-- 头部 -->
        <div slot="header" class="clearfix">
          <!-- tab导航 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织架构" name="first" class="tab-pane">
              <!--头部-->
              <el-row type="flex" justify="space-between" align="middle" class="department-header">
                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">江苏传智播客教育科技股份有限公司</span>
                </el-col>
                <!-- 第二列4份 -->
                <el-col :span="4">
                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col>负责人</el-col>
                    <el-col>
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown>
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <!--列表-->
              <!--node-click  tree 组件行的点击事件 | 节点的点击事件-->
              <el-tree
                class="departments-tree"
                :data="treeData"
                :props="defaultProps"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
              >
                <template #default="{ data }">
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="height: 40px; width: 100%;"
                  >
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>
                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown>
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                              <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                              <el-dropdown-item v-if="data && !data.children" @click.native="del(data)">删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      <!--(封装)添加子部门 dialog-->
      <depart-dialog
        ref="departDialog"
        :dialog-visible.sync="dialogVisible"
        :employees-simple-list="employeesSimpleList"
        :depart-detail-obj="departDetailObj"
        :click-depart-id="clickDepartId"
        :origin-list="originList"
        :is-edit="isEdit"
        @addDepartEV="addDepartFn"
      />
    </div>
  </div>
</template>

<script>
import {
  addDepartmentsAPI, delDepartmentAPI,
  getDepartDetailAPI,
  getDepartmentsListAPI,
  getEmployeesSimpleListAPI,
  updateDepartmentsAPI
} from '@/api'
import { transTree } from '@/utils'
import departDialog from '@/views/departments/components/departDialog'

export default {
  name: 'Departments',
  components: {
    departDialog
  },
  data() {
    return {
      activeName: 'first',
      treeData: [],
      defaultProps: {
        children: 'children', // children 属性对应值, 要对应数据对象哪个字段 => 来决定行节点是否有嵌套的子节点数据
        label: 'departName' // label属性对应的值 要对应数据对象里的哪个字段 => 此对象字段的值, 决定节点行标签显示的中文
      },
      dialogVisible: false, // 添加子部门, 控制显示或隐藏
      employeesSimpleList: [], // 员工简单列表
      clickDepartId: '', // 点击部门 Id
      departDetailObj: {}, // 部门详情对象
      isEdit: false, // 添加 | 编辑 部门状态
      originList: [] // 用于校验部门列表扁平数组
    }
  },
  created() {
    // 获取部门列表
    this.getDepartmentsListFn()
    // 获取部门负责人信息
    this.getEmployeesSimpleListFn()
  },
  methods: {
    // 方便服用 封装请求
    // 获取部门列表
    async getDepartmentsListFn() {
      const res = await getDepartmentsListAPI()
      this.originList = res.data.depts.map(item => (
        {
          id: item.id,
          code: item.code,
          name: item.name,
          pid: item.pid // 下面使用
        }
      ))
      this.treeData = transTree(res.data.depts, '')
    },
    // 获取-部门负责人列表
    async getEmployeesSimpleListFn() {
      const res = await getEmployeesSimpleListAPI()
      // console.log(res.data)
      this.employeesSimpleList = res.data
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    // 正文部分-右侧的添加子部门
    // 头部 -> 添加子部门 -> data 是 undefined 可以给一个默认值 '' -> 一级部门的 pid = ''
    // 列表 -> 添加子部门 -> data 是一行对应的部门对象 -> treeData 里面的数据
    add(data) {
      if (data === undefined) {
        this.clickDepartId = '' // 点击这行的 id 存入
      } else {
        this.clickDepartId = data.id // 点击这行的 id 存入
      }
      // 子部门 pid = 父级部门 id
      this.dialogVisible = true // 添加子部门 => dialog出现
      this.isEdit = false
    },
    // 编辑子部分
    async edit(data) {
      this.clickDepartId = data.id
      this.dialogVisible = true
      this.isEdit = true
      const res = await getDepartDetailAPI(data.id)
      this.$refs.departDialog.form = res.data
    },
    // 删除部分
    async del(data) {
      // 显示删除确认消息对话框
      const delRes = await this.$confirm('此操作将永久删除部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果返回的结果是 cancel 说明用户取消了删除
      if (delRes === 'cancel') return this.$message('您取消了删除')

      // 调用删除接口
      const delDepartRes = await delDepartmentAPI(data.id)
      // 根据状态值, 查看是否删除成功
      if (!delDepartRes.success) return this.$message.error(delDepartRes.message)
      // 删除成功需要给用户进行提示
      this.$message.success(delDepartRes.message)
      // 删除后需要重新获取当前页面数据
      this.getDepartmentsListFn()
    },
    // 添加子部门的方法
    async addDepartFn(dataObj) {
      if (this.isEdit) { // 编辑状态
        dataObj.id = this.clickDepartId
        // console.log(dataObj)
        await updateDepartmentsAPI(dataObj)
        // console.log(res)
      } else {
        dataObj.pid = this.clickDepartId
        await addDepartmentsAPI(dataObj)
        // await 只有成功才往下走 => 列表刷新
      }
      // 添加 | 编辑 完成 刷新列表
      this.getDepartmentsListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.departments-tree {
  margin: 12px 0;
}

.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>
