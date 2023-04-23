<template>
  <view class="main">
    <view
      class="user-info flex-row justify-between items-center"
      @click="$utils.goNavi('info')"
    >
      <image
        :src="userInfo.avatar_url || config.defaultAvatar"
        mode="aspectFill"
      ></image>
      <view class="flex1">
        <view class="nickname">{{
          userInfo.nickname || config.defaultNickname
        }}</view>
        <view class="company">{{ company.name }}</view>
      </view>
      <uni-icons type="right" size="14" color="#cecece"></uni-icons>
    </view>
    <view class="uni-container">
      <view class="menu">
        <view
          class="item flex-row justify-between items-center"
          @click="$utils.goNavi('company')"
        >
          <image
            src="@/static/img/icon_me_qieyefuwu@2x.png"
            mode="aspectFit"
          ></image>
          <text class="flex1">我的企业</text>
          <uni-icons type="right" size="14" color="#cecece"></uni-icons>
        </view>
      </view>
      <view class="menu">
        <view
          class="item flex-row justify-between items-center"
          @click="showOrder"
        >
          <image
            src="@/static/img/icon_me_qiuzu@2x.png"
            mode="aspectFit"
          ></image>
          <text class="flex1">我的看房预约</text>
          <uni-icons type="right" size="14" color="#cecece"></uni-icons>
        </view>
        <view
          class="item flex-row justify-between items-center"
          @click="$utils.goNavi('pushPolicys')"
        >
          <image
            src="@/static/img/icon_me_tuisong@2x.png"
            mode="aspectFit"
          ></image>
          <text class="flex1">政策推送</text>
          <uni-icons type="right" size="14" color="#cecece"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getMyEnterprise } from "@/api/mpApi.js";
export default {
  data() {
    return {
      userInfo: {},
      company: {},
      config: {
        defaultNickname: "用户",
        defaultAvatar: "",
      },
    };
  },
  onShow() {
    if (!this.$utils.getToken()) {
      this.$utils.goLogin();
    } else {
      this.userInfo = this.$utils.getUserInfo();
      // this.getMyCompany();
    }
  },
  methods: {
    getMyCompany() {
      getMyEnterprise().then((data) => {
        if (data.name) {
          this.company = data;
          uni.setStorageSync("company", data);
        }
      });
    },
    showOrder() {
      uni.setStorageSync("activeTab", 0);
      this.$utils.goNavi("order");
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  background: url(@/static/img/bg_me.png) center -60px no-repeat;
  background-size: 100% auto;
  .user-info {
    padding: 30px 16px;
    image {
      width: 60px;
      height: 60px;
      border: 2px solid #ffffff;
      border-radius: 60px;
      margin-right: 10px;
    }
    .nickname {
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
      line-height: 28px;
    }
    .company {
      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      line-height: 28px;
    }
  }
  .menu {
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 0 16px;
    .item {
      height: 54px;

      &:nth-of-type(n + 2) {
        border-top: #f0f0f0 1px solid;
      }
      image {
        width: 18px;
        height: 18px;
        margin-right: 12px;
      }
      text {
        font-size: 16px;
        font-weight: 500;
        color: #222;
      }
    }
  }
}
</style>
