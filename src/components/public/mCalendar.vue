<template>
  <view class="m-calendar">
    <view class="tit">
      <view class="current">{{ current.year }}.{{ current.month }}</view>
      <view class="fanye">
        <uni-icons type="left" size="24" @click="gotoPreMonth"></uni-icons>
        <uni-icons
          style="margin-left: 20rpx"
          type="right"
          size="24"
          @click="gotoNextMonth"
        ></uni-icons>
      </view>
    </view>
    <view class="showData">
      <view>一</view>
      <view>二</view>
      <view>三</view>
      <view>四</view>
      <view>五</view>
      <view>六</view>
      <view>日</view>
    </view>
    <view class="content">
      <view v-for="(item, index) in showDays" :key="index" class="itemData">
        <view
          :class="[
            'default',
            item.disabled ? 'disabled' : '',
            item.date === now.date ? 'today' : '',
            activeTs.includes(item.date) ? 'active' : '',
            range.candidate.includes(item.date) ? 'candidate' : '',
            [range.startTs, range.endTs].includes(item.date) ? 'range' : '',
            item.date >= range.startTs &&
            item.date <= range.endTs &&
            selectMode === 'range'
              ? 'range-item'
              : '',
          ]"
          @click="clickDate(item)"
          >{{ item.day }}</view
        >
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "mCalendar",
  props: {
    showMonthCount: {
      type: Number,
      default: 1, // 显示月数
    },
    disableNonCurrMonth: {
      type: Boolean,
      default: false, // 禁用非本月日期
    },
    disableDays: {
      type: Array, //禁用日期列表
      default() {
        return [];
      },
    },
    enableDays: {
      type: Array, //启用日期列表
      default() {
        return [];
      },
    },
    disableWeekdays: {
      type: Array, //禁用星期列表
      default() {
        return [];
      },
    },
    disablePastDay: {
      type: Boolean,
      default: false,
    },
    disableToday: {
      type: Boolean,
      default: false,
    },
    selectMode: {
      type: String,
      default: "single",
      validator: (value) => {
        ["single", "range", "multi"].includes(value);
      },
    },
    maxRange: {
      // 最大时间区间天数
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      now: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        get date() {
          return new Date(this.year, this.month - 1, this.day).getTime();
        },
      },
      current: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        get date() {
          return new Date(this.year, this.month - 1, this.day).getTime();
        },
      },
      showDays: [],
      activeTs: [],
      range: {
        startTs: null,
        endTs: null,
        candidate: [],
      },
    };
  },
  onReady() {
    this.getShowDays();
  },
  watch: {
    disableDays: {
      handler() {
        this.checkDisable(this.showDays);
      },
      immediate: true,
    },
    disableNonCurrMonth: {
      handler() {
        this.checkDisable(this.showDays);
      },
      immediate: true,
    },
    disableWeekdays: {
      handler() {
        this.checkDisable(this.showDays);
      },
      immediate: true,
    },
    disablePastDay: {
      handler() {
        this.checkDisable(this.showDays);
      },
      immediate: true,
    },
    disableToday: {
      handler() {
        this.checkDisable(this.showDays);
      },
      immediate: true,
    },
    enableDays: {
      handler() {
        this.checkDisable(this.showDays);
      },
      immediate: true,
    },
  },

  methods: {
    checkDisable(days) {
      days.forEach((dateItem) => {
        dateItem.disabled = false;

        if (!dateItem.disabled && this.disableWeekdays.length) {
          // console.log(this.disableWeekdays);
          dateItem.disabled = this.disableWeekdays.includes(dateItem.weekday);
        }

        if (!dateItem.disabled && this.disableDays.length) {
          dateItem.disabled =
            this.disableDays.findIndex((item) => {
              return dateItem.date >= item.start && dateItem.date <= item.end;
            }) >= 0;
        }

        if (dateItem.disabled && this.enableDays.length) {
          dateItem.disabled =
            this.enableDays.findIndex((item) => {
              return dateItem.date >= item.start && dateItem.date <= item.end;
            }) < 0;
        }

        if (!dateItem.disabled && this.disablePastDay) {
          dateItem.disabled = dateItem.date < this.now.date;
        }

        if (!dateItem.disabled && this.disableToday) {
          dateItem.disabled = dateItem.date === this.now.date;
        }

        if (!dateItem.disabled && this.disableNonCurrMonth) {
          dateItem.disabled =
            dateItem.year !== this.current.year ||
            dateItem.month !== this.current.month;
        }
      });
    },
    getShowDays() {
      const getMonthDays = (year, month, direction, start, length) => {
        const dayCount = new Date(year, month, 0).getDate();
        let days = [];
        start = start || 0;
        if (length) {
          start = start || 0;
          if (direction === "r") {
            start = dayCount - start - length;
          }
        } else {
          length = dayCount;
        }
        for (let i = start; i < start + length; i++) {
          let day = {
            year: year,
            month: month,
            day: i + 1,
            date: new Date(year, month - 1, i + 1).getTime(),
            weekday: new Date(year, month - 1, i + 1).getDay() || 7,
            // disabled : false
          };
          // this.checkDisable(day);
          days.push(day);
        }
        this.checkDisable(days);
        return days;
      };

      let showDays = [];
      let showMonth = {
        year: this.current.year,
        month: this.current.month,
      };

      for (let i = 0; i < this.showMonthCount; i++) {
        showDays = showDays.concat(
          getMonthDays(showMonth.year, showMonth.month)
        );
        showMonth = this.nextMonth(showMonth.year, showMonth.month);
      }

      // let showDays = getMonthDays(this.current.year, this.current.month);
      if (showDays[0].weekday > 1) {
        let preMonth = this.preMonth(this.current.year, this.current.month);
        showDays = getMonthDays(
          preMonth.year,
          preMonth.month,
          "r",
          0,
          showDays[0].weekday - 1
        ).concat(showDays);
      }
      if (showDays[showDays.length - 1].weekday < 7) {
        let nextMonth = this.nextMonth(this.current.year, this.current.month);
        showDays = showDays.concat(
          getMonthDays(
            nextMonth.year,
            nextMonth.month,
            "l",
            0,
            7 - showDays[showDays.length - 1].weekday
          )
        );
      }
      this.showDays = showDays;
    },
    // 上月 年、月
    preMonth(year, month) {
      if (month == 1) {
        return {
          year: --year,
          month: 12,
        };
      } else {
        return {
          year: year,
          month: --month,
        };
      }
    },
    // 下月 年、月
    nextMonth(year, month) {
      if (month == 12) {
        return {
          year: ++year,
          month: 1,
        };
      } else {
        return {
          year: year,
          month: ++month,
        };
      }
    },

    gotoPreMonth() {
      let { year, month } = this.preMonth(
        this.current.year,
        this.current.month
      );
      this.current.year = year;
      this.current.month = month;
      this.getShowDays();
    },
    // 点击 下月
    gotoNextMonth() {
      let { year, month } = this.nextMonth(
        this.current.year,
        this.current.month
      );
      this.current.year = year;
      this.current.month = month;
      this.getShowDays();
    },
    clickDate(dateItem) {
      if (dateItem.disabled) {
        return;
      }
      if (["single", "multi"].includes(this.selectMode)) {
        if (this.activeTs.includes(dateItem.date)) {
          this.activeTs.splice(this.activeTs.indexOf(dateItem.date), 1);
        } else {
          if (this.selectMode === "single") {
            this.activeTs = [dateItem.date];
          } else {
            this.activeTs.push(dateItem.date);
          }
        }
      } else if (this.selectMode === "range") {
        this.activeTs = [];
        if (this.range.startTs !== null && this.range.endTs !== null) {
          this.range.startTs = null;
          this.range.endTs = null;
        }
        if (this.range.startTs === null) {
          this.range.startTs = dateItem.date;
          this.countCandidate();
        } else {
          if (this.range.candidate.includes(dateItem.date)) {
            this.range.endTs = dateItem.date;
            this.range.candidate = [];
          } else {
            uni.showToast({
              title: "请选择可选择区域",
              icon: "none",
            });
          }
        }
      }
      this.$emit("click:date", {
        clickDate: dateItem.date,
        selectMode: this.selectMode,
        range: {
          start: this.range.startTs,
          end: this.range.endTs,
          dayCount: this.range.endTs
            ? (this.range.endTs - this.range.startTs) / (1000 * 24 * 60 * 60) +
              1
            : 0,
        },
      });
    },
    countCandidate() {
      this.range.candidate = [];
      let count = 0;
      let startIndex = this.showDays.findIndex((item) => {
        return item.date === this.range.startTs;
      });
      while (count < this.maxRange) {
        let currentIndex = startIndex + count;
        if (!this.showDays[currentIndex]) {
          break;
        }
        if (!this.showDays[currentIndex].disabled) {
          this.range.candidate.push(this.showDays[currentIndex].date);
        }
        count++;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.m-calendar {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding-bottom: 20rpx;

  .showData {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-left: 25rpx;
    padding-right: 25rpx;
    > view {
      width: 14%;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      flex-shrink: 0;
      font-size: 30rpx;
      color: rgba(34, 34, 34, 0.4);
    }
  }
  .tit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 40rpx 20rpx 56rpx;
    .fanye {
      // margin-left: 20rpx;
      display: flex;
    }
    .current {
      font-size: 28px;
      font-weight: 600;
      color: rgba(34, 34, 34, 1);
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding-left: 25rpx;
    padding-right: 25rpx;
  }
  .itemData {
    width: 14.2%;
    flex-shrink: 0;
    font-size: 30rpx;
    color: #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
    .default {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 68rpx;
      height: 68rpx;
      border-radius: 50%;
      margin: 8rpx 0;
      border: 2rpx solid transparent;
      &.disabled {
        color: #999;
      }
      &.active {
        background: #1649ff !important;
        color: #fff !important;
        border: 2rpx solid #1649ff;
      }
      &.today {
        border: 2rpx solid #1649ff;
      }
      &.candidate {
        background: rgba(22, 73, 255, 0.1);
      }
      &.range {
        border: 2rpx solid #00b06e;
      }
      &.range-item {
        background: #00b06e;
        color: #fff;
      }
    }
  }
}
</style>