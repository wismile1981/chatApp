<template>
  <view>
    <view class="flex-row justify-between items-center search-box">
      <uni-search-bar
        class="search-bar"
        placeholder="搜索"
        radius="20"
        @confirm="doSearch"
        @cancel="doSearch('')"
        v-model="runtime.keyword"
      >
      </uni-search-bar>
    </view>
    <policy-list
      :list="runtime.list"
      @click:item="$utils.goNavi('declarationDetail?id=' + $event.id)"
      @scroll:lower="loadMore"
    ></policy-list>
  </view>
</template>

<script>
import policyList from "@/components/policy/policyList.vue";
import { recommendDeclaration } from "@/api/mpApi.js";

export default {
  components: {
    policyList,
  },
  data() {
    return {
      runtime: {
        keyword: "",
        list: [],
        data_count: 0,
      },
      config: {
        status: "ONLINE",
        keyword: "",
        page_index: 1,
        threshold: 70,
      },
    };
  },
  onLoad(option) {
    this.config.threshold = option.threshold;
    this.getDeclaration();
  },
  methods: {
    doSearch(keyword) {
      this.runtime.list = [];
      this.runtime.page_index = 1;
      if (typeof keyword !== "undefined") {
        this.config.keyword = keyword;
      } else {
        this.config.keyword = this.runtime.keyword;
      }
      this.getDeclaration();
    },
    getDeclaration() {
      recommendDeclaration(this.config).then((data) => {
        data.data.forEach((element) => {
          element.issuer = element.end_date
            ? element.end_date.substring(0, 10) + "截止"
            : "";
        });
        this.runtime.list = this.runtime.list.concat(data.data);
        this.config.page_index = data.page_index;
        this.runtime.data_count = data.data_count;
      });
    },
    loadMore() {
      if (this.runtime.list.length >= this.runtime.data_count) {
        uni.showToast({
          title: "没有更多记录了",
          icon: "none",
        });
        return;
      }
      this.runtime.page_index += 1;
      this.getDeclaration();
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  padding: 0 6px;
  height: 56px;

  .search-bar {
    width: 100%;
  }
}

::v-deep .policy-list {
  height: calc(100vh - 56px);
}
</style>
