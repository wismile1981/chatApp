<template>
  <scroll-view
    class="policy-list"
    scroll-y="true"
    @scrolltolower="scroll2Lower"
  >
    <view
      class="list-item"
      v-for="(item, index) in list"
      :key="index"
      :class="[chooseBgType(item.support_way)]"
      @click="doClick(item)"
    >
      <text class="title">{{ removeTag(item.title) }}</text>
      <view class="flex-row justify-between">
        <text class="intro .issuer">{{ item.issuer }}</text>
        <text class="intro">{{ item.pub_date.substring(0, 10) }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  name: "policyList",
  components: {},
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      filters: [/<[^>]+>/g, /([.\n\r]+)/g],
    };
  },
  methods: {
    removeTag(strOrigin) {
      for (let i = 0; i < this.filters.length; i++) {
        strOrigin = strOrigin.replace(this.filters[i], "");
      }
      return strOrigin;
    },
    doClick(item) {
      this.$emit("click:item", item);
    },
    scroll2Lower() {
      this.$emit("scroll:lower");
    },
    chooseBgType(supportWay) {
      let bgType = "";
      if (!supportWay) {
        supportWay = "";
      }
      supportWay = supportWay.split(",")[0];
      switch (supportWay) {
        case "补贴":
          bgType = "bt";
          break;
        case "荣誉":
          bgType = "ry";
          break;
        case "奖励":
          bgType = "jl";
          break;
        case "减免":
          bgType = "jm";
          break;
        case "免征":
          bgType = "mz";
          break;
        case "退税":
          bgType = "ts";
          break;
        default:
          bgType = "qt";
      }
      return bgType;
    },
  },
};
</script>

<style lang="scss" scoped>
.policy-list {
  background: #ffffff;
  border-radius: 8px 8px 0px 0px;
  padding: 0 16px;
  box-sizing: border-box;
  // height: calc(100vh - 90px);

  .list-item {
    padding: 10px 0 10px 44px;
    background-size: 32px 32px;
    background-position: left center;
    background-repeat: no-repeat;

    &.jl {
      background-image: url(@/static/img/icon_zcfw_jiangli@2x.png);
    }
    &.bt {
      background-image: url(@/static/img/icon_zcfw_butie@2x.png);
    }
    &.jm {
      background-image: url(@/static/img/icon_zcfw_jianmian@2x.png);
    }
    &.mz {
      background-image: url(@/static/img/icon_zcfw_mianzheng@2x.png);
    }
    &.ry {
      background-image: url(@/static/img/icon_zcfw_rongyu@2x.png);
    }
    &.ts {
      background-image: url(@/static/img/icon_zcfw_tuishui@2x.png);
    }
    &.qt {
      background-image: url(@/static/img/icon_zcfw_qita@2x.png);
    }

    &:nth-of-type(n + 2) {
      border-top: #f0f0f0 1px solid;
    }

    .title {
      font-size: 16px;
      color: #222;
      // font-weight: 500;
      display: block;
      line-height: 2;
      width: 16em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .intro {
      font-size: 12px;
      color: #999;
      display: block;
      &.issuer {
        width: 16em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
