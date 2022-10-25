import request from '@/utils/request'

/**
 * 请求 -> 所有角色列表
 * @param params { page, page-size }
 * @returns {*} Promise 对象
 */
export function getRoleListAPI(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}

/**
 * 根据公司 id => 获取公司详细信息
 * @param companyId  公司 id
 * @returns {*} Promise 对象
 */
export function getCompanyInfoAPI(companyId) {
  return request({
    url: `/company/${companyId}`,
    method: 'GET'
  })
}

/**
 * 添加角色
 * @returns {*} Promise 对象
 */
export function addRoleAPI(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 根据 角色 ID -> 获取角色详情
 * @param roleId 角色 id 值
 * @returns {*} Promise 对象
 */
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'GET'
  })
}

/**
 * 根据角色 id 更新角色
 * @param roleObj 角色对象
 * @returns {*} Promise 对象
 */
export function updateRoleAPI(roleObj) {
  return request({
    url: `/sys/role/${roleObj.id}`,
    method: 'PUT',
    data: roleObj
  })
}

/**
 * 根据角色 id 删除角色对象
 * @param roleId  角色 id
 * @returns {*} Promise 对象
 */
export function delRoleAPI(roleId) {
  return request({
    url: `/sys/role/${roleId}`,
    method: 'DELETE'
  })
}

/**
 * 给角色分配权限
 * @param {*} data {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPermAPI(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
