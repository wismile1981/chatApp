<template>
  <view class="main">
    <swiper class="swiper">
      <swiper-item v-for="(item, index) in park.park_images" :key="index">
        <image :src="item" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <view class="uni-container">
      <view class="flex-row items-center">
        <view class="title">{{ park.park_name }}</view>
        <view class="special">{{ park.investment_direction[0].name }}</view>
        <!-- <view
          class="special"
          v-for="item in park.investment_direction"
          :key="item.id"
          >{{ item.name }}</view
        > -->
      </view>
      <view class="text">{{ park.description }}</view>
      <view class="title">服务配套</view>
      <view class="tag-container flex-row flex-wrap">
        <text
          class="tag"
          v-for="(tag, index) in park.service_matching"
          :key="index"
          >{{ tag.name }}</text
        >
      </view>
      <view class="title">园区房源</view>
      <product-list
        :list="rooms"
        @click:item="$utils.goNavi('space?id=' + $event.id)"
      ></product-list>
    </view>
    <view class="button-box">
      <button class="btn blue pill" @click="$utils.dail(park.contact_number)">
        联系客服
      </button>
    </view>
  </view>
</template>

<script>
import productList from "@/components/public/productList.vue";
import { api, getParkDetail, getParkRoomList } from "@/api/mpApi.js";
export default {
  components: { productList },
  onLoad(option) {
    this.runtime.downUrl = api.base.urlDownFile;
    this.runtime.id = option.id;
    this.roomConfig.park_id = option.id;
  },
  onShow() {
    this.getParkDetail();
  },
  data() {
    return {
      park: {},
      runtime: {
        downUrl: "",
        id: null,
      },
      rooms: [],
      roomConfig: { page_size: 99, park_id: null, rental_status: 0 },
    };
  },
  methods: {
    getParkDetail() {
      getParkDetail(this.runtime.id).then((data) => {
        this.park = data;
      });
      getParkRoomList(this.roomConfig).then((data) => {
        let rooms = data.data.map((item) => {
          return {
            id: item.id,
            title: item.housing_resources_number,
            price: item.unit_price,
            image: this.runtime.downUrl + item.room_images.split(",")[0],
            unit: "㎡/天",
            intro: [`${item.building_name} / ${item.floorage}㎡`],
          };
        });
        this.rooms = rooms;
      });
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
    padding-bottom: 12px;
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
  .tag-container {
    padding-bottom: 8px;
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
    }
  }
  .button-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    background: #fff;
  }
}
</style>
