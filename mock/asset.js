const Mock = require('mockjs')

const makeModel = () =>{
  let str = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  let index1 =Math.floor(Math.random()*26)
  let index2 =Math.floor(Math.random()*26)
  let num = Math.floor(Math.random()*8999)+1000
  let model = str[index1]+str[index2]+num
  return model
}
const data = Mock.mock({
  'items|30': [{
    'code|+1':5159020100,
    'name|1': ['服务器','交换机','显示器','球机','枪机','硬盘录像机','PC','打印机','一体机','投影仪'],
    'mfrs|1': ['联想', '华为', '海康','惠普','三星','戴尔','松下','索尼'],
    buy_time: '@date',
    use_time: '@date',
    'status|1': ['正常', '损坏', '维修','废弃','丢失'],
    'department|1': ['办公室', '政治处', '财务科','管理科','生产科'],
    'position':'@city',
    'model':makeModel,
    author: '@cname'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/asset/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
