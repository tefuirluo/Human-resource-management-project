import request from '@/utils/request'

/**
 * 获取部门列表方法
 * @returns {*} Promise 对象
 */
export function getDepartmentsListAPI() {
  return request({
    url: '/company/department'
  })
}

/**
 * 获取-部门负责人列表
 * @returns {*} Promise 对象
 */
export function getEmployeesSimpleListAPI() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 添加部门
 * @param data 5对 key + value 对象
 * @returns {*} Promise 对象
 */
export function addDepartmentsAPI(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

/**
 * 修改-部门详情
 * @param departId  部门 Id
 * @returns {*} Promise 对象
 */
export function getDepartDetailAPI(departId) {
  return request({
    url: `/company/department/${departId}`
  })
}

/**
 * 根据 id 更新部门详情
 * @returns {*} Promise 对象
 * @param data
 */
export function updateDepartmentsAPI(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 组织架构 - 删除部门
 * @description: 删除部门 - 注意: 有子部门不能删除
 * @param {*} id 当前点击的操作按钮 所在的项的id(部门id)
 * @return {*}
 */
export function delDepartmentAPI(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
