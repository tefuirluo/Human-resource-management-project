<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // 用 addRouters, 左侧菜单不渲染:
      // this.$router.options.routes 一次性的, 只能拿到 new VueRouter 时配置项里面的数组
      // 后续 addRouters 添加的路由规则对象, 并没有影响到这里
      // 解决: 把路由规则数组, 在 vuex 中, 自己再管理一份
      // vuex 是响应式的, 只要改变, 就会更新
      // 重点:
      // router 路由对象内部有一个路由匹配的规则数组 => 内存
      // 另一个路由数组 => vuex 专门给这里生成左侧导航
      // return this.$router.options.routes
      return this.$store.state.permission.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
