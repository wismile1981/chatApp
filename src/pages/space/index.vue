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
      <uni-icons
        type="map"
        size="30"
        color="#222222"
        v-if="!runtime.mapMode"
        @click="changeView"
      ></uni-icons>
      <uni-icons
        type="list"
        size="30"
        color="#222222"
        v-if="runtime.mapMode"
        @click="changeView"
      ></uni-icons>
    </view>
    <drop-filter
      :filter="filter"
      @change:filter="changeFilter"
      :show-reset="true"
    ></drop-filter>
    <product-list
      :list="list"
      @scroll:lower="loadMore"
      @click:item="$utils.goNavi('park?id=' + $event.id)"
      v-if="!runtime.mapMode"
    ></product-list>
    <view
      class="fixed-button"
      v-if="!runtime.mapMode"
      @click="$utils.goNavi('requirement')"
    >
      <text>我要</text>
      <text>求租</text>
    </view>
    <view class="map-container" v-show="runtime.mapMode">
      <map
        id="map"
        @markertap="$utils.goNavi('park?id=' + $event.detail.markerId)"
      ></map>
    </view>
  </view>
</template>

<script>
import productList from "@/components/public/productList.vue";
import dropFilter from "@/components/public/dropFilter.vue";
import gcoord from "gcoord";
import { api, getSpaceFilter, getParkList } from "@/api/mpApi.js";

export default {
  components: {
    productList,
    dropFilter,
  },
  onLoad() {
    this.getFilter();
    this.runtime.downUrl = api.base.urlDownFile;
    this.list = [];
    this.getParks();
    this.runtime.mapContext = uni.createMapContext("map", this);
  },
  onShow() {
    // this.runtime.mapMode = false;
  },
  data() {
    return {
      runtime: {
        keyword: "",
        mapMode: false,
        data_count: 0,
        downUrl: "",
        mapContext: null,
      },
      filter: [],
      list: [],
      config: {
        filter: {
          search_purpose: 2,
          search_type: 5,
        },
        park: {
          keyword: "",
          page_index: 1,
        },
      },
    };
  },
  methods: {
    changeView() {
      this.runtime.mapMode = !this.runtime.mapMode;
      if (this.runtime.mapMode) {
        this.addMarks();
      }
    },
    doSearch(key) {
      if (key === "") {
        this.config.park.keyword = key;
      } else {
        this.config.park.keyword = this.runtime.keyword;
      }
      this.list = [];
      this.config.park.page_index = 1;
      this.getParks();
    },
    changeFilter(data) {
      data.forEach((item) => {
        if (item.activeIndex !== null) {
          this.config.park[item.name] = [item.items[item.activeIndex].value];
        } else {
          delete this.config.park[item.name];
        }
      });
      this.doSearch();
    },
    getFilter() {
      getSpaceFilter(this.config.filter).then((data) => {
        let filters = [];
        data.forEach((filter) => {
          if (
            [
              "usablearea",
              "space_appearance",
              "industrial_characteristics",
            ].includes(filter.search_criteria_code)
          ) {
            let filterItem = {
              name: filter.search_criteria_code,
              placeHolder: filter.search_criteria_name,
            };
            filterItem.items = filter.search_value.map((item) => {
              return {
                key: item.enumeration_name,
                value: item.enumeration_value,
              };
            });
            filters.push(filterItem);
          }
        });
        this.filter = filters;
      });
    },
    getParks() {
      getParkList(this.config.park).then((data) => {
        // console.log(data);
        let parks = data.data.map((item) => {
          let pos = gcoord.transform(
            [item.lng, item.lat],
            gcoord.BD09,
            gcoord.GCJ02
          );
          return {
            id: item.park_id,
            title: item.park_name,
            price: item.average_price,
            image: item.park_images.split(",")[0],
            unit: "㎡/天",
            intro: [
              item.park_address,
              `${item.provider_name} / ${item.city_name}`,
            ],
            mark: {
              id: item.park_id,
              latitude: pos[1],
              longitude: pos[0],
              iconPath: "/static/img/mark.png",
              width: "40rpx",
              height: "46rpx",
              // alpha: 0.4,
              callout: {
                content: item.park_name,
                color: "#fff",
                fontSize: 12,
                borderRadius: 8,
                bgColor: "#00000099",
                padding: 5,
                display: "ALWAYS",
              },
            },
          };
        });
        this.list = this.list.concat(parks);
        this.runtime.data_count = data.data_count;
        if (this.runtime.mapMode) {
          this.addMarks();
        }
      });
    },
    loadMore() {
      if (this.list.length >= this.runtime.data_count) {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none",
        });
        return;
      }
      this.config.park.page_index += 1;
      this.getParks();
    },
    addMarks() {
      let marks = [];
      this.list.forEach((item) => {
        marks.push(item.mark);
      });
      // console.log(marks);
      this.runtime.mapContext.addMarkers({
        markers: marks,
        clear: true,
        fail: (e) => {
          console.log(e);
        },
      });
      this.runtime.mapContext.includePoints({
        points: marks,
        padding: [30, 30, 30, 30],
        fail: (e) => {
          console.log(e);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  padding: 0 6px;
  height: 56px;

  .search-bar {
    width: 315px;
  }

  uni-icons {
    margin-right: 15px;
  }
}

::v-deep .product-list {
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

  text {
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    display: block;
    text-align: center;
  }
}

.map-container {
  height: calc(100vh - 90px);

  map {
    height: 100%;
    width: 100%;
  }
}
</style>
