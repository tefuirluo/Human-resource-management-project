import request from '@/utils/request'

/**
 * 登录接口
 * @param mobile  手机号
 * @param password  密码
 * @returns {*} Promise 对象
 */
export function loginAPI({ mobile, password }) {
  return request({
    url: '/sys/login',
    method: 'POST',
    // headers: {} => axios 默认会携带请求头 Content-Type:'application/json'
    // Content-Type: 'application/json' -> 请求体里有参数名和值, 会变成 JSON 字符串格式给后台
    data: {
      mobile,
      password
    }
  })
}

/**
 * 获取用户资料
 * @returns {*} Promise 对象
 */
export function getUserProfileAPI() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取用户的基本信息
 * @returns {*} Promise 对象
 */
export function getProfileAPI() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
