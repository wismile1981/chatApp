export default {
	getDeviceUUID() {
		let deviceId = uni.getStorageSync('uni_deviceId') ||
			uni.getSystemInfoSync().deviceId ||
			uni.getSystemInfoSync().system + '_' + Math.random().toString(36).substr(2);

		uni.setStorageSync('uni_deviceId', deviceId)
		return deviceId;
	},
	// 上拉加载更多-公用方法
	setReachBottom(pagination) {
		return new Promise((resolve, reject) => {
			var isGet = (pagination.current) * pagination.pageSize < pagination.total
			resolve(isGet)
		})
	},

	goNavi(path) {
		uni.navigateTo({
			url: path,
			fail: (e) => {
				console.error(e)
				if (e.errMsg.indexOf('tabbar')) {
					uni.switchTab({
						url: path
					})
				}
			}
		});
	},

	getToken() {
		let token = uni.getStorageSync('token')
		return token
	},

	getUserInfo() {
		return uni.getStorageSync('userInfo')
	},

	getCurrentPath() {
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];

		let arrOption = []
		let path = `/${currentPage.route}`

		if (currentPage.options) {
			for (let option in currentPage.options) {
				arrOption.push([option, currentPage.options[option]].join('='))
			}
		}

		if (arrOption.length) {
			path += '?' + arrOption.join('&')
		}

		return path;
	},

	goLogin() {
		uni.setStorageSync("redirect", this.getCurrentPath());
		this.goNavi("/pages/my/loginByPass");
	},

	fixRichText(content) {
		if (content) {
			return content.replace(
				/\<img/gi,
				'<img style="max-width:100%;height:auto" '
			);
		}
	},

	dail(phone) {
		let regPhone = /^400[0-9]{7}|^1[34578]\d{9}$|^0[0-9]{2,3}-[0-9]{8}/
		if (regPhone.test(phone)) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		} else {
			uni.showToast({
				title: '没有预留电话号码',
				icon: 'none'
			})
		}

	},

	dateFormat(fmt, date) {
		date = new Date(date)
		let ret;
		const opt = {
			"Y+": date.getFullYear().toString(),        // 年
			"m+": (date.getMonth() + 1).toString(),     // 月
			"d+": date.getDate().toString(),            // 日
			"H+": date.getHours().toString(),           // 时
			"M+": date.getMinutes().toString(),         // 分
			"S+": date.getSeconds().toString()          // 秒
			// 有其他格式化字符需求可以继续添加，必须转化成字符串
		};
		for (let k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			};
		};
		return fmt;
	},

}