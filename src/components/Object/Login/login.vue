<template>
  <uni-popup ref="login" background-color="#fff">
    <view class="login-type">
      <view v-for="(item,index) in listLoginType" :key="index" @click="iloginType = index; clearForm()" :class="{act: iloginType === index}"
       class="login-type-btn">{{item}}</view>
    </view>
    <uni-forms ref="form" validateTrigger="bind" :rules="iloginType === 0 ? objMobileRules : ObjUserRules" :modelValue="param" class="login-form" style="background-color: #fff">
      <view style="width: 80vw; background-color: #fff; padding: 20rpx;">
        <uni-forms-item :label="iloginType === 1 ? '账户' : '手机号'" labelWidth="85" :required='true' name="strUserName">
          <uni-easyinput v-model="param.strUserName" :placeholder="iloginType === 1 ? '账户' : '手机号'" />
        </uni-forms-item>
        <uni-forms-item label="密码" labelWidth="85"  :required='true' v-show='iloginType === 1' name="strPassword">
          <uni-easyinput type="password" v-model="param.strPassword" placeholder="密码" />
        </uni-forms-item>
        <uni-forms-item label="图形验证码" labelWidth="85" :required='true' v-show='iloginType === 0' name="strCheck">
          <uni-easyinput v-model="param.strCheck" placeholder="图形验证码" />
          <img :src="objPicCode.image" alt="" class="img" @click="getPicCode">
        </uni-forms-item>
        <uni-forms-item label="验证码" labelWidth="85" :required='true' v-show='iloginType === 0' name="strCaptcha">
          <uni-easyinput v-model="param.strCaptcha" placeholder="验证码" />
          <button class="uni-btn-captcha" tabindex="-1" @click="getCaptcha" v-if="iTimerNum < 0">
            获取验证码
          </button>
          <button class="uni-btn-captcha" tabindex="-1" v-if="iTimerNum > 0">
            倒计时{{ iTimerNum }}s
          </button>
          <button class="uni-btn-captcha" tabindex="-1" @click="getCaptcha" v-if="iTimerNum == 0">
            重新发送
          </button>
        </uni-forms-item>
        <view class="uni-button-group pointer">
          <button class="uni-button uni-button-full" type="primary" @click="submitForm">确定</button>
        </view>
      </view>
    </uni-forms>
  </uni-popup>
</template>

<script>
import { getSmsCaptcha, getPicCode, getMessageList } from '@/api/login'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      iloginType: 1, // 0 免密登录 1 密码登录
      listLoginType: ['免密登录', '密码登录'],
      objPicCode: {
        code: '',
        image: ''
      },
      param: {
        strCaptcha: '',
        strCheck: '',
        strPassword: '',
        strUserName: ''
      },
      iTimerNum: -1, // 按钮倒计时
      objMobileRules: {
        strUserName: {
          rules: [{
            required: true,
            errorMessage: '请输入用户手机或账号'
          }]
        },
        strCheck: {
          rules: [{
            required: true,
            errorMessage: '请输入图形验证码'
          }]
        },
        strCaptcha: {
          rules: [{
            required: true,
            errorMessage: '请输入验证码'
          }]
        }
      },
      ObjUserRules: {
        strUserName: {
          rules: [{
            required: true,
            errorMessage: '请输入用户手机或账号'
          }]
        },
        strPassword: {
          rules: [{
            required: true,
            errorMessage: '请输入用户密码'
          }, {
              minLength: 6,
              maxLength: 24,
              errorMessage: '密码长度在 6 到 24 个字符',
          }]
        }
      }
    }
  },
  mounted () {
    
  },
  created () {
  },
  methods: {
    ...mapActions(['Login', 'mobileLogin', 'GetInfo']),
    // 显示登录窗口
    showLogin () {
      this.$refs.login.open('center')
      this.getPicCode()
    },
    // 关闭登录窗口
    closeLogin () {
      this.$refs.login.close()
    },
    // 更新图形验证码
    getPicCode () {
      getPicCode().then(res => {
        this.objPicCode.image = res.image
        this.objPicCode.code = res.captcha_key
      })
    },
    // 获取短信验证码
    getCaptcha () {
      this.$refs.form.validateField(['strUserName', 'strCheck']).then(res => {
        this.iTimerNum = 60
        const times = setInterval(() => {
          if (this.iTimerNum-- === 0) clearInterval(times)
        }, 1000)
        const param = {
          phone: res.strUserName,
          image_captcha_key: this.objPicCode.code,
          image_captcha_value: res.strCheck
        }
        getSmsCaptcha(param).then(res => {
          if (res.data) {
            uni.showToast({
              title: '验证码已发送',
              icon: 'none',
              duration: 2000
            })
          }
        })
      })
    },
    // 提交登录
    submitForm () {
      this.$refs.form.validate().then((res)=>{
        let functionLogin = null
        const param = {}
        if (this.iloginType === 1) { // 账号密码登陆
          param.username = res.strUserName
          param.password = res.strPassword
          functionLogin = (param) => this.Login(param)
        } else { // 账号短信登陆
          param.a = res.strUserName
          param.captcha = res.strCaptcha
          functionLogin = (param) => this.mobileLogin(param)
        }
        functionLogin(param).then((res) => {
          this.clearForm()
          this.closeLogin()
        }).catch(error => {})
      })
    },
    clearForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
	.login-type {
    padding: 12upx;
    background-color: #FFF;
		display: flex;
		justify-content: center;
	}
	.login-type-btn {
		line-height: 30px;
		margin: 0px 15px;
	}
	.login-type-btn.act {
		color: #0FAEFF;
		border-bottom: solid 1px #0FAEFF;
	}
  .uni-input-border,
  .uni-textarea-border {
  	width: 100%;
  	font-size: 14px;
  	color: #666;
  	border: 1px #e5e5e5 solid;
  	border-radius: 5px;
  	box-sizing: border-box;
  }
  .uni-input-border {
  	padding: 0 10px;
  	height: 35px;
  }
  .img{
    position:absolute;
    top: 0;
    right: -1upx;
    height: 70upx;
    width: 200upx;
    z-index: 2;
  }
  .icon{
    position:absolute;
    top: 15upx;
    right: 5upx;
    height: 20upx;
    width: 80upx;
    z-index: 2;
  }
  .uni-btn-captcha{
    position:absolute;
    top: 0;
    right: -1upx;
    height: 70upx;
    width: 200upx;
    z-index: 2;
    font-size: 28upx;
    color: #666666;
  }
</style>
