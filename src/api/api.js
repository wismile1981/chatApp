// const configAccount = uni.getAccountInfoSync()

const BASE_URL =  "https://gpt.xuecong.co" // 请求开发域名

const api = {
  baseUrl: BASE_URL,
  // 用户
  user: {
    register: '/yijiayi=2/register/{username}', // 账号登录
  },
  // chat信息
  chat: {
    completions: '/v1/chat/completions' // 开始聊天
  }
}

export default api
