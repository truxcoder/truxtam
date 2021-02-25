import request from '@/utils/request'

export function getModuleList(params) {
  return request({
    url: '/module/list',
    method: 'get',
    params
  })
}

export function addModule(data) {
  return request({
    url: '/module/add',
    method: 'post',
    data
  })
}
export function updateModule(data) {
  return request({
    url: '/module/update',
    method: 'post',
    data
  })
}
export function deleteModule(data) {
  return request({
    url: '/module/delete',
    method: 'post',
    data
  })
}