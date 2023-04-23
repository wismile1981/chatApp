<template>
  <view class="tag-filter flex-row flex-wrap">
    <text
      class="tag"
      v-for="(tag, index) in runtime.tags"
      :key="index"
      :class="{ active: tag.active, disabled: tag.disabled }"
      @click="clickTag(index)"
      >{{ tag.text }}</text
    >
  </view>
</template>
<script>
export default {
  name: "tagFilter",
  props: {
    tags: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 是否允许多选tag
    multi: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // 是否保留最后一个活动tag
    maintainOne: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      runtime: {
        tags: [],
        activeCount: null,
      },
    };
  },
  watch: {
    tags: {
      handler(newval) {
        this.runtime.tags = JSON.parse(JSON.stringify(this.tags));
      },
      immediate: true,
      deep: true,
    },
    "runtime.tags": {
      handler(newval) {
        let activeCount = 0;
        newval.forEach((item) => {
          if (item.active) {
            activeCount += 1;
          }
        });
        this.runtime.activeCount = activeCount;
        // console.log(activeCount);
      },
      deep: true,
    },
  },
  methods: {
    clickTag(index) {
      if (this.readonly) {
        return;
      }
      if (this.runtime.tags[index].disabled) {
        return;
      }
      if (!this.multi) {
        this.runtime.tags.forEach((tag, tagIndex) => {
          if (tag.active && index !== tagIndex) {
            tag.active = false;
          }
        });
      }
      const tag = this.runtime.tags[index];
      if (this.maintainOne && this.runtime.activeCount === 1 && tag.active) {
        return;
      }
      tag.active = !tag.active;

      this.$emit("update:filter", this.collectData());
    },
    collectData() {
      let data = [];
      this.runtime.tags.forEach((tag) => {
        if (tag.active) {
          data.push(tag.id);
        }
      });
      // console.log(data);
      return data;
    },
  },
};
</script>
<style lang="scss" scoped>
.tag-filter {
  padding: 0 16px 16px 16px;
  .tag {
    display: block;
    font-size: 12px;
    line-height: 2;
    padding: 0 8px;
    border: #1649ff 1px solid;
    border-radius: 12px;
    color: #1649ff;
    margin-right: 8px;
    margin-bottom: 4px;
    min-width: 40px;
    text-align: center;
    &.active {
      color: #fff;
      background: #1649ff;
    }
    &.disabled {
      background: #ff3e3e3a;
    }
  }
}
</style>
