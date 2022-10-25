import router from './router'
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
      if (!store.getters.name) { store.dispatch('user/getUserInfoActions') }
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
