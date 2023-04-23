import request from '@/common/request'
import api from '@/api/api'
// import qs from 'qs'

const mpLogin = (appId, code) => {
  return request({
    url: api.user.mpLogin,
    method: 'post',
    data: {
      app_id: appId,
      code: code
    }
  })
}

const login = (username) => {
  return request({
    url: api.user.register.replace('{username}', username),
    method: 'get'
  })
}

const completions = (params) => {
  return request({
    url: api.chat.completions,
    method: 'post',
    data: params
  })
}


export {
  api,
  login,
  mpLogin,
  completions
}