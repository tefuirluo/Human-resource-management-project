<template>
  <div>
    <!-- 渲染角色列表 -->
    <!--若该标签中无内容，则该属性也充当 checkbox 按钮后的介绍-->
    <!--当 checkbox 选中时, 会把 label 的值添加到 v-model 数组中, 如果未选中, 就会从数组里移除-->
    <el-checkbox-group v-model="roleIdsList">
      <el-checkbox v-for="item in allRoleList" :key="item.id" :label="item.id">
        <span>{{ item.name }}</span>
      </el-checkbox>
    </el-checkbox-group>

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="enterFn">确定</el-button>
        <el-button size="small" @click="cancleFn">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignRole',
  props: {
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null
    },
    // 所有角色列表
    allRoleList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roleIdsList: [] // 收集选中的角色 Id
    }
  },
  methods: {
    // 取消弹框
    cancleFn() {
      this.$emit('update:show', false)
    },

    // 确定弹框
    enterFn() {
      this.$emit('addRoleEV', this.roleIdsList)
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
