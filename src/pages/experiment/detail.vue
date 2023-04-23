<template>
  <view class="main">
    <share-btn />
    <swiper class="swiper">
      <swiper-item v-for="(item, index) in detail.images" :key="index">
        <image
          :src="runtime.downUrl + item.object_name"
          mode="aspectFill"
        ></image>
      </swiper-item>
    </swiper>
    <view class="uni-container">
      <view class="flex-row items-center">
        <view class="title">{{ detail.name }}</view>
      </view>
      <view class="text" v-for="(text, index) in detail.intro" :key="index">{{
        text
      }}</view>
      <view class="title">详细说明</view>
      <view>
        <rich-text :nodes="detail.description"></rich-text>
      </view>
    </view>
    <view class="button-box flex-row">
      <!-- 以下代码判断店铺按钮展示 -->
      <!-- <view
        style="margin-right: 20rpx"
        v-if="detail.has_shop_page && detail.shop.status === 'ONLINE'"
      > -->
      <view
        :style="
          detail.reservation_rule_status === 'DISABLE' &&
          !detail.principal_user_phone
            ? 'width:100%'
            : 'margin-right: 20rpx'
        "
        v-if="detail.has_shop_page"
      >
        <button
          class="btn red pill"
          @click="$utils.goNavi('shop?id=' + detail.shop_id)"
        >
          进入店铺
        </button>
      </view>
      <view class="flex1" v-if="detail.reservation_rule_status === 'ENABLE'">
        <button class="btn blue pill" @click="doReserve">
          在线预约
          <text v-if="detail.rule && detail.rule.price"
            >（{{ detail.rule.price }}元起）</text
          >
        </button>
      </view>
      <view
        class="flex1"
        v-if="
          detail.reservation_rule_status === 'DISABLE' &&
          detail.principal_user_phone
        "
      >
        <button
          class="btn blue pill"
          @click="$utils.dail(detail.principal_user_phone)"
        >
          联系客服
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import shareBtn from "@/components/public/shareBtn.vue";
import {
  api,
  getIndustrialLabDetail,
  getIndustrialInstrumentDetail,
  getIndustrialReservationRules,
} from "@/api/mpApi.js";

export default {
  components: { shareBtn },
  onLoad(option) {
    this.runtime.downUrl = api.base.urlDownFile;
    this.runtime.id = option.id;
    this.runtime.type = option.type;
  },
  onShow() {
    this.getDetail();
  },
  onShareAppMessage() {
    return {
      title: this.detail.name,
      imageUrl: this.runtime.downUrl + this.detail.images[0].object_name,
    };
  },
  data() {
    return {
      detail: {},
      runtime: {
        downUrl: "",
        id: null,
        type: "",
      },
    };
  },
  methods: {
    getDetail() {
      this.getData(this.runtime.type).then((data) => {
        uni.setNavigationBarTitle({
          title: data.name,
        });
        data.rule = {};
        this.detail = data;
        if (data.reservation_rule_status === "ENABLE") {
          getIndustrialReservationRules(data.reservation_rule_id).then(
            (rule) => {
              this.detail.rule = rule;
            }
          );
        }
      });
    },
    getData(type) {
      return new Promise((resolve) => {
        if (type === "instrument") {
          getIndustrialInstrumentDetail(this.runtime.id).then((data) => {
            data.name = data.instrument_name;
            data.intro = [
              `${data.production_place} ${data.brand} ${data.model} ${data.production_date}`,
              data.address,
            ];
            resolve(data);
          });
        } else if (type === "lab") {
          getIndustrialLabDetail(this.runtime.id).then((data) => {
            data.name = data.lab_name;
            data.intro = [
              `${data.principal_user_name} ${data.principal_user_phone}`,
              data.address,
            ];
            resolve(data);
          });
        }
      });
    },
    doReserve() {
      uni.setStorageSync("reserveObject", this.detail);
      this.$utils.goNavi("booking?type=" + this.runtime.type);
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 80px;

  .swiper {
    height: 280px;
    // background: #000;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #222222;
    padding: 12px 0;
  }
  .text {
    font-size: 14px;
    line-height: 20px;
    color: #999;
    // padding-bottom: 12px;
  }
  .special {
    display: block;
    font-size: 12px;
    line-height: 2;
    padding: 0 8px;
    border: #1649ff 1px solid;
    border-radius: 4px;
    color: #1649ff;
    margin-left: 1.5em;
  }
  .button-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    background: #fff;
  }
  ::v-deep .share-btn {
    top: 300px;
  }
}
</style>
