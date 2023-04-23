<template>
  <view class="main">
    <swiper class="swiper">
      <swiper-item v-for="(item, index) in space.room_images" :key="index">
        <image :src="runtime.downUrl + item" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <view class="uni-container">
      <view class="flex-row justify-between items-center">
        <view class="title"
          >{{ space.park_name }} {{ space.housing_resources_number }}</view
        >
        <view class="price">{{ space.unit_price }}/㎡/天</view>
      </view>
      <view class="tag-container flex-row flex-wrap">
        <text class="tag" v-for="(tag, index) in space.features" :key="index">{{
          tag
        }}</text>
      </view>
      <view class="booking">
        <view class="title">预约看房</view>
        <view class="flex-row">
          <input
            type="text"
            placeholder="输入联系人"
            v-model.trim="appointment.contact"
            @focus="checkLogin"
          />
        </view>
        <view class="flex-row">
          <input
            type="tel"
            placeholder="输入联系电话"
            v-model.trim="appointment.contact_tel"
            @focus="checkLogin"
          />
        </view>
        <view class="flex-row justify-between">
          <picker
            mode="date"
            @change="changePicker('appointment_date', $event)"
            :start="new Date().toISOString().split('T')[0]"
          >
            <view>{{ appointment.appointment_date || "选择预约日期" }}</view>
          </picker>
          <picker
            mode="selector"
            :range="timeSlot.data"
            :value="timeSlot.activeIndex"
            range-key="key"
            @change="changePicker('time_slot', $event)"
          >
            <view>{{
              timeSlot.activeIndex
                ? timeSlot.data[timeSlot.activeIndex].key
                : "选择预约时段"
            }}</view>
          </picker>
        </view>
        <view class="flex-row">
          <view class="flex1">
            <input
              type="text"
              placeholder="输入其他需求"
              v-model.trim="appointment.requirement"
              @focus="checkLogin"
            />
          </view>
          <view>
            <button
              class="btn blue pill"
              :loading="runtime.loading"
              @click="saveAppointment"
              :disabled="runtime.submited"
            >
              {{ runtime.submited ? "已预约" : "立即预约" }}
            </button>
          </view>
        </view>
      </view>
      <view class="title">相关房源</view>
      <product-list
        :list="rooms"
        @click:item="$utils.goNavi('space?id=' + $event.id)"
      ></product-list>
    </view>
    <view class="button-box flex-row justify-between">
      <button
        class="btn blue pill"
        @click="$utils.goNavi('park?id=' + space.park_id)"
      >
        进入园区
      </button>
      <button class="btn red pill" @click="$utils.dail(space.contact_number)">
        联系客服
      </button>
    </view>
  </view>
</template>
<script>
import productList from "@/components/public/productList.vue";
import {
  api,
  getRoomDetail,
  getParkRoomList,
  addSpaceAppointment,
} from "@/api/mpApi.js";
export default {
  components: { productList },
  onLoad(option) {
    this.runtime.downUrl = api.base.urlDownFile;
    this.runtime.id = option.id;
  },
  onShow() {
    this.getSpaceDetail();
  },
  data() {
    return {
      space: {},
      appointment: {
        appointment_date: "",
        contact: "",
        contact_tel: "",
        park_id: null,
        park_name: "",
        requirement: "",
        target_id: null,
        target_name: "",
        target_type: "5",
        time_slot: null,
      },
      runtime: {
        id: null,
        loading: false,
        submited: false,
      },
      roomConfig: { page_size: 4, park_id: null },
      rooms: [],
      timeSlot: {
        activeIndex: null,
        data: [
          {
            key: "上午",
            value: 1,
          },
          {
            key: "下午",
            value: 2,
          },
        ],
      },
    };
  },
  methods: {
    getSpaceDetail() {
      getRoomDetail(this.runtime.id).then((data) => {
        data.room_images = data.room_images.split(",");
        data.features = [
          data.floorage + "㎡",
          data.registrable ? "可注册" : "不可注册",
          data.whether_reconstruction ? "可分割" : "不可分割",
          "层高" + data.storey_height + "m",
        ];
        this.space = data;
        this.roomConfig.park_id = data.park_id;
        this.appointment.park_id = data.park_id;
        this.appointment.park_name = data.park_name;
        this.appointment.target_id = this.runtime.id;
        this.appointment.target_name = data.housing_resources_number;
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
      });
    },
    changePicker(name, e) {
      // console.log(e);
      if (name === "appointment_date") {
        this.appointment[name] = e.detail.value;
      } else {
        this.timeSlot.activeIndex = e.detail.value;
        this.appointment[name] = this.timeSlot.data[e.detail.value].value;
      }
    },
    saveAppointment() {
      let data = this.appointment;
      if (
        !data.contact_tel ||
        !data.appointment_date ||
        !data.contact ||
        !data.time_slot ||
        !data.requirement
      ) {
        uni.showToast({
          title: "请将信息填写完整",
          icon: "none",
        });
        return;
      }
      if (this.runtime.loading) {
        return;
      }
      this.runtime.loading = true;
      addSpaceAppointment(data)
        .then(() => {
          uni.showToast({ title: "提交成功", icon: "success" });
          // this.runtime.loading = false;
          this.runtime.submited = true;
        })
        .catch(() => {
          this.runtime.loading = false;
        });
    },
    checkLogin() {
      if (!this.$utils.getToken()) {
        this.$utils.goLogin();
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
  .title,
  .price {
    font-size: 20px;
    font-weight: 600;
    color: #222222;
    padding: 12px 0;
  }
  .price {
    color: #ff3e3e;
  }
  .booking {
    background: #f6f7f8;
    border-radius: 8px;
    padding: 16px;
    .title {
      font-size: 16px;
    }
    .flex-row {
      margin: 6px 0;
      input {
        height: 40px;
        background: #ffffff;
        border-radius: 22px;
        font-size: 14px;
        padding: 0 22px;
        width: 100%;
        &::placeholder {
          color: #b5b5b5;
        }
      }
      .flex1 {
        padding-right: 10px;
      }
      button {
        height: 40px;
        font-size: 14px;
        font-weight: 400;
      }
      picker {
        view {
          height: 40px;
          background: #ffffff;
          border-radius: 22px;
          font-size: 14px;
          line-height: 40px;
          padding: 0 22px;
          width: 150px;
        }
      }
    }
  }
  .tag-container {
    padding-bottom: 8px;
    .tag {
      display: block;
      font-size: 12px;
      line-height: 2;
      padding: 0 8px;
      background: #f6f7f8;
      border-radius: 4px;
      color: #999;
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
    button {
      width: 160px;
    }
  }
}
</style>
