<template>
  <view class="drop-filter flex-row">
    <!-- <view > -->
    <picker
      class="filter-item"
      v-for="(item, index) in runtime"
      :key="index"
      @change="filterChange(index, $event)"
      :value="item.activeIndex"
      :range="item.items"
      range-key="key"
    >
      <view
        class="uni-input"
        :class="{ selected: item.activeIndex !== null }"
        >{{
          item.activeIndex === null
            ? item.placeHolder || "请选择"
            : item.items[item.activeIndex].key
        }}</view
      >
      <uni-icons
        class="icon"
        type="arrowdown"
        size="12"
        color="#CECECE"
      ></uni-icons>
    </picker>
    <view class="reset-filter" v-if="showReset" @click="reset">重置</view>
    <!-- </view> -->
  </view>
</template>
<script>
export default {
  name: "dropFilter",
  props: {
    filter: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showReset: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      runtime: [],
    };
  },
  watch: {
    filter: {
      handler(newVal) {
        let runtime = JSON.parse(JSON.stringify(this.filter));
        runtime.forEach((item) => {
          if (typeof item.activeIndex === "undefined") {
            item.activeIndex = null;
          }
        });
        this.runtime = runtime;
      },
      immediate: true,
    },
  },
  methods: {
    filterChange(index, e) {
      // console.log(e);
      const filter = this.runtime[index];
      filter.activeIndex = e.target.value;
      this.$emit("change:filter", this.runtime);
    },
    reset() {
      let runtime = JSON.parse(JSON.stringify(this.filter));
      runtime.forEach((item) => {
        if (typeof item.activeIndex === "undefined") {
          item.activeIndex = null;
        }
      });
      this.runtime = runtime;
      this.$emit("change:filter", this.runtime);
    },
  },
};
</script>
<style lang="scss" scoped>
.drop-filter {
  font-size: 14px;
  color: #666;
  padding: 2px 16px 12px 16px;
  height: 34px;

  .filter-item {
    padding-right: 28px;
    position: relative;
    // width: 100px;
    .uni-input {
      min-width: 56px;
      max-width: 8em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .selected {
      color: #1649ff;
    }
    .icon {
      position: absolute;
      right: 15px;
      top: 0;
    }
  }
  .reset-filter {
    margin-left: auto;
    color: #1649ff;
  }
}
</style>