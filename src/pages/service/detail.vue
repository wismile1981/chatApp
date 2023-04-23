<template>
  <view class="main">
    <view class="uni-container top">
      <view class="title">{{ product.service_name }}</view>
      <view class="intro">{{ product.shop.shop_name }}</view>
      <view class="title detail">详细说明</view>
    </view>
    <view class="html">
      <rich-text :nodes="$utils.fixRichText(product.description)"></rich-text>
    </view>
    <view class="button-box" v-if="product.specs.length">
      <button
        class="btn blue pill"
        :loading="runtime.loading"
        @click="placeOrder"
      >
        立即购买<text v-if="product.min_price"
          >（¥{{ product.min_price }} 起）</text
        >
      </button>
    </view>
  </view>
</template>
<script>
import { getCommodityProductDetail } from "@/api/mpApi.js";
export default {
  data() {
    return {
      runtime: {
        loading: false,
      },
      product_id: null,
      product: {},
    };
  },
  onLoad(option) {
    this.product_id = option.id;
    this.getDetail();
  },
  onShow() {
    this.runtime.loading = false;
  },
  methods: {
    getDetail() {
      getCommodityProductDetail(this.product_id).then((data) => {
        data.name = data.service_name;
        this.product = data;
      });
    },
    placeOrder() {
      if (!this.$utils.getToken()) {
        uni.showToast({
          title: "您还没有登录",
          icon: "error",
          success: () => {
            setTimeout(() => {
              this.$utils.goLogin();
            }, 1000);
          },
        });
        return;
      }
      if (!this.runtime.loading) {
        this.runtime.loading = true;
        uni.setStorageSync("product", this.product);
        // uni.hideLoading();
        this.$utils.goNavi(
          `/pages/my/placeOrder?type=serv&id=${this.product_id}`
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding-bottom: 76px;
  background: #fff;
  min-height: 100vh;
}
.uni-container {
  padding: 0 16px;
}
.top {
  .title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    margin-bottom: 6px;

    &.detail {
      margin-top: 20px;
    }
  }
  .intro {
    margin: 2px 0;
    font-size: 12px;
    line-height: 17px;
    color: #777;
  }
}

.html {
  margin-top: 12px;
  background: #fff;
  border-radius: 8px 8px 0px 0px;
  padding: 16px;
  rich-text {
    font-size: 14px;
    color: #222;
    display: block;
  }
}
.button-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  background: #fff;
}
</style>