import request from '@/utils/request'

/**
 * 获取员工 - 列表
 * @param params {page: 页码, size: 每页条数}
 * @returns {*} Promise 对象
 */
export function getEmployeesListAPI(params) {
  return request({
    url: '/sys/user',
    method: 'GET',
    params
  })
}

/**
 * 新增员工
 * @param data 员工的信息对象(7对 key + value)
 * @returns {*}
 */
export function addEmployeesAPI(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 批量导入员工
 * @description: 导入excel
 * @param {*} data [{}, {}, {}, ...]
 * @return {*}
 */
export function importEmployeesAPI(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 根据员工 id, 更新员工基本信息
 * @param empObj 员工数据对象
 * @returns {*} Promise对象
 */
export function updateEmployeesAPI(empObj) {
  return request({
    url: `/sys/user/${empObj.id}`,
    method: 'PUT',
    data: empObj
  })
}

/**
 * 给员工 -> 分配保存角色
 * @param data {id: 员工 ID, roleIds: 角色ID字符串组成数组}
 * @returns {*} Promise 对象
 */
export function saveEmployeesRoleAPI(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'PUT',
    data
  })
}
