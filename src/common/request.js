import api from '@/api/api'
import utils from '@/common/utils.js'
/** 
 * 默认配置
 **/
const config = {
  baseURL: api.baseUrl,
  header: {
    'content-type': 'application/json'
  },
  dataType: 'json',
  responseType: 'text'
}
/** 
 * 请求函数
 **/
function request(options = {}) {
  options.baseURL = options.baseURL || config.baseURL
  options.dataType = options.dataType || config.dataType
  options.url = options.baseURL + options.url
  options.data = options.data
  options.header = { ...options.header, ...config.header }
  options.method = options.method || config.method
  options = requestBefore(options)

  return new Promise((resolve, reject) => {
    options.success = function (res) {
      resolve(res.data) 
    }
    options.fail = function (err) {
      reject(err)
    }
    // console.log(options)
    uni.request(options)
  })
}
/** 
 * 请求拦截器
 * 添加自定义请求参数
 * 
 * @param {options} 默认请求参数
 * @return {options} 变更后的请求参数
 **/
function requestBefore(options) {
  if (uni.getStorageSync('token')!='') {
    options.header['Authorization'] = uni.getStorageSync('token').trim();
  }
  return options
}
/** 
 * 响应拦截器
 * 处理请求返回结果
 * 
 * @param {response} 请求返回结果
 * @return {options} 同步返回处理结果
 **/
function requestAfter(response) {
  if (response.statusCode !== 200) {
    const data = response.data
    // 从 localstorage 获取 token
    const token = uni.getStorageSync('token')
    if (response.statusCode === 403 || response.statusCode === 422 || response.statusCode === 405 || response.statusCode === 500 || response.statusCode === 503) {
      uni.showToast({
        title: data.message || '系统内部错误,请联系维护人员',
        icon: 'none',
        duration: 2000
      })
    } else if (response.statusCode === 400) {
      uni.showToast({
        title: typeof data.message === 'string' ? data.message : '系统内部错误,请联系维护人员',
        icon: 'none',
        duration: 2000
      })
    } else if ((data.result && data.result.isLogin)) {
      if (!token) {
        uni.showToast({
          title: "请登陆",
          icon: 'none',
          duration: 2000
        })
      }
    } else if (response.statusCode === 401) {
      uni.showToast({
        title: data.message || '尚未登录或登录已过期，请重新登录',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => { utils.goLogin() }, 1500)
    } else {
      uni.showToast({
        title: data.message || '系统内部错误,请联系维护人员',
        icon: 'none',
        duration: 2000
      })
    }
    return false
  }
  return response.data.data || response.data
}
// 通过localStorage获取 UUID
function getUUID() {
  if (uni.getStorageSync('ii-park-uuid')) {
    return uni.getStorageSync('ii-park-uuid')
  } else {
    const uuid = generateUUID()
    uni.setStorageSync('ii-park-uuid', uuid)
    return uuid
  }
}
// 创建UUID
function generateUUID() {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
export default request
