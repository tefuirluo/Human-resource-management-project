import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: () => {
    return {
      routes: constantRoutes // vuex 中保存的路由对象数组
    }
  },
  mutations: {
    setRoutes(state, asyncRoutes) {
      state.routes = [...constantRoutes, ...asyncRoutes]
    }
  }
}
