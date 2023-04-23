import request from '@/common/request'
import api from '@/api/api'

// 客户 - 获取客户列表
export function getCustomerList (parameter) {
  return request({
    url: api.customer.list,
    method: 'get',
    data: parameter
  })
}

// 空间 - 获取工位列表
export function getParkList (parameter) {
  return request({
    url: api.space.stationList,
    method: 'get',
    data: parameter
  })
}

// 空间 - 运维获取楼栋列表
export function getBuildingList (parameter) {
  return request({
    url: api.space.buildingList,
    method: 'get',
    data: parameter
  })
}

// 空间 - 运维获取楼层列表
export function getFloorList (parameter) {
  return request({
    url: api.space.floorList,
    method: 'get',
    data: parameter
  })
}

