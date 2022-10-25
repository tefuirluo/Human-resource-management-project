<template>
  <div>
    <el-dialog
      :title="isEdit ? '编辑部门' : '添加子部门'"
      :visible="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      @update:visible="val => $emit('update:dialogVisible', false)"
      @close="dialogCloseFn"
    >
      <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
            <el-option v-for="item in employeesSimpleList" :key="item.id" :value="item.username" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DepartDialog',
  props: {
    // 页面 -> 控制 dialog 是否显示
    dialogVisible: {
      type: Boolean
    },
    // 员工列表
    employeesSimpleList: {
      type: Array,
      default: () => []
    },
    /* departDetailObj: {
      type: Object,
      default: () => ({})
    } */
    // 部门列表数组(扁平结构)
    originList: {
      type: Array,
      default: () => []
    },
    // 编辑 | 新增
    isEdit: {
      type: Boolean,
      default: false
    },
    // 当前编辑的部门 Id
    clickDepartId: {
      type: String,
      default: ''
    }
  },
  data() {
    const vaildCode = (rule, value, callback) => {
      // 新增部门 => 部门 code 不能和所有人相同
      let codeList = this.originList.map(item => item.code)
      if (this.isEdit) {
        const newArr = this.originList.filter(item => item.id !== this.clickDepartId)
        codeList = newArr.map(item => item.code)
      }
      codeList.includes(value) ? callback(new Error(`部门编码 ${value} 已经存在了`)) : callback()
    }
    const vaildName = (rule, value, callback) => {
      // 新增部门名字 => 先找到同级部门对象
      let nameList = this.originList.filter(item => item.pid === this.clickDepartId).map(item => item.name)
      if (this.isEdit) {
        const obj = this.originList.find(item => item.id === this.clickDepartId)
        const pid = obj.pid
        nameList = this.originList.filter(item => item.pid === pid && item.id !== this.clickDepartId).map(item => item.name)
      }

      nameList.includes(value) ? callback(new Error(`部门 ${value} 已经存在了`)) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称要求2-10个字符', trigger: 'blur' },
          { validator: vaildName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 20, message: '部门编码要求1-20个字符', trigger: 'blur' },
          { validator: vaildCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // watch: {
  //   departDetailObj() {
  //     this.form = this.departDetailObj
  //   }
  // },
  methods: {
    // 添加子部门 => 关闭前的回调
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 取消 -> 点击事件
    cancelFn() {
      this.$emit('update:dialogVisible', false)
    },
    // 确定 -> 点击事件
    confirmFn() {
      // JS 兜底校验
      this.$refs.deptForm.validate(vaild => {
        if (vaild) {
          this.$emit('addDepartEV', { ...this.form })
          this.$emit('update:dialogVisible', false)
        }
      })
    },
    // 关闭后触发的回调函数
    dialogCloseFn() {
      // 清除表单绑定的值
      this.form = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 清除校验提示
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
