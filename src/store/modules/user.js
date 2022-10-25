import { getProfileAPI, getUserInfoAPI, loginAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), // vuex 的 state 值, 使用本地持久化 => 刷新时, 默认去本地取一个
    userInfo: {}, // 用户的基本资料对象
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token // vuex
    setToken(token) // 本地
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 删除 token
  REMOVE_TOKEN(state) {
    state.token = ''
    removeToken()
  },
  // 操作 userInfo 这个变量
  SET_USER(state, value) { // value => 请求到的信息对象
    state.userInfo = value
  },
  // 删除用户信息
  REMOVE_USER(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 封装 => 登录逻辑
  async loginActions({ commit }, data) {
    const res = await loginAPI(data)
    commit('SET_TOKEN', res.data)
  },
  // 封装 => 获取用户基本信息
  async getUserInfoActions({ commit }) {
    const { data: userObj } = await getProfileAPI()
    const { data: photoObj } = await getUserInfoAPI(userObj.userId)
    commit('SET_USER', { ...userObj, ...photoObj }) // 用户信息, 交到 mutations 保存到 userInfo 中
    return userObj.roles.menus // 返回的页面权限点的英文字符串数组
  },
  // 封装 => 退出登录逻辑 -> 主动 | 被动
  logoutActions({ commit }) {
    commit('REMOVE_TOKEN')
    commit('REMOVE_USER')
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

