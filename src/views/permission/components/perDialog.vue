<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog :title="isEdit ? '编辑权限点' : '新增权限点'" :visible.sync="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="enterFn">确定</el-button>
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 添加 | 编辑 的状态
    isEdit: {
      type: Boolean,
      default: false
    },
    // 所有权限点 -> 列表 -> 扁平结构
    permissionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const validName = (rule, value, callback) => {
      let nameList = this.permissionList
        .filter(item => item.pid === this.formData.pid)
        .map(item => item.name)
      if (this.isEdit) {
        nameList = this.permissionList
          .filter(
            item => item.pid ===
              this.formData.pid &&
              item.id !==
              this.formData.id
          )
          .map(item => item.name)
      }
      nameList.includes(value)
        ? callback(new Error(`权限名字 ${value} 已经存在`))
        : callback()
    }
    const validaCode = (rule, value, callback) => {
      let codeList = this.permissionList
        .map(item => item.code)
      if (this.isEdit) {
        codeList = this.permissionList
          .filter(
            item =>
              item.id !==
              this.formData.id
          )
          .map(item => item.code)
      }

      codeList.includes(value)
        ? callback(new Error(`权限标识 ${value} 已经存在`))
        : callback()
    }
    return {
      showDialog: false, // 控制弹窗 dialog => 显示 | 隐藏
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型吖
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '权限标识不能为空', trigger: 'blur' },
          { validator: validaCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 关闭弹框
    btnCancel() {
      this.$refs.perForm.resetFields()
      this.formData = this.$options.data().formData
      this.$emit('close')
    },
    // 确定按钮 -> 点击事件
    enterFn() {
      this.$refs.perForm.validate(valid => {
        if (valid) {
          this.$emit('addPerEV', { ...this.formData })
          this.showDialog = false
        }
      })
    },
    // 取消按钮 -> 点击事件
    cancelFn() {
      this.showDialog = false
    }
  }
}
</script>

<style scoped>

</style>
