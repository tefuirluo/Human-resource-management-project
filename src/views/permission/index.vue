<template>
  <div class="permission-container">
    <div class="app-container">
      <page-tools>
        <template #slot-right>
          <el-button type="primary" size="small" @click="addPermissionFn(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-card class="card">
        <el-table
          border
          :data="allPermissionList"
          row-key="id"
        >
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column v-slot="{ row }" label="操作">
            <template>
              <el-button v-if="row.type === 1" type="text" @click="addPermissionFn(2, row.id)">添加</el-button>
              <el-button type="text" @click="editPermissionFn(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermissionFn(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!--添加权限点 -> 弹框-->
      <perDialog
        ref="perDialog"
        :is-edit="isEdit"
        :permission-list="permissionList"
        @addPerEV="addPerEV"
      />
    </div>
  </div>
</template>

<script>
import {
  addPermissionAPI,
  delPermissionAPI,
  getPermissionDetailAPI,
  getPermissionListAPI,
  updatePermissionAPI
} from '@/api'
import { transTree } from '@/utils'
import perDialog from '@/views/permission/components/perDialog'

export default {
  components: {
    perDialog
  },
  data() {
    return {
      allPermissionList: [], // 所有权限点列表的数组 -> 树形
      permissionList: [], // 所有的 -> 扁平
      isEdit: false // 添加 | 编辑 权限点
    }
  },
  created() {
    // 获取所有权限点列表
    this.getPermissionListFn()
  },
  methods: {
    // 获取所有权限点列表
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      // transTree 内部查找的时候, 参数2, 要传递父级 id => 递归找子对象
      this.permissionList = res.data
      // 目标: 为了让 pid 为 0 的对象, 在数组里的第一层
      this.allPermissionList = transTree(res.data, '0')
    },
    // 点击添加 -> 权限点弹窗出现
    // type => 右上角 -> 1 | 页面权限点右侧 -> 2   => type 值作为新对象的 type 值使用
    // pid => 右上角 -> 0 | 页面权限点右侧 -> pid 值  => pid 也是要给新对象 pid 使用
    addPermissionFn(type, pid) {
      this.isEdit = false
      this.$refs.perDialog.showDialog = true // 弹窗出现
      this.$refs.perDialog.formData.type = type
      this.$refs.perDialog.formData.pid = pid
    },

    // 执行 添加 | 编辑 权限点逻辑
    async addPerEV(formData) {
      if (this.isEdit) { // 编辑
        await updatePermissionAPI(formData)
      } else { // 新增
        await addPermissionAPI(formData)
      }
      await this.getPermissionListFn()
    },
    // 编辑权限点 -> 点击事件
    async editPermissionFn(perId) {
      this.isEdit = true
      this.$refs.perDialog.showDialog = true // 共用一个弹窗, 出现
      const res = await getPermissionDetailAPI(perId)
      this.$refs.perDialog.formData = res.data
    },
    // 删除权限点 => 点击事件
    async delPermissionFn(perId) {
      await delPermissionAPI(perId)
      await this.getPermissionListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-top: 10px;
}
</style>
