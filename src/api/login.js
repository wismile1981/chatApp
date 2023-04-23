import request from '@/common/request'
import api from '@/api/api'

export function getPicCode (parameter) {
  return request({
    url: api.user.getPicCode,
    method: 'get',
    data: parameter
  })
}

export function login (parameter) {
  return request({
    url: api.user.login,
    method: 'post',
    data: parameter
  })
}

export function mobileLogin (parameter) {
  return request({
    url: api.user.mobileLogin,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: api.user.sendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo (parameter) {
  return request({
    url: api.user.userInfo,
    method: 'get',
    params: parameter
  })
}
export function getIncubatorId (parameter) {
  return request({
    url: api.user.getIncubatorId,
    method: 'get'
  })
}
export function getFunctions (parameter) {
  return request({
    url: api.user.functionsList,
    method: 'get',
    params: parameter
  })
}

export function getCurrentUserNav () {
  return request({
    url: api.user.userMenu,
    method: 'get'
  })
}

export function getImgCaptcha () {
  return request({
    url: api.user.imgCaptcha,
    method: 'get'
  })
}

export function resetPwd (parameter) {
  return request({
    url: api.user.resetPwd,
    method: 'post',
    data: parameter
  })
}
export function resetPassword (parameter) {
  return request({
    url: api.user.resetPassword,
    method: 'post',
    data: parameter
  })
}
export function edituser (parameter) {
  return request({
    url: api.user.editUser,
    method: 'post',
    data: parameter
  })
}
// 信息列表
export function getMessageList (parameter) {
  return request({
    url: api.user.messageList,
    method: 'get',
    params: parameter
  })
}

// 信息标记为已读
export function changeMessageStatus (parameter) {
  return request({
    url: api.user.changeMessageStatus,
    method: 'post',
    data: parameter
  })
}