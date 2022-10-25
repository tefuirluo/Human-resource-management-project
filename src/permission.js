import router, { asyncRoutes } from './router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      next()
      if (!store.getters.name) {
        const menus = await store.dispatch('user/getUserInfoActions')
        console.log(menus)
        // 用 menus 权限点英文字符串, 和路由规则对象 name 匹配
        // 把所有准备好的 8 个路由规则对象取出, 看 名字是否和 menus 中匹配
        // 若匹配, 则该用户有此权限, 让 filter 收集此路由规则到新数组中
        const filterList = asyncRoutes.filter(routeObj => {
          const routeName = routeObj.children[0].name.toLowerCase()
          return menus.includes(routeName)
        })
        console.log(filterList)
        filterList.push({ path: '*', redirect: '/404', hidden: true })
        // 始终动态添加 8 个路由
        router.addRoutes(filterList)
        // 给 vuex 同步一份路由规则
        store.commit('permission/setRoutes', filterList)
        // 路由再跳转一次
        next({
          path: to.path, // 保证路由添加完了再进入页面 (可以理解为重进一次)
          replace: true // 重进一次, 不保留重复历史
        })
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  // 正常 next() 放行跳转了 才会走后置守卫 关闭正常流程进度条
  document.title = getPageTitle(to.meta.title)
  NProgress.done()
})
