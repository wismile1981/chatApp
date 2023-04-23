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
    <product-list
      :list="list"
      @click:item="$utils.goNavi('detail?id=' + $event.id)"
      @scroll:lower="loadMore"
    ></product-list>
  </view>
</template>

<script>
import productList from "@/components/public/productList.vue";
import { api, listCommodityProducts } from "@/api/mpApi.js";

export default {
  components: {
    productList,
  },
  data() {
    return {
      runtime: {
        keyword: "",
      },
      config: {
        status: "ONLINE",
        // category_id: 104,
        service_name__like: "",
      },
      list: [],
    };
  },
  created() {
    this.getServiceList();
  },
  methods: {
    getServiceList() {
      listCommodityProducts(this.config).then((data) => {
        let serviceList = data.data;
        this.config.page_index = data.page_index;
        this.runtime.data_count = data.data_count;

        serviceList.forEach((item) => {
          item.title = item.service_name;
          item.priceDown = "¥" + item.min_price;
          item.image = api.base.urlDownFile + item.images[0].object_name;
          // item.intro = [item.shop_name];
        });
        this.list = this.list.concat(serviceList);
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
      this.config.page_index += 1;
      this.getServiceList();
    },
    doSearch(keyword) {
      this.list = [];
      this.config.page_index = 1;
      if (keyword === "") {
        this.config.service_name__like = keyword;
      } else {
        this.config.service_name__like = this.runtime.keyword;
      }
      this.getServiceList();
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

::v-deep .product-list {
  height: calc(100vh - 56px);
}
</style>
