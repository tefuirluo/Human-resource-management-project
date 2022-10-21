import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // 后台返回相应成功的状态码 200, 故应该使用 success 字段对登录成功与失败进行区分
    // 通过观察 response 参数, 内部包含 config | header | status | data 字段
    // data 字段里对应的是后台返回的全部的数据 => 也是一个对象
    // 第一个 data 是axios 对象自带的
    const { success, message } = response.data
    if (success) {
      Message.success(message)
      return response.data
    } else {
      // 逻辑失败 => 把后台返回 message 提示文字返回到逻辑页面
      // 返回 Promise 的 reject 拒绝状态
      Message.error(message)
      return Promise.reject(message)
    }
  },
  error => {
    Message.error((error.message && error.message.data && error.message.data.message) || error.message)
    return Promise.reject(error)
  }
)

export default service
