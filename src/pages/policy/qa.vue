<template>
  <scroll-view class="uni-container" scroll-y="true" @scrolltolower="loadMore">
    <uni-collapse accordion>
      <uni-collapse-item
        v-for="(qa, index) in list"
        :key="index"
        :title="qa.question"
      >
        <view class="answer">
          <rich-text :nodes="qa.answer"></rich-text>
        </view>
      </uni-collapse-item>
    </uni-collapse>
  </scroll-view>
</template>
<script>
import { getPolicyFAQ } from "@/api/mpApi.js";
export default {
  data() {
    return {
      list: [],
      runtime: {
        data_count: null,
      },
      config: {
        status: "ONLINE",
        page_index: 1,
      },
    };
  },
  onLoad() {
    this.getFaq();
  },
  methods: {
    getFaq() {
      getPolicyFAQ(this.config).then((data) => {
        this.list = this.list.concat(data.data);
        this.runtime.data_count = data.data_count;
      });
    },
    loadMore() {
      if (this.list.length === this.runtime.data_count) {
        uni.showToast({
          title: "没有更多记录了",
          icon: "none",
        });
        return;
      }
      this.runtime.page_index += 1;
      this.getFaq();
    },
  },
};
</script>
<style lang="scss">
scroll-view {
  height: 100vh;
  box-sizing: border-box;
}
.uni-collapse {
  background-color: transparent !important;
  .uni-collapse-item {
    background: #fff;
    margin-bottom: 12px;
    border-radius: 8px;
    overflow: hidden;
    color: #222;

    .uni-collapse-item__wrap-content,
    .uni-collapse-item__title {
      border-bottom: none !important;
    }
    .uni-collapse-item__title-text {
      font-size: 16px;
      font-weight: 500;
    }
    .answer {
      padding: 0 16px 16px 16px;
      font-size: 14px;
      line-height: 22px;
    }
  }
}
</style>
