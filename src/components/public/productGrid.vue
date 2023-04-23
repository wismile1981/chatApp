<template>
  <scroll-view
    class="product-grid"
    scroll-y="true"
    @scrolltolower="scrollLower"
  >
    <view class="flex-row flex-wrap justify-between">
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        @click="doClick(item)"
      >
        <show-file
          :src="item.image"
          styleFile="height: 113px;width: 150px;border-radius: 5px;"
        ></show-file>
        <!-- <image class="image" :src="" mode="aspectFill"></image> -->
        <view class="flex-row justify-between">
          <text class="title">{{ item.title }}</text>
          <text class="price">{{ item.price }}</text>
        </view>
        <view class="flex-row justify-between">
          <text class="intro">{{ item.intro }}</text>
          <text class="intro">{{ item.unit }}</text>
        </view>
        <text class="tag" :class="item.tag.color">{{ item.tag.text }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import showFile from "@/components/Dialog/Upload/ShowFile.vue";

export default {
  name: "productGrid",
  components: {
    showFile,
  },
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
.product-grid {
  background: #ffffff;
  border-radius: 8px 8px 0px 0px;
  padding: 0 16px;
  box-sizing: border-box;
  // height: calc(100vh - 90px);

  .item {
    width: 150px;
    /* height: 160px; */
    position: relative;
    padding: 5px 0;

    ::v-deep .image {
    }

    .title {
      font-size: 12px;
      color: #222;
      font-weight: 500;
      line-height: 2;
      max-width: 9em;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;
      white-space: nowrap;
    }

    .price {
      font-size: 12px;
      font-weight: 600;
      color: #ff3e3e;
      line-height: 2;
      // justify-self: flex-end;
    }

    .unit {
      color: #ff3e3e;
      font-size: 9px;
      // justify-self: flex-end;
    }

    .intro {
      font-size: 9px;
      color: #999;
      display: block;
    }
    .tag {
      height: 18px;
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      color: #ffffff;
      border-radius: 9px;
      padding: 0 6px;
      position: absolute;
      right: 8px;
      top: 8px;
      &.blue {
        background: #0037fa;
      }

      &.yellow {
        background: #ffbd3b;
      }

      &.red {
        background: #ff5757;
      }

      &.green {
        background: #28cf89;
      }
    }
  }
}
</style>
