<template>
  <view class="main">
    <swiper class="swiper">
      <swiper-item>
        <image
          :src="runtime.downUrl + shop.shop_logo.object_name"
          mode="aspectFill"
        ></image>
      </swiper-item>
    </swiper>
    <view class="uni-container">
      <view class="flex-row items-center">
        <view class="title">{{ shop.shop_name }}</view>
      </view>
      <view class="text">{{ shop.shop_address }}</view>
      <switch-tab :tabs="tabs" @change:index="changeTab" />
      <product-list :list="list" @click:item="clickItem" />
    </view>
    <!-- <view class="button-box">
      <button class="btn blue pill" @click="$utils.dail()">联系客服</button>
    </view> -->
  </view>
</template>

<script>
import {
  api,
  getIndustrialShopDetail,
  listIndustrialInstruments,
  listIndustrialLabs,
  listIndustrialServiceProducts,
  getIndustrialServiceProductDetail,
} from "@/api/mpApi.js";
import productList from "@/components/public/productList.vue";
import switchTab from "@/components/public/switchTab.vue";
export default {
  components: { productList, switchTab },
  onLoad(option) {
    this.runtime.downUrl = api.base.urlDownFile;
    this.runtime.id = option.id;
    this.getShop();
  },
  onShow() {},
  data() {
    return {
      shop: {},
      tabs: [],
      list: [],
      runtime: {
        downUrl: "",
        id: null,
      },
      config: {
        shop_id: null,
        status: "ONLINE",
        page_size: 999,
      },
      activeTab: "",
    };
  },
  methods: {
    getShop() {
      this.tabs = [];
      this.list = [];
      getIndustrialShopDetail(this.runtime.id).then(async (data) => {
        this.shop = data;
        this.config.shop_id = data.id;
        uni.setNavigationBarTitle({
          title: data.shop_name,
        });
        this.shop.instruments = (
          await listIndustrialInstruments(this.config)
        ).data.map((item) => {
          return {
            id: item.id,
            title: item.instrument_name,
            image:
              item.images && item.images.length
                ? this.runtime.downUrl + item.images[0].object_name
                : "",
            intro: [
              `${item.production_place} ${item.brand} ${item.model} ${item.production_date}`,
              item.address,
            ],
          };
        });
        if (this.shop.instruments.length) {
          this.tabs.push("仪器设备");
        }

        this.shop.labs = (await listIndustrialLabs(this.config)).data.map(
          (item) => {
            return {
              id: item.id,
              title: item.lab_name,
              image:
                item.images && item.images.length
                  ? this.runtime.downUrl + item.images[0].object_name
                  : "",
              intro: [
                `${item.principal_user_name} ${item.principal_user_phone}`,
                item.address,
              ],
            };
          }
        );
        if (this.shop.labs.length) {
          this.tabs.push("实验设施");
        }

        this.shop.services = (
          await listIndustrialServiceProducts(this.config)
        ).data.map((item) => {
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
        });
        if (this.shop.services.length) {
          this.tabs.push("技术服务");
        }
        this.changeTab(0);
      });
    },
    changeTab(index) {
      this.activeTab = this.tabs[index];
      if (this.activeTab === "仪器设备") {
        this.list = this.shop.instruments;
      } else if (this.activeTab === "实验设施") {
        this.list = this.shop.labs;
      } else if (this.activeTab === "技术服务") {
        this.list = this.shop.services;
      }
    },
    clickItem(item) {
      // console.log(item);
      if (["仪器设备", "实验设施"].includes(this.activeTab)) {
        this.$utils.goNavi(
          `detail?id=${item.id}&type=${
            this.activeTab === "仪器设备" ? "instrument" : "lab"
          }`
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
.main {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 80px;

  .swiper {
    height: 280px;
    // background: #000;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #222222;
    padding: 12px 0;
  }
  .text {
    font-size: 14px;
    line-height: 20px;
    color: #999;
    // padding-bottom: 12px;
  }
  .special {
    display: block;
    font-size: 12px;
    line-height: 2;
    padding: 0 8px;
    border: #1649ff 1px solid;
    border-radius: 4px;
    color: #1649ff;
    margin-left: 1.5em;
  }
  .button-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    background: #fff;
  }
  ::v-deep .product-list {
    padding: 0;
  }
  ::v-deep .switch-tab {
    margin-top: 20px;
  }
}
</style>
