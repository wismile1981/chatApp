<template>
  <scroll-view
    class="product-list"
    scroll-y="true"
    @scrolltolower="scrollLower"
  >
    <view
      class="list-item flex-row items-center"
      v-for="(item, index) in list"
      :key="index"
      @click="doClick(item)"
    >
      <show-file
        v-if="item.image !== undefined"
        :src="item.image"
        styleFile="width: 80px;height: 60px;border-radius: 5px;margin-right: 12px;"
      ></show-file>
      <!-- <image class="image" :src="item.image" mode="aspectFill"></image> -->
      <view class="flex1">
        <view class="flex-row justify-between items-center">
          <text class="title">{{ item.title }}</text>
          <text class="price"
            >{{ item.price }}<text class="unit">{{ item.unit }}</text></text
          >
        </view>
        <view class="flex-row justify-between items-center">
          <view>
            <text class="intro" v-for="(text, i) in item.intro" :key="i">{{
              text
            }}</text>
          </view>
          <text class="price"
            >{{ item.priceDown
            }}<text class="unit">{{ item.unitDown }}</text></text
          >
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import ShowFile from "@/components/Dialog/Upload/ShowFile.vue";
export default {
  name: "productList",
  components: { ShowFile },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    doClick(item) {
      this.$emit("click:item", item);
    },
    scrollLower() {
      this.$emit("scroll:lower");
    },
  },
};
</script>

<style lang="scss" scoped>
.product-list {
  background: #ffffff;
  border-radius: 8px 8px 0px 0px;
  padding: 0 16px;
  box-sizing: border-box;
  // height: calc(100vh - 90px);

  .list-item {
    padding: 16px 0;

    &:nth-of-type(n + 2) {
      border-top: #f0f0f0 1px solid;
    }

    .image {
      width: 80px;
      height: 60px;
      border-radius: 5px;
      margin-right: 12px;
    }

    .title {
      font-size: 16px;
      color: #222;
      font-weight: 500;
      line-height: 2;
    }

    .price {
      font-size: 16px;
      font-weight: 600;
      color: #ff3e3e;
      justify-self: flex-end;
    }

    .unit {
      color: #ff3e3e;
      font-size: 9px;
      justify-self: flex-end;
    }

    .intro {
      font-size: 9px;
      color: #999;
      display: block;
    }
  }
}
</style>
