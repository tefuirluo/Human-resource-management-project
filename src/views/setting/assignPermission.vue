<template>
  <div>
    <div>分配权限功能</div>
    <el-tree
      ref="theTree"
      :data="permissionList"
      :props="{ label: 'name' }"
      show-checkbox
      default-expand-all
      check-strictly
      node-key="id"
    />

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignPermission',
  props: {
    // 所有权限点数据 => 树形结构
    permissionList: {
      type: Array,
      default: _ => []
    },
    roleId: {
      type: [Number, String],
      required: true
    },
    // 此角色现有权限点 id 值数组
    permIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  watch: {
    permIds() {
      this.$refs.theTree.setCheckedKeys(this.permIds)
    }
  },
  created() {
    // console.log(this.roleId)
  },
  methods: {
    // 取消按钮
    cancelButton() {
      // input 事件 -> vue2 每个组件身上只能用一次
      this.$emit('input', false)
    },

    // 设置权限按钮
    setRolesBtn() {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
