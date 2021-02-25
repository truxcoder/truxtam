import request from '@/utils/request'

export function getDepartmentList(params) {
  return request({
    url: '/department/departmentlist',
    method: 'get',
    params
  })
}

export function addDepartment(data) {
  return request({
    url: '/department/add',
    method: 'post',
    data
  })
}
export function updateDeptOrder(data) {
  return request({
    url: '/department/order',
    method: 'post',
    data
  })
}
export function updateDepartment(data) {
  return request({
    url: '/department/update',
    method: 'post',
    data
  })
}
export function deleteDepartment(data) {
  return request({
    url: '/department/delete',
    method: 'post',
    data
  })
}
