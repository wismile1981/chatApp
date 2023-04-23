import storage from 'store'
import { login, mobileLogin, getFunctions, getIncubatorId, getUserInfo } from '@/api/login'
import api from '@/api/api'

const user = {
  state: {
    token: '',
    user_id: '',
    info: {},
    auth: [],
    authMenu: []
  },
  mutations: {
    SET_AUTH: (state, auth) => {
      state.auth = auth
    },
    SET_MENUAUTH: (state, authMenu) => {
      state.authMenu = authMenu
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_ID: (state, userId) => {
      state.user_id = userId
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },
  actions: {
    // 短信登陆
    mobileLogin ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        mobileLogin(userInfo).then(data => {
          user.actions.saveUserInfo({ commit }, data)
          resolve()
        }).catch(error => {
          reject()
        })
      })
    },
    // 密码登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(data => {
          user.actions.saveUserInfo({ commit }, data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /* 获取权限 */
    getAuth ({ commit }) {
      return new Promise((resolve, reject) => {
        const info = storage.get(SET_INFO)
        getFunctions({ user_id: info.user_id, business_code: '019000' }).then(response => {
          const atuhBtn = response.data.filter(item => item.func_type === 2)
          commit('USER_AUTHBTN', atuhBtn)
          resolve()
        })
      })
    },
    // 获取用户信息
    GetInfo ({ commit }, getInfo) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          resolve(res)
        })
      })
    },
    // 保存用户信息
    saveUserInfo ({ commit }, objUserInfo) {
      // 使用VUEX记录登录状态相关信息
      commit('SET_TOKEN', objUserInfo.token, 7 * 24 * 60 * 60 * 1000)
      commit('SET_USER_ID', objUserInfo.user_id)
      commit('SET_INFO', objUserInfo)
      // 使用缓存记录相关信息
      uni.setStorageSync('ACCESS_TOKEN', objUserInfo.token)
      uni.setStorageSync('USER_ID', objUserInfo.user_id)
      uni.setStorageSync('USER_INFO', objUserInfo)
    },
    // 登出
    Logout ({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_USER_ID', '')
      commit('SET_AUTH', [])
      uni.removeStorageSync('ACCESS_TOKEN')
      uni.removeStorageSync('USER_ID')
      uni.removeStorageSync('USER_INFO')
    }
  }
}

export default user
