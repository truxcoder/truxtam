import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}
export function getAssetList(params) {
  return request({
    url: '/asset/list',
    method: 'get',
    params
  })
}
export function addAsset(data) {
  return request({
    url: '/asset/add',
    method: 'post',
    data
  })
}
export function updateAsset(data) {
  return request({
    url: '/asset/update',
    method: 'post',
    data
  })
}
export function deleteAsset(data) {
  return request({
    url: '/asset/delete',
    method: 'post',
    data
  })
}
