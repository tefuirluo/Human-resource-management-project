<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in EmployeeEnum.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <upload-img ref="uploadImg" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserInfoAPI, updateEmployeesAPI } from '@/api'
import EmployeeEnum from '@/api/constant'

export default {
  name: 'UserInfo',
  data() {
    return {
      userInfo: {}, // 个人信息 => 对象
      EmployeeEnum
    }
  },
  created() {
    // 请求个人信息
    this.getUserInfoFn()
  },
  methods: {
    async getUserInfoFn() {
      const res = await getUserInfoAPI(this.$route.query.id)
      this.userInfo = res.data
      this.$refs.uploadImg.imageUrl = res.data.staffPhoto
      // 额外加入聘用形式
      // this.userInfo.formOfEmployment = parseInt(this.$route.query.form)
      // 给对象后续添加一个属性
      this.$set(this.userInfo, 'formOfEmployment', parseInt(this.$route.query.form))
    },
    async saveUser() {
      this.userInfo.staffPhoto = this.$refs.uploadImg.imageUrl
      await updateEmployeesAPI(this.userInfo)
    }
  }
}
</script>

<style lang="scss" scoped></style>
