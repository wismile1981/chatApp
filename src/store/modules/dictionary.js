import storage from 'store'

const dictionary = {
  state: {
    demo: ['a']
  },
  mutations: {
    SET_DEMO: (state, demo) => {
      state.demo = demo
    }
  },
  actions: {
    /** 
     * 设置字典更新
     * 
     * @param {commit} vuex参数
     * @return Array {listDictionaryName} 需要更新的字典名称数组 如果为空 则更新全部列表
     **/
    setDictionary ({ commit }, listDictionaryName) {
      listDictionaryName = listDictionaryName ? listDictionaryName : Object.keys(dictionary.state)
      for (const name of listDictionaryName) {
        // 将state中的字段名称 转换为 需要调用的函数名称 例子: demo -> getDemo
        name = name.replace(name[0], `set${name[0].toUpperCase()}`)
        // 调用转换后的函数 例子: 调用dictionary.actions.getDemo函数 更新state的demo值
        dictionary.actions[name] ? dictionary.actions[name]({ commit }) : null
      }
    },
    // 更新示例子字典 从数组a更新为数组b
    setDemo ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_DEMO', ['b']) // 此处可以进行请求变更字典数据
        resolve()
      })
    }
  }
}

export default dictionary
