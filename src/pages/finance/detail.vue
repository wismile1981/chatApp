<template>
  <view class="main">
    <view class="uni-container top">
      <view class="flex-row">
        <show-file
          :src="runtime.downFile + detail.shop_logo.object_name"
          styleFile="width: 68px;height: 68px;border-radius: 12px; margin-right:12px;"
        ></show-file>
        <view>
          <view class="title">{{
            detail.enterprise_name || detail.product_name
          }}</view>
          <view class="intro" v-if="type == 2">
            {{ detail.shop_name }}
          </view>
          <view class="intro" v-if="type == 2">
            参考利率 {{ detail.interest_rate_min }} ~
            {{ detail.interest_rate_max }}
          </view>
          <view class="intro" v-if="type == 2">
            贷款额度 {{ detail.loan_amount_min }}-{{ detail.loan_amount_max }}万
          </view>
          <view class="intro" v-if="type == 2">
            贷款周期 {{ detail.loan_term_min }}-{{ detail.loan_term_max }}个月
          </view>
          <view class="intro" v-if="type == 1 && detail.area.province_id">
            所属地区 {{ detail.area.province_name }}-{{
              detail.area.city_name
            }}-{{ detail.area.county_name }}
          </view>
          <view class="intro" v-if="type == 1">
            成立时间 {{ detail.established_year }}
          </view>
          <view class="intro" v-if="type == 1 && detail.fund_size">
            管理资金 {{ detail.fund_size }}亿
          </view>
          <view class="intro" v-if="type == 1">
            投资阶段 {{ detail.investment_stage }}
          </view>
        </view>
      </view>
    </view>
    <view class="html">
      <view v-if="type == 1 && detail.description">
        <view class="title">机构简介</view>
        <rich-text :nodes="$utils.fixRichText(detail.description)"></rich-text>
      </view>
      <view v-if="detail.investment_team">
        <view class="title">投资团队</view>
        <rich-text
          :nodes="$utils.fixRichText(detail.investment_team)"
        ></rich-text>
      </view>
      <view v-if="type == 2 && detail.description">
        <view class="title">产品简介</view>
        <rich-text :nodes="$utils.fixRichText(detail.description)"></rich-text>
      </view>
      <view v-if="detail.applicable_consumers">
        <view class="title">适用客户</view>
        <rich-text
          :nodes="$utils.fixRichText(detail.applicable_consumers)"
        ></rich-text>
      </view>
      <view v-if="detail.conditions">
        <view class="title">申请条件</view>
        <rich-text :nodes="$utils.fixRichText(detail.conditions)"></rich-text>
      </view>
    </view>
    <view class="button-box">
      <button
        class="btn blue pill"
        @click="
          $utils.goNavi(
            `sendMsg?type=${type}&id=${data_id}&shop=${detail.shop_id}`
          )
        "
      >
        我要留言
      </button>
    </view>
  </view>
</template>
<script>
import {
  api,
  getFinancialShopDetail,
  getFinancialProductDetail,
} from "@/api/mpApi.js";
import ShowFile from "@/components/Dialog/Upload/ShowFile.vue";
export default {
  components: { ShowFile },
  data() {
    return {
      runtime: {
        loading: false,
        downFile: api.base.urlDownFile,
      },
      data_id: null,
      type: null,
      detail: {},
    };
  },
  onLoad(option) {
    this.data_id = option.id;
    this.type = option.type;
    this.getDetail();
  },
  methods: {
    getDetail() {
      if (this.type == 1) {
        getFinancialShopDetail(this.data_id).then((data) => {
          this.detail = data;
          uni.setNavigationBarTitle({ title: data.abbreviation });
        });
      } else if (this.type == 2) {
        getFinancialProductDetail(this.data_id).then((data) => {
          this.detail = data;
          uni.setNavigationBarTitle({ title: data.product_name });
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  padding-bottom: 76px;
}
.uni-container {
  padding: 0 16px;
}
.top {
  .title {
    font-size: 18px;
    line-height: 25px;
    font-weight: 600;
    margin-bottom: 6px;

    &.detail {
      margin-top: 20px;
    }
  }
  .intro {
    margin: 2px 0;
    font-size: 12px;
    line-height: 17px;
    color: #777;
  }
}

.html {
  margin-top: 12px;
  background: #fff;
  border-radius: 8px 8px 0px 0px;
  padding: 16px;
  rich-text {
    font-size: 14px;
    color: #222;
    display: block;
  }
  .title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    padding: 8px 0;
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
</style>