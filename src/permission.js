import router from './router'
import 'nprogress/nprogress.css' // progress bar style

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  next()
})

router.afterEach(() => {
})
