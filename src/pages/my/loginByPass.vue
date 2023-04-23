<template>
  <view class="main">
    <view>
      <image src="@/static/img/logo@2x.png"></image>
    </view>
    <view class="welcome">{{ welcome }}</view>
    <view class="login-box">
      <input
        type="text"
        placeholder="请输入用户名"
        required
        v-model.trim="form.username"
      />
      <input
        type="password"
        placeholder="请输入密码"
        required
        v-model.trim="form.password"
      />
    </view>
    <view class="button-box">
      <!-- <view class="contract">点击授权表示您认可《用户协议》及《隐私协议》</view> -->
      <button class="btn blue pill" :loading="runtime.loading" @click="doLogin">
        登录
      </button>
    </view>
  </view>
</template>
<script>
import { login } from "@/api/mpApi.js";
export default {
  data() {
    return {
      welcome: "欢迎使用三城一区科技成果服务平台",
      // appId: "wx1fb3ed09225751fe",
      runtime: {
        loading: false,
      },
      form: { username: "", password: "" },
    };
  },
  methods: {
    doLogin() {
      if (!this.form.username) {
        uni.showToast({
          title: "请输入用户名",
          icon: "error",
        });
        return;
      }
      if (!this.form.password) {
        uni.showToast({
          title: "请输入密码",
          icon: "error",
        });
        return;
      }
      if (this.runtime.loading) {
        return;
      }

      this.runtime.loading = true;
      login(this.form)
        .then((data) => {
          // console.log(data);
          uni.setStorageSync("token", data.token);
          uni.setStorageSync("userInfo", data);
          let redirect = uni.getStorageSync("redirect") || "/pages/home";
          this.$utils.goNavi(redirect);
        })
        .catch((e) => {
          uni.showToast({
            title: "登录失败",
            icon: "error",
          });
          this.runtime.loading = false;
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
  .login-box {
    padding: 30px 16px;
    input {
      height: 60px;
      font-size: 16px;
      text-align: center;
      border-bottom: #f0f0f0 1px solid;
      &::placeholder {
        opacity: 0.3;
        color: #222222;
      }
    }
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
