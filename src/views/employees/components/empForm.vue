<template>
  <!--表单-->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <el-option
          v-for="(item, index) in hireType"
          :key="index"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input
        v-model="formData.departmentName"
        style="width:50%"
        placeholder="请选择部门"
        @focus="departmentNameFocus"
      />
      <div class="tree-box">
        <el-tree
          v-show="showTree"
          :data="treeData"
          default-expand-all
          :props="{ label: 'name' }"
          @node-click="treeClick"
        />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="cancelFn">取消</el-button>
      <el-button type="primary" @click="confirmFn">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Employees from '@/api/constant'
export default {
  name: 'EmpForm',
  props: {
    treeData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 添加表单字段
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      // 添加表单的校验字段
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      },
      hireType: Employees.hireType, // 聘用形式枚举数组 + 对象
      showTree: false, // 部门树形控件 => 显示 | 隐藏
      clickDepartName: '' // 点击的部门名字 -> 选择
    }
  },
  watch: {
    // 检测用户在页面赋予的新值 newVal
    'formData.departmentName'(newVal) {
      if (newVal.length === 0) {
        return
      }
      if (newVal !== this.clickDepartName) { // 证明用户在修改
        this.formData.departmentName = this.clickDepartName // 立刻把用户改的覆盖掉
      }
    }
  },
  methods: {
    // 取消按钮
    cancelFn() {
      this.$emit('update:show', false)
    },
    // 确定按钮
    confirmFn() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$emit('addEmpEV', { ...this.formData })
          this.$emit('update:show', false)
        }
      })
    },
    // 部门输入框 -> 聚焦事件
    departmentNameFocus() {
      this.showTree = true
    },
    // 部门树形控件 -> 点击事件
    treeClick(data) {
      if (data && data.children) {
        return
      }
      this.formData.departmentName = data.name
      this.clickDepartName = data.name // 把点击的名字另存一份
      this.showTree = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
