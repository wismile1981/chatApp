<template>
  <view class="uni-container">
    <view class="title">服务详情</view>
    <view class="object">
      <view class="name">{{ object.name }}</view>
      <view
        class="spec"
        v-for="(item, index) in object.specs"
        :key="index"
        @click="clickSpec(index)"
        :class="{ active: index === activeIndex }"
        >{{ item.spec_name }}
      </view>
    </view>
    <view class="count flex-row justify-end items-center">
      <text>¥{{ object.specs[activeIndex].price || 0 }}</text>
      <uni-icons
        class="times"
        type="closeempty"
        size="12"
        color="#666"
      ></uni-icons>
      <uni-icons
        type="minus"
        size="20"
        color="#666"
        @click="addTotal(-1)"
      ></uni-icons>
      <input type="number" v-model="total" @blur="inputChange" />
      <uni-icons
        type="plus"
        size="20"
        color="#666"
        @click="addTotal(1)"
      ></uni-icons>
    </view>
    <view class="intro"
      >最大购买数量：{{ object.specs[activeIndex].quantity_limit }}</view
    >
    <view class="flex-row justify-between items-center">
      <view class="title">订单总额</view>
      <view class="price"
        >¥{{ object.specs[activeIndex].price || 0 * total }}</view
      >
    </view>

    <view class="button-box">
      <button class="btn blue pill" @click="doSubmit" :loading="loading">
        立即下单
      </button>
    </view>
  </view>
</template>
<script>
import { addIndustrialServiceOrder, addCommodityOrder } from "@/api/mpApi.js";
export default {
  onLoad(option) {
    this.type = option.type;
    this.id = option.id;
    this.object = uni.getStorageSync("product");
  },
  onShow() {
    if (this.type === "tech") {
      uni.setNavigationBarTitle({
        title: "技术服务",
      });
    } else if (this.type === "serv") {
      uni.setNavigationBarTitle({
        title: "企业服务",
      });
    }
  },
  data() {
    return {
      object: {},
      total: 1,
      loading: false,
      activeIndex: 0,
      type: "",
      id: null,
    };
  },
  methods: {
    doSubmit() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      let data = {
        spec_id: this.object.specs[this.activeIndex].id,
        resource_name: this.object.name,
        count: this.total,
        user_id: this.$utils.getUserInfo().user_id,
        user_name: this.$utils.getUserInfo().name,
        phone: this.$utils.getUserInfo().phone,
      };
      if (this.type === "tech") {
        addIndustrialServiceOrder(data).then((res) => {
          uni.showToast({
            title: "订单提交成功",
            icon: "success",
          });
          setTimeout(() => {
            this.loading = false;
            uni.navigateBack();
          }, 1000);
        });
      } else if (this.type === "serv") {
        addCommodityOrder(data).then((res) => {
          uni.showToast({
            title: "订单提交成功",
            icon: "success",
          });
          setTimeout(() => {
            this.loading = false;
            uni.navigateBack();
          }, 1000);
        });
      }
    },
    addTotal(count) {
      console.log(count);
      if (
        this.total + count >
          this.object.specs[this.activeIndex].quantity_limit ||
        this.total + count < 1
      ) {
        return;
      } else {
        this.total += count;
      }
    },
    inputChange() {
      if (isNaN(this.total) || this.total < 1) {
        this.total = 1;
      }
      if (this.total > this.object.specs[this.activeIndex].quantity_limit) {
        this.total = this.object.specs[this.activeIndex].quantity_limit;
      }
    },
    clickSpec(index) {
      if (this.activeIndex === index) {
        return;
      }
      // let specs = this.object.specs;
      // specs[this.activeIndex].active = false;
      // specs[index].active = true;
      this.activeIndex = index;
      this.inputChange();
    },
  },
};
</script>
<style lang="scss" scoped>
.uni-container {
  min-height: 100vh;
  padding-bottom: 76px;
  background: #fff;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #222222;
    line-height: 22px;
    padding: 12px 0;
  }
  .name {
    font-size: 16px;
    line-height: 22px;
    margin-bottom: 10px;
  }
  .count {
    padding: 8px 0;
    font-weight: 600;
    font-size: 16px;
    .times {
      margin: 0 12px;
    }
    uni-icons {
      padding: 5px;
    }
    input {
      width: 50px;
      height: 36px;
      background: #f6f7f8;
      border-radius: 8px;
      text-align: center;
      font-weight: 400;
    }
  }
  .spec {
    background: #f6f7f8;
    border-radius: 8px;
    font-size: 14px;
    color: #b5b5b5;
    line-height: 20px;
    border: 1px solid #b5b5b5;
    margin: 9px 0;
    padding: 16px;

    &.active {
      border: 1px solid #1649ff;
    }
  }
  .price {
    font-size: 20px;
    font-weight: 600;
    color: #ff3e3e;
    line-height: 28px;
  }
  .intro {
    font-size: 9px;
    text-align: right;
    color: #999;
  }
  .button-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    background: #fff;
  }
}
</style>
