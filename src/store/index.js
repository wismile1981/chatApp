import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import dictionary from './modules/dictionary'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    dictionary
  },
	state: {
	},
	mutations: {
	}
})

export default store
