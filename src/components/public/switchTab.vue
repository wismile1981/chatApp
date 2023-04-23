<template>
  <view class="switch-tab flex-row">
    <view
      class="item"
      v-for="(tab, index) in runtime.tabs"
      :key="index"
      :class="{ active: runtime.activeIndex === index }"
      @click="tabClick(index)"
      >{{ tab }}</view
    >
  </view>
</template>
<script>
export default {
  name: "switchTab",
  props: {
    tabs: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      runtime: {
        tabs: [],
        activeIndex: null,
      },
    };
  },
  created() {
    this.runtime.activeIndex = this.defaultIndex;
  },
  watch: {
    tabs: {
      handler() {
        this.runtime.tabs = JSON.parse(JSON.stringify(this.tabs));
      },
      immediate: true,
    },
  },
  methods: {
    tabClick(index) {
      if (this.runtime.activeIndex === index) {
        return;
      }
      this.runtime.activeIndex = index;
      this.$emit("change:index", index);
    },
  },
};
</script>
<style lang="scss" scoped>
.switch-tab {
  .item {
    font-size: 16px;
    color: #666;
    &:nth-of-type(n + 2) {
      margin-left: 40px;
    }
    &.active {
      color: #222;
      font-weight: 500;
      border-bottom: 4px #1649ff solid;
    }
  }
}
</style>