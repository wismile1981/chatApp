<template>
  <view class="container">
    <m-calendar
      :select-mode="calendar.mode"
      :disable-past-day="true"
      :disable-today="true"
      :show-month-count="calendar.showMonthCount"
      :disable-days="calendar.disableDays"
      :enable-days="calendar.enableDays"
      :disable-weekdays="calendar.disabledWeekdays"
      :max-range="calendar.maxRange"
      @click:date="clickDate"
    ></m-calendar>
    <view
      class="uni-container"
      v-if="rule && rule.price_unit !== 'DAY' && timeList.length"
    >
      <view class="title">预约时段</view>
      <tag-filter
        :tags="timeList"
        :multi="true"
        @update:filter="timeUpdate"
      ></tag-filter>
    </view>
    <view class="button-box">
      <button class="btn blue pill" @click="doReserve" :loading="loading">
        立即预约
        <text v-if="total">（{{ total * rule.price }}元）</text>
      </button>
    </view>
  </view>
</template>
<script>
import mCalendar from "@/components/public/mCalendar.vue";
import tagFilter from "@/components/public/tagFilter.vue";
import {
  getIndustrialReservationRule,
  addIndustrialReservationOrder,
  listIndustrialReservationTimeBuckets,
  checkIndustrialReservationDateRange,
} from "@/api/mpApi.js";
export default {
  components: { mCalendar, tagFilter },
  data() {
    return {
      object: {},
      type: "",
      rule: {},
      timeList: [],
      selectDate: {},
      loading: false,
      range: {},
      calendar: {
        mode: "single",
        maxRange: null,
        disableDays: [],
        enableDays: [],
        disabledWeekdays: [],
        showMonthCount: 1,
      },
      total: 0,
      activeTimes: [],
    };
  },
  onLoad(option) {
    this.type = option.type;
    // this.disableDate.push();
  },
  onShow() {
    this.object = uni.getStorageSync("reserveObject");
    this.initRule(this.object.reservation_rule_id);
    uni.setNavigationBarTitle({
      title: "预约" + this.object.name,
    });
  },
  methods: {
    initRule(ruleId) {
      getIndustrialReservationRule(ruleId).then((data) => {
        // this.rule = data;
        if (data.price_unit === "DAY") {
          this.calendar.mode = "range";
          this.calendar.maxRange = data.maximum_period;
          this.calendar.showMonthCount = 2;
        }
        if (data.rule_mode === "CYCLE") {
          let disWeekdays = [];
          for (let i = 0; i < 7; i++) {
            if (!data.weekdays.includes(i + 1)) {
              disWeekdays.push(i + 1);
            }
          }
          this.calendar.disabledWeekdays = disWeekdays;
        } else {
          this.calendar.disabledWeekdays = [6, 7];
        }
        if (data.excepts.length) {
          let disable = [];
          let enable = [];
          data.excepts.forEach((except) => {
            if (except.extra_mode === "ENABLE") {
              enable.push({
                start: new Date(except.start_date).getTime(),
                end: new Date(except.end_date).getTime(),
              });
            } else {
              disable.push({
                start: new Date(except.start_date).getTime(),
                end: new Date(except.end_date).getTime(),
              });
            }
          });
          this.calendar.disableDays = disable;
          this.calendar.enableDays = enable;
        }
        this.rule = data;
      });
    },
    calculateTimeClip() {
      let timeClips = [];

      listIndustrialReservationTimeBuckets(
        this.object.reservation_rule_id,
        this.$utils.dateFormat("YYYY-mm-dd", new Date(this.selectDate))
      )
        .then((data) => {
          timeClips = data.map((item, index) => {
            return {
              text: item.start_time + "-" + item.end_time,
              start_time: item.start_time,
              end_time: item.end_time,
              id: index,
              active: false,
              disabled: !item.available,
            };
          });
          this.timeList = timeClips;
        })
        .catch(() => {
          this.timeList = [];
        });
    },
    clickDate(data) {
      if (data.selectMode === "single") {
        this.selectDate = data.clickDate;
        this.calculateTimeClip();
      } else {
        // if (data.range.dayCount) {
        this.range = data.range;
        this.total = data.range.dayCount;
        // }
      }
      // console.log(data);
    },
    timeUpdate(activeIndex) {
      console.log(activeIndex);
      this.total = activeIndex.length;
      this.activeTimes = activeIndex;
    },
    doReserve() {
      if (this.loading) return;
      if (!this.total) {
        uni.showToast({
          title: "请选择预约时间",
          icon: "none",
        });
        return;
      }
      this.loading = true;
      let data = {
        shop_id: this.object.shop_id,
        rule_id: this.object.reservation_rule_id,
        enterprise_id: this.object.enterprise_id,
        user_id: this.$utils.getUserInfo().user_id,
        user_name: this.$utils.getUserInfo().name,
        phone: this.$utils.getUserInfo().phone,
        primary_key_id: this.object.id,
        resource_name: this.object.name,
        start_date:
          this.calendar.mode === "single"
            ? this.$utils.dateFormat("YYYY-mm-dd", new Date(this.selectDate))
            : this.$utils.dateFormat("YYYY-mm-dd", new Date(this.range.start)),
        end_date:
          this.calendar.mode === "single"
            ? this.$utils.dateFormat("YYYY-mm-dd", new Date(this.selectDate))
            : this.$utils.dateFormat("YYYY-mm-dd", new Date(this.range.end)),
        extends: [],
      };
      if (this.activeTimes.length) {
        data.extends = this.activeTimes.map((item) => {
          console.log(item);
          return {
            calendar_date: this.$utils.dateFormat(
              "YYYY-mm-dd",
              new Date(this.selectDate)
            ),
            start_time: item.start_time,
            end_time: item.end_time,
          };
        });
      }
      addIndustrialReservationOrder(data)
        .then((res) => {
          console.log(res);
          uni.showToast({
            title: "订单提交成功",
            icon: "success",
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1000);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  min-height: calc(100vh);
  background: #fff;
  padding-bottom: 76px;
  .button-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    background: #fff;
  }
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #222222;
    padding: 12px 0;
  }
  .uni-container {
    padding: 0 28px;
  }
  ::v-deep .tag-filter {
    padding-left: 0;
    padding-right: 0;

    .tag {
      width: 125px;
      margin: 4px 8px;
      font-size: 14px;
      background: #f6f7f8;
      border-color: #f6f7f8;
      color: #b5b5b5;
    }
  }
}
</style>
