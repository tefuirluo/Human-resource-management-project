<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateFn">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserInfoAPI, updateEmployeesAPI } from '@/api'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      }
    }
  },
  created() {
    // 获取用户信息
    this.getUserInfoFn()
  },
  methods: {
    // 获取用户信息
    async getUserInfoFn() {
      const res = await getUserInfoAPI(this.$route.query.id)
      // this.userInfo.username = res.data.username
      // this.userInfo.password = res.data.password
      this.userInfo = res.data
    },
    // 更新按钮 + JS 兜底校验
    updateFn() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          await updateEmployeesAPI(this.userInfo)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
