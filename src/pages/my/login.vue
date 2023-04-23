<template>
  <view class="main">
    <view>
      <image src="@/static/img/logo@2x.png"></image>
    </view>
    <view class="welcome">{{ welcome }}</view>
    <view class="button-box">
      <view class="contract">点击授权表示您认可《用户协议》及《隐私协议》</view>
      <button
        class="btn blue pill"
        open-type="getUserProfile"
        :loading="runtime.loading"
        @click="doLogin"
      >
        授权登录
      </button>
    </view>
  </view>
</template>
<script>
import { mpLogin } from "@/api/mpApi.js";
export default {
  data() {
    return {
      welcome: "欢迎使用三城一区科技成果服务平台",
      appId: "wx1fb3ed09225751fe",
      runtime: {
        loading: false,
      },
    };
  },
  methods: {
    doLogin() {
      const _this = this;
      uni.getUserProfile({
        desc: "用于完善会员资料",
        success: (res) => {
          uni.login({
            success(code) {
              mpLogin(_this.appId, code.code).then((data) => {
                console.log(data);
              });
            },
          });
          console.log(res);
        },
        fail: (e) => {
          uni.showToast({
            title: "获取信息失败",
            icon: "error",
          });
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding-top: 100px;
  text-align: center;
  image {
    width: 80px;
    height: 80px;
  }
  .welcome {
    font-size: 18px;
    font-weight: 500;
    color: #222222;
    line-height: 25px;
    margin-top: 25px;
  }
  .button-box {
    position: fixed;
    bottom: 64px;
    left: 0;
    width: 100%;
    padding: 16px;
    // background: #fff;
    .contract {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
      margin-bottom: 30px;
    }
  }
}
</style>
