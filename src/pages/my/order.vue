<template>
  <view class="main flex-row">
    <scroll-view style="width: 60px" scroll-y="true">
      <view class="left">
        <view
          class="item"
          :class="{ active: runtime.activeTab == 0 }"
          @click="loadOrders(0)"
        >
          <text>空间</text>
          <text>载体</text>
        </view>
        <view
          class="item"
          :class="{ active: runtime.activeTab == 1 }"
          @click="loadOrders(1)"
        >
          <text>技术</text>
          <text>平台</text>
        </view>
        <view
          class="item"
          :class="{ active: runtime.activeTab == 2 }"
          @click="loadOrders(2)"
        >
          <text>企业</text>
          <text>服务</text>
        </view>
      </view>
    </scroll-view>
    <view class="right">
      <drop-filter
        :filter="runtime.filter"
        @change:filter="changeFilter"
      ></drop-filter>
      <scroll-view class="order-list" scroll-y="true" @scrolltolower="loadMore">
        <view
          class="item"
          v-for="(order, index) in runtime.orders"
          :key="index"
        >
          <view class="flex-row">
            <image
              :src="order.image"
              mode="aspectFill"
              v-if="order.image"
            ></image>
            <view class="flex1">
              <view class="title">{{ order.title }}</view>
              <view class="company">{{ order.company }}</view>
              <view class="date">{{ order.date }}</view>
              <view class="price">{{ order.price }}</view>
            </view>
          </view>
          <view class="info flex-row justify-between">
            <text class="intro">{{ order.info }}</text>
            <text class="status">{{ order.status }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import dropFilter from "@/components/public/dropFilter.vue";
import {
  api,
  getUserAppointments,
  listIndustrialReservationOrders,
  listIndustrialServiceOrders,
  listCommodityOrders,
} from "@/api/mpApi.js";
export default {
  components: { dropFilter },
  onLoad(option) {
    this.runtime.downUrl = api.base.urlDownFile;
    this.config.user_id = this.$utils.getUserInfo().user_id;
  },
  onShow() {
    this.runtime.activeTab = uni.getStorageSync("activeTab");
    uni.removeStorage("activeTab");
    this.loadOrders(this.runtime.activeTab);
  },
  data() {
    return {
      runtime: {
        filter: [],
        activeTab: 0,
        currentFilter: {},
        data_count: 0,
        orders: [],
      },
      config: {
        user_id: null,
        page_size: 10,
        page_index: 1,
      },
      orderStatus: [
        {
          status: "CANCELED",
          text: "已取消",
        },
        {
          status: "INIT",
          text: "已下单",
        },
        {
          status: "CONFIRMED",
          text: "已确认",
        },
        {
          status: "REJECT",
          text: "已拒绝",
        },
        {
          status: "PAID",
          text: "已支付",
        },
        {
          status: "FINISHED",
          text: "已完成",
        },
      ],
    };
  },
  methods: {
    getOrderStatus(status) {
      return this.orderStatus.find((item) => {
        return item.status === status;
      }).text;
    },
    loadOrders(index, filter) {
      this.runtime.activeTab = index;
      this.runtime.orders = [];
      filter = filter || {};
      this.config.page_index = 1;

      if (index == 0) {
        this.runtime.filter = [
          {
            placeHolder: "预约状态",
            name: "status",
            items: [
              {
                key: "已受理",
                value: 2,
              },
              {
                key: "待受理",
                value: 1,
              },
            ],
          },
        ];
        this.getSpaceAppointment(filter);
      }
      if (index == 1) {
        this.runtime.filter = [
          {
            placeHolder: "服务类型",
            name: "order",
            activeIndex: 0,
            items: [
              {
                key: "设备设施",
                value: 1,
              },
              {
                key: "技术服务",
                value: 2,
              },
            ],
          },
          {
            placeHolder: "订单状态",
            name: "status",
            items: [
              {
                value: "CANCELED",
                key: "已取消",
              },
              {
                value: "INIT",
                key: "已创建",
              },
              {
                value: "CONFIRMED",
                key: "已确认",
              },
              {
                value: "REJECT",
                key: "已拒绝",
              },
              {
                value: "PAID",
                key: "已支付",
              },
              {
                value: "FINISHED",
                key: "已完成",
              },
            ],
          },
        ];
        if (filter && filter.order === 2) {
          this.getIndustrialServiceOrder(filter);
        } else {
          this.getIndustrialReservation(filter);
        }
      }
      if (index == 2) {
        this.runtime.filter = [
          {
            placeHolder: "订单状态",
            name: "status",
            items: [
              {
                value: "CANCELED",
                key: "已取消",
              },
              {
                value: "INIT",
                key: "已下单",
              },
              {
                value: "CONFIRMED",
                key: "已确认",
              },
              {
                value: "REJECT",
                key: "已拒绝",
              },
              {
                value: "PAID",
                key: "已支付",
              },
              {
                value: "FINISHED",
                key: "已完成",
              },
            ],
          },
        ];
        this.getServiceOrder(filter);
      }
    },
    getSpaceAppointment(filter) {
      getUserAppointments(Object.assign(filter, this.config)).then((data) => {
        this.runtime.data_count = data.data_count;
        this.runtime.orders = this.runtime.orders.concat(
          data.data.map((item) => {
            return {
              title: `${item.park_name} ${item.target_name}`,
              company: item.principal_name,
              date: `${item.appointment_date} ${
                item.time_slot == 1 ? "上午" : "下午"
              }`,
              // price: "¥260.00",
              info: `${item.contact} / ${item.contact_tel}`,
              status: item.status == 2 ? "已受理" : "待受理",
            };
          })
        );
      });
    },
    getIndustrialReservation(filter) {
      listIndustrialReservationOrders(Object.assign(filter, this.config)).then(
        (data) => {
          this.runtime.data_count = data.data_count;
          this.runtime.orders = this.runtime.orders.concat(
            data.data.map((item) => {
              return {
                title: item.resource_name,
                company: item.shop_name,
                date: `${item.start_date} - ${item.end_date}`,
                price: `¥${item.total_price}`,
                info: `${item.user_name || item.phone} / ${item.phone}`,
                status: this.getOrderStatus(item.status),
              };
            })
          );
        }
      );
    },
    getIndustrialServiceOrder(filter) {
      listIndustrialServiceOrders(Object.assign(filter, this.config)).then(
        (data) => {
          this.runtime.data_count = data.data_count;
          this.runtime.orders = this.runtime.orders.concat(
            data.data.map((item) => {
              return {
                title: item.resource_name,
                company: item.shop_name,
                date: this.$utils.dateFormat(
                  "YYYY-mm-dd HH:MM",
                  item.created_at
                ),
                price: `¥${item.total_price}`,
                info: `${item.spec_name} x ${item.count}`,
                status: this.getOrderStatus(item.status),
              };
            })
          );
        }
      );
    },
    getServiceOrder(filter) {
      console.log("service");
      listCommodityOrders(Object.assign(filter, this.config)).then((data) => {
        this.runtime.data_count = data.data_count;
        this.runtime.orders = this.runtime.orders.concat(
          data.data.map((item) => {
            return {
              title: item.resource_name,
              company: item.shop_name,
              date: this.$utils.dateFormat("YYYY-mm-dd HH:MM", item.created_at),
              price: `¥${item.total_price}`,
              info: `${item.spec_name} x ${item.count}`,
              status: this.getOrderStatus(item.status),
            };
          })
        );
      });
    },
    changeFilter(data) {
      let filter = {};
      data.forEach((item) => {
        if (item.activeIndex !== null) {
          filter[item.name] = item.items[item.activeIndex].value;
        }
      });
      this.runtime.currentFilter = filter;
      this.loadOrders(this.runtime.activeTab, filter);
    },
    loadMore() {
      console.log("loadmore");
      if (this.runtime.orders.length >= this.runtime.data_count) {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none",
        });
        return;
      }
      let index = this.runtime.activeTab;
      let filter = this.runtime.currentFilter;
      if (index == 0) {
        this.getSpaceAppointment(filter);
      }
      if (index == 1) {
        if (filter && filter.order === 2) {
          this.getIndustrialServiceOrder(filter);
        } else {
          this.getIndustrialReservation(filter);
        }
      }
      if (index == 2) {
        this.getServiceOrder(filter);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  .left {
    width: 60px;
    background: #ffffff;
    border-radius: 0px 8px 8px 0px;
    // margin-right: 12px;
    .item {
      // height: 72px;
      font-size: 14px;
      color: #222;
      font-weight: 500;
      padding: 16px 0;
      text {
        display: block;
        text-align: center;
      }
      &.active {
        color: #fff;
        background: #1649ff;
        border-radius: 0px 8px 8px 0px;
      }
    }
  }
  .right {
    width: 315px;
    padding: 0 12px;
    height: 100vh;
    .order-list {
      height: calc(100vh - 42px);
      .item {
        margin: 6px 0;
        background: #ffffff;
        border-radius: 8px;
        padding: 12px;
        image {
          width: 80px;
          height: 60px;
          border-radius: 5px;
          margin-right: 12px;
        }
        .flex1 {
          min-height: 60px;
        }
        .title {
          font-size: 16px;
          font-weight: 500;
          line-height: 22px;
        }
        .date,
        .company {
          font-size: 9px;
          color: #999;
        }
        .price {
          font-size: 16px;
          font-weight: 600;
          color: #ff3e3e;
          position: absolute;
          right: 24px;
          margin-top: -16px;
        }
        .info {
          padding-top: 12px;
          border-top: #f0f0f0 1px solid;
          font-size: 14px;
          color: #999;
          .status {
            &.highlight {
              color: #1649ff;
            }
          }
        }
      }
    }
  }
}
</style>
