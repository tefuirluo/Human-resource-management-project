<template>
  <div class="app-container">
    <!--upload-excel-component 是大佬封装的上传 excel 表格上传组件-->
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <!--展示表格读取数据-->
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
// 导入 src/components/ 下的表格上传组件
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { importEmployeesAPI } from '@/api'
import { formatExcelDate } from '@/utils'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [], // 表格数据
      tableHeader: [] // 表格头部数据
    }
  },
  methods: {
    // 在上传 excel 文件后, 做一个判断 => 小于 1MB
    beforeUpload(file) {
      // file -> 上传的文件对象 -> excel 文件对象 -> size 的单位 Byte
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true // 通过
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      }) // 不通过返回 false
      return false
    },
    async handleSuccess({ results, header }) {
      // header 里, 第一行数据作为标题字符串数组
      this.tableData = results
      this.tableHeader = header
      // 1. 准备 中文 -> 英文 的映射关系 -> 枚举关系
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 2. 遍历数组
      const newArr = results.map(obj => {
        const newObj = {}
        // 3. 拿到对象内部所有的 key 名 =>  Object.keys(对象)
        const keyArr = Object.keys(obj)
        // 4. 遍历每个中文的 key, 换成对应的英文的字符串
        keyArr.forEach(zhKey => {
          const enKey = userRelations[zhKey] // 英文字符串 key
          // 5. 为新对象, 组装 -> 英文 key 和对应的值
          // 6. 处理入职时间 -> 格式化
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            newObj[enKey] = formatExcelDate(obj[zhKey])
          } else {
            newObj[enKey] = obj[zhKey]
          }
        })
        return newObj
      })
      await importEmployeesAPI(newArr)
      this.$router.back()
    }
  }
}
</script>
