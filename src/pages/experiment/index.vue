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
    <drop-filter :filter="filter" @change:filter="changeFilter"></drop-filter>
    <product-list
      :list="list"
      @click:item="clickItem"
      @scroll:lower="loadMore"
    ></product-list>
  </view>
</template>

<script>
import productList from "@/components/public/productList.vue";
import dropFilter from "@/components/public/dropFilter.vue";
import {
  api,
  listIndustrialCategories,
  listIndustrialLabs,
  listIndustrialInstruments,
  listIndustrialServiceProducts,
  getIndustrialServiceProductDetail,
} from "@/api/mpApi.js";

export default {
  components: {
    productList,
    dropFilter,
  },
  onLoad() {
    this.runtime.downUrl = api.base.urlDownFile;
    this.getFilter();
    this.doSearch("");
  },
  onShow() {},
  data() {
    return {
      runtime: {
        keyword: "",
        currentType: "instrument",
        data_count: 0,
        category_ids: [],
      },
      filter: [],
      baseFilter: [
        {
          name: "type",
          placeHolder: "资源分类",
          activeIndex: 0,
          items: [
            {
              key: "实验仪器",
              value: "instrument",
            },
            {
              key: "实验设施",
              value: "lab",
            },
            {
              key: "技术服务",
              value: "service",
            },
          ],
        },
      ],
      filterConfig: {
        instrument: {
          business_code: "100300",
          page_size: 99,
        },
        lab: {
          business_code: "100301",
        },
        service: {
          business_code: "100302",
        },
      },
      listConfig: {
        page_size: 10,
        page_index: 1,
        status: "ONLINE",
      },
      list: [],
    };
  },
  methods: {
    getFilter() {
      this.filter = [].concat(this.baseFilter);

      listIndustrialCategories(
        this.filterConfig[this.runtime.currentType]
      ).then((data) => {
        /*  map数据构造下拉列表，以下方法为示例  */
        // let filter = data.data.map((item) => {
        //   return {
        //     name: item.name,
        //     placeHolder: "",
        //     items: item.child_categories.map((f) => {
        //       return {
        //         key: f.name,
        //         value: f.id,
        //       };
        //     }),
        //   };
        // });
        // this.filter = [].concat(this.baseFilter, filter);
      });
    },
    doSearch(key) {
      this.list = [];
      this.listConfig.page_index = 1;

      if (key === "") {
        this.listConfig[this.runtime.currentType + "_name__like"] = "";
      } else {
        this.listConfig[this.runtime.currentType + "_name__like"] =
          this.runtime.keyword;
      }
      this.getList();
    },
    getList() {
      if (this.runtime.category_ids.length) {
        this.listConfig.category_ids = this.runtime.category_ids;
      } else {
        delete this.listConfig.category_ids;
      }

      if (this.runtime.currentType === "instrument") {
        listIndustrialInstruments(this.listConfig).then((data) => {
          this.listConfig.page_index = data.page_index;
          this.runtime.data_count = data.data_count;
          this.list = this.list.concat(
            data.data.map((item) => {
              return {
                id: item.id,
                title: item.instrument_name,
                image:
                  item.images && item.images.length
                    ? this.runtime.downUrl + item.images[0].object_name
                    : "",
                // priceDown: "¥260.00",
                // unitDown: "起",
                intro: [
                  `${item.production_place} ${item.brand} ${item.model} ${item.production_date}`,
                  item.address,
                ],
              };
            })
          );
        });
      } else if (this.runtime.currentType === "lab") {
        listIndustrialLabs(this.listConfig).then((data) => {
          this.listConfig.page_index = data.page_index;
          this.runtime.data_count = data.data_count;
          this.list = this.list.concat(
            data.data.map((item) => {
              return {
                id: item.id,
                title: item.lab_name,
                image:
                  item.images && item.images.length
                    ? this.runtime.downUrl + item.images[0].object_name
                    : "",
                // priceDown: "¥260.00",
                // unitDown: "起",
                intro: [
                  `${item.principal_user_name} ${item.principal_user_phone}`,
                  item.address,
                ],
              };
            })
          );
        });
      } else if (this.runtime.currentType === "service") {
        listIndustrialServiceProducts(this.listConfig).then((data) => {
          this.listConfig.page_index = data.page_index;
          this.runtime.data_count = data.data_count;
          this.list = this.list.concat(
            data.data.map((item) => {
              return {
                id: item.id,
                title: item.service_name,
                // image:
                //   item.images && item.images.length
                //     ? this.runtime.downUrl + item.images[0].object_name
                //     : "",
                // priceDown: "¥260.00",
                // unitDown: "起",
                intro: [
                  `排队周期：${item.waiting_time}天 服务周期：${item.service_time}天 ${item.qualification}`,
                  item.description,
                ],
              };
            })
          );
        });
      }
    },
    changeFilter(data) {
      // console.log(data);
      if (this.baseFilter[0].activeIndex !== data[0].activeIndex) {
        this.baseFilter[0].activeIndex = data[0].activeIndex;
        this.runtime.currentType = data[0].items[data[0].activeIndex].value;
        this.getFilter();
        this.runtime.category_ids = [];
      } else {
        this.runtime.category_ids = data.map((item, index) => {
          if (index > 0 && item.activeIndex !== null) {
            return item.items[item.activeIndex].value;
          }
        });
      }
      this.doSearch();
    },
    loadMore() {
      if (this.list.length >= this.runtime.data_count) {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none",
        });
      } else {
        this.listConfig.page_index += 1;
        this.getList();
      }
    },
    clickItem(item) {
      // console.log(item);
      if (["instrument", "lab"].includes(this.runtime.currentType)) {
        this.$utils.goNavi(
          `detail?id=${item.id}&type=${this.runtime.currentType}`
        );
      } else {
        uni.showLoading({ title: "加载中", mask: true });
        getIndustrialServiceProductDetail(item.id).then((data) => {
          data.name = data.service_name;
          uni.setStorageSync("product", data);
          uni.hideLoading();
          this.$utils.goNavi(`/pages/my/placeOrder?type=tech&id=${item.id}`);
        });
      }
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
  height: calc(100vh - 90px);
}
</style>
