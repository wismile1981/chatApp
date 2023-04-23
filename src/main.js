import Vue from 'vue'
import App from './App'

import store from './store'

import utils from "./common/utils.js"
// import uniGroup from './components/uni-group/uni-group.vue'
// import uniList from './components/uni-list/uni-list.vue'
// import uniListItem from './components/uni-list-item/uni-list-item.vue'
// import uniSection from './components/uni-section/uni-section.vue'
// import uniDatetimePicker from './components/uni-datetime-picker/uni-datetime-picker.vue'
// import uniDataCheckbox from './components/uni-data-checkbox/uni-data-checkbox.vue'
// import pageHead from './components/page-head/page-head.vue'
// import uniPopup from './components/uni-popup/uni-popup.vue'
// import uniPopupDialog from './components/uni-popup-dialog/uni-popup-dialog.vue'
// import uniPopupMessage from './components/uni-popup-message/uni-popup-message.vue'
// import uniPopupShare from './components/uni-popup-share/uni-popup-share.vue'
// import uniIcons from './components/uni-icons/uni-icons.vue'

	// Vue.component('uni-group',uniGroup)
	// Vue.component('uni-list',uniList)
	// Vue.component('uni-list-item',uniListItem)
	// Vue.component('uni-section',uniSection)
	// Vue.component('uni-datetime-picker',uniDatetimePicker)
	// Vue.component('uni-data-checkbox',uniDataCheckbox)
	// Vue.component('page-head',pageHead)
	// Vue.component('uni-popup',uniPopup)
	// Vue.component('uni-popup-dialog',uniPopupDialog)
	// Vue.component('uni-popup-message',uniPopupMessage)
	// Vue.component('uni-popup-share',uniPopupShare)
// Vue.component('uni-icons',uniIcons)

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$utils = utils

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
