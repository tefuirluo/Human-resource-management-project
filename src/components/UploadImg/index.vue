<template>
  <el-upload
    class="avatar-uploader"
    action="https://jsonplaceholder.typicode.com/posts/"
    :show-file-list="true"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :http-request="customRequestFn"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
    <el-progress v-show="showProgress" type="circle" :percentage="percentage" class="progress" />
  </el-upload>
</template>

<script>
const COS = require('cos-js-sdk-v5')
var cos = new COS({
  SecretId: 'AKIDVqwqX5RZUAalkX36uZ0BD2g6KLCwfihe',
  SecretKey: '0nQr31kGYcXEjzzjHhutdKq78vVxGMDr'
})
export default {
  data() {
    return {
      imageUrl: '', // 上传成功的图片地址(外链)
      showProgress: false,
      percentage: 0 // 上传的进度 -> 0 ~ 100
    }
  },
  methods: {
    // 文件上传成功到后台, 后的回调函数
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt4M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isJPG && isLt4M
    },
    customRequestFn(obj) {
      this.showProgress = true
      // upload 自定义上传过程
      cos.uploadFile({
        Bucket: 'tefuirluo-1314581971', /* 填写自己的bucket，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
        Key: obj.file.name, /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */
        Body: obj.file, // 上传文件对象
        SliceSize: 1024 * 1024 * 5, /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */
        onProgress: progressData => { // 进度条
          // console.log(JSON.stringify(progressData))
          this.percentage = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        if (err) {
          console.log('上传失败', err)
        } else {
          console.log('上传成功')
          this.imageUrl = 'https://' + data.Location
          // 可以通过延时显示进度条
          this.showProgress = false
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}
</style>
