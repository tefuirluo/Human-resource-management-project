<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" class="fullscreen" @click="toggleScreenFullFn" />
  </div>
</template>

<script>
import screenFull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false // 全屏
    }
  },
  created() {
    screenFull.on('change', () => {
      this.isFullscreen = screenFull.isFullscreen
    })
  },
  methods: {
    toggleScreenFullFn() {
      screenFull.toggle()
      // 切换全屏与否状态
      // this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
