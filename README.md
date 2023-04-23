# 使用说明
## 项目运行
### HBuilder 方式
    顶部菜单栏 运行 到对应的项目
    会自动打开相对应的开发工具 然后选择dist中相对应的文件
    例子：微信小程序 
      1：运行->运行到小程序模拟器
      2：微信开发工具中新建项目选择dist->dev->mp-weixin
### 指令方式
    参照package.json中的运行指令进行运行
    需要手动打开相对应的开发工具
    例子：微信小程序 
      1：运行指令npm run dev:mp-weixin
      2：微信开发工具中新建项目选择dist->dev->mp-weixin
## 项目发布
### HBuilder 方式
    顶部菜单栏 发行 到对应的项目
    会自动打开相对应的开发工具 然后选择dist中相对应的文件
    例子：微信小程序 
      1：发布->小程序微信
      2：微信开发工具中新建项目选择dist->build->mp-weixin
### 指令方式
    参照package.json中的运行指令进行运行
    需要手动打开相对应的开发工具
    例子：微信小程序 
      1：运行指令npm run build:mp-weixin
      2：微信开发工具中新建项目选择dist->build->mp-weixin
# 封装说明
## 请求封装
### 请求Api封装
  在目录src-api-api.js中进行封装请求api，新增的请求api按照后端接口文档进行模块划分并添加注释。
  其中请求域名根据测试与发布进行区分，代码在api.js顶部。
  const BASE_URL = configAccount.miniProgram.envVersion == 'release' ? "https://api.hongkun.ii-park.com" : "https://api.test.ii-park.com" // 请求开发域名
### 请求函数封装
#### 公共请求函数
  在common的request.js中封装的公共请求函数,包括请求拦截，响应拦截以及唯一请求UUID和用户TOKEN加入请求头。
#### 独立请求函数
  在api文件夹内 按照api.js的请求路径的分组进行创建文件，每一组单独对应一个请求函数文件。
  每一个新的请求都需要进行编写独立的请求函数。
### 请求示例
  #### api.js
    // 获取客户信息
    customer: {
      list: '/space/customer/list' // 客户 - 获取客户列表
    }
  #### customer.js
    // 客户 - 获取客户列表
    export function getCustomerList (parameter) {
      return request({
        url: api.customer.list,
        method: 'get',
        data: parameter
      })
    }
  #### 渲染页面调用
  
  import { getCustomerList } from '@/api/customer'
  
  methods: {
    // 客户 - 获取客户列表
    getList () {
      getCustomerList(params).then(res => {
        console.log(res)
      })
    }
  }
## 字典封装
### 字典文件
  字典封装在VUEX中的modules->dictionary.js
### 新增字典字段
  如果是固定值，则直接在dictionary -> state 内进行配置，
  如果是动态获取值,则state配置完成后需要添加mutations以及actions进行字典更新。
### 使用示例
  #### 配置字典state
    state: {
      demo: ['a']
    }
  #### 配置字典mutations
    SET_DEMO: (state, demo) => {
      state.demo = demo
    }
  #### 配置字典actions
    // 更新示例子字典 从数组a更新为数组b
    setDemo ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_DEMO', ['b']) // 此处可以进行请求变更字典数据
        resolve()
      })
    }
  #### 设置字典
    初始化字典 this.$store.dispatch('setDictionary')
    更新字典某个字典 this.$store.dispatch('setDictionary', ['demo'])
  #### 获取字典
    computed: {
      ...mapState({ demo: state=>state.dictionary.demo }) // 获取字典值方式1
    }
    mounted() {
      this.demo2 = this.$store.state.dictionary.demo // 获取字典值方式2
    }
## 文件上传和显示
  具体参考 src->Dialog->Upload内上传和显示组件的注释说明文档
  网络调用图片和文件请尽量使用显示文件组件，并携带token
## uni官方组件
  具体参考官网使用
  尽量使用官网组件
## 外部引用
  暂时使用自己的文件服务，交付后迁移到我们文件服务上