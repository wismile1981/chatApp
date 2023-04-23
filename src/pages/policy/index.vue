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
    <drop-filter
      :filter="filter"
      :show-reset="true"
      @change:filter="changeFilter($event)"
    ></drop-filter>
    <policy-list
      :list="runtime.list"
      @click:item="$utils.goNavi('detail?id=' + $event.id)"
      @scroll:lower="loadMore"
    ></policy-list>
    <view class="fixed-button" @click="$utils.goNavi('recommend')">
      <text>智能</text>
      <text>推荐</text>
    </view>
    <view class="fixed-button left" @click="$utils.goNavi('qa')">
      <text>政策</text>
      <text>问答</text>
    </view>
  </view>
</template>

<script>
import policyList from "@/components/policy/policyList.vue";
import dropFilter from "@/components/public/dropFilter.vue";
import { getPolicyList, getPolicyCategories } from "@/api/mpApi.js";

export default {
  components: {
    policyList,
    dropFilter,
  },
  data() {
    return {
      runtime: {
        keyword: "",
        list: [],
        page_index: 1,
        data_count: 0,
        filter: [],
      },
      config: {
        category: { business_code: "05030" },
        policy: {
          status: "ONLINE",
          keyword: "",
        },
      },
      filter: [],
    };
  },
  created() {
    this.getPolicyCategory();
    this.getPolicy();
  },
  methods: {
    changeFilter(event) {
      let filter = [];
      event.forEach((item) => {
        if (item.activeIndex !== null) {
          filter.push(item.items[item.activeIndex].value);
        }
      });
      this.runtime.filter = filter;
      this.doSearch();
    },
    doSearch(keyword) {
      this.runtime.list = [];
      this.runtime.page_index = 1;
      if (keyword === "") {
        this.config.policy.keyword = keyword;
      } else {
        this.config.policy.keyword = this.runtime.keyword;
      }
      this.getPolicy();
    },
    getPolicyCategory() {
      getPolicyCategories(this.config.category).then((data) => {
        let filter = [];
        data.forEach((item) => {
          if (["支持方式", "支持产业", "适用对象"].indexOf(item.name) >= 0) {
            let filterItem = {
              name: item.name,
              placeHolder: item.name,
              items: [],
            };
            item.category_tags.forEach((tag) => {
              filterItem.items.push({
                key: tag.name,
                value: tag.id,
              });
            });
            filter.push(filterItem);
          }
        });
        this.filter = filter;
      });
    },
    getPolicy() {
      let data = Object.assign(this.config.policy);
      data.page_index = this.runtime.page_index;
      if (this.runtime.filter.length) {
        data.category_tag_ids = this.runtime.filter;
      } else {
        delete data.category_tag_ids;
      }
      // if (this.runtime.keyword) {
      // data.keyword = this.runtime.keyword;
      // }

      getPolicyList(this.config.policy).then((data) => {
        this.runtime.list = this.runtime.list.concat(data.data);
        this.runtime.page_index = data.page_index;
        this.runtime.data_count = data.data_count;
      });
    },
    loadMore() {
      if (this.runtime.list.length === this.runtime.data_count) {
        uni.showToast({
          title: "没有更多记录了",
          icon: "none",
        });
        return;
      }
      this.runtime.page_index += 1;
      this.getPolicy();
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
  height: calc(100vh - 90px);
}

.fixed-button {
  width: 54px;
  height: 54px;
  background: #1649ff;
  position: fixed;
  bottom: 30px;
  right: 20px;
  border-radius: 50%;
  padding: 6px;

  &.left {
    left: 20px;
    right: initial;
  }

  text {
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    display: block;
    text-align: center;
  }
}
</style>
