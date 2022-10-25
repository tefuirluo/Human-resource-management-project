<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <login-setting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <job-info />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import jobInfo from '@/views/employees/detail/job-info'
import loginSetting from '@/views/employees/detail/login-setting'
import userInfo from '@/views/employees/detail/user-info'
export default {
  components: {
    jobInfo,
    loginSetting,
    userInfo
  }
}
</script>
