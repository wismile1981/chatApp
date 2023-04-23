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
        ref="searchbar"
      >
      </uni-search-bar>
    </view>
    <tag-filter
      :tags="tagFilters.tags"
      @update:filter="filterChange"
      :maintainOne="tagFilters.maintainOne"
    ></tag-filter>
    <product-grid
      :list="list"
      @scroll:lower="loadMore"
      @click:item="clickItem"
    ></product-grid>
  </view>
</template>

<script>
import productGrid from "@/components/public/productGrid.vue";
import tagFilter from "@/components/public/tagFilter.vue";
import { api, getFinancialShops, getFinancialProducts } from "@/api/mpApi.js";

export default {
  components: { productGrid, tagFilter },
  data() {
    return {
      runtime: {
        keyword: "",
        activeTag: 1,
        page_index: 1,
        data_count: 0,
      },
      list: [],
      tagFilters: {
        tags: [
          {
            text: "股权投资",
            id: 1,
            active: true,
          },
          {
            text: "债权投资",
            id: 2,
            active: false,
          },
        ],
        multi: false,
        maintainOne: true,
      },
      config: {
        shop: {
          status: "ONLINE",
          shop_type: "EQUITY",
        },
        product: {
          status: "ONLINE",
        },
      },
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    getData(key) {
      this.list = [];
      this.runtime.page_index = 1;

      if (key === undefined) {
        this.runtime.keyword = "";
      } else {
        this.runtime.keyword = key;
      }

      if (this.runtime.activeTag === 1) {
        this.getShopList();
      } else {
        this.getProductList();
      }
    },
    getShopList() {
      this.config.shop.keyword = this.runtime.keyword;
      this.config.shop.page_index = this.runtime.page_index;

      getFinancialShops(this.config.shop).then((data) => {
        data.data.forEach((item) => {
          item.title = item.shop_name;
          item.intro = item.enterprise_name;
          item.image = api.base.urlDownFile + item.shop_logo.object_name;
          item.tag = {
            color: "blue",
            text: "股权投资",
          };
        });
        this.list = this.list.concat(data.data);
        this.runtime.data_count = data.data_count;
      });
    },
    getProductList() {
      this.config.product.keyword = this.runtime.keyword;
      this.config.product.page_index = this.runtime.page_index;

      getFinancialProducts(this.config.product).then((data) => {
        data.data.forEach((item) => {
          item.title = item.product_name;
          item.intro = item.shop_name;
          item.image = api.base.urlDownFile + item.shop_logo.object_name;
          item.tag = {
            color: "yellow",
            text: "债权融资",
          };
        });
        this.list = this.list.concat(data.data);
        this.runtime.data_count = data.data_count;
      });
    },
    filterChange(e) {
      this.runtime.activeTag = e[0];
      this.$refs.searchbar.cancel();
      // this.getData();
    },
    doSearch(e) {
      console.log(e);
      this.getData(e.value);
    },
    loadMore() {
      if (this.list.length === this.runtime.data_count) {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none",
        });
      } else {
        this.runtime.page_index += 1;
        if (this.runtime.activeTag === 1) {
          this.getShopList();
        } else {
          this.getProductList();
        }
      }
    },
    clickItem(item) {
      this.$utils.goNavi(`detail?id=${item.id}&type=${this.runtime.activeTag}`);
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
::v-deep .product-grid {
  padding: 12px 16px !important;
  height: calc(100vh - 102px);
  .item {
    width: 165px;
    image {
      width: 165px;
      height: 125px;
    }
  }
}
</style>
