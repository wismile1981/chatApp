<template>
  <view>
    <view class="uni-container top">
      <view class="title">{{ policy.title }}</view>
      <view class="intro">{{ policy.issuer }}</view>
      <view class="intro">
        {{ policy.policy_no || "" }}
        {{ policy.pub_date ? policy.pub_date.substring(0, 10) : "" }}
      </view>
      <tag-filter :tags="policy.tagsBind" readonly="true"></tag-filter>
    </view>
    <switch-tab :tabs="tabs" @change:index="changeTab"></switch-tab>
    <view class="html">
      <rich-text
        v-show="activeTab == '正文'"
        :nodes="policy.content"
      ></rich-text>
      <rich-text v-show="activeTab == '解读'" :nodes="declaration"></rich-text>
      <view v-show="activeTab == '图解'">
        <image
          v-for="(item, index) in illustration"
          :key="index"
          :src="item.url"
          mode="widthFix"
        ></image>
      </view>
    </view>
  </view>
</template>
<script>
import tagFilter from "@/components/public/tagFilter.vue";
import SwitchTab from "@/components/public/switchTab.vue";
import { api, getPolicyDetail } from "@/api/mpApi.js";

export default {
  components: { tagFilter, SwitchTab },
  data() {
    return {
      dataId: null,
      policy: {},
      declaration: "",
      illustration: [],
      activeTab: "正文",
      tabs: ["正文"],
    };
  },
  onLoad(option) {
    this.dataId = option.id;
    // this.downloadUrl = api.base.urlDownFile;
    this.getDetail();
  },
  onShow() {},
  methods: {
    getDetail() {
      getPolicyDetail(this.dataId).then((data) => {
        data.tagsBind = data.tags.map((tag, index) => {
          return {
            id: index,
            text: tag,
            active: false,
          };
        });
        this.policy = data;
        if (data.declarations && data.declarations.length) {
          this.tabs.push("解读");
          // getPolicyDeclaration(data.declarations[0]).then((declaration) => {
          this.declaration = data.declarations[0].content;
          // });
        }
        if (data.illustrations && data.illustrations.length) {
          this.tabs.push("图解");
          this.illustration = data.illustrations[0].attachments.map((item) => {
            return {
              url: api.base.urlDownFile + item.object_name,
            };
          });
        }
      });
    },
    changeTab(index) {
      this.activeTab = this.tabs[index];
    },
  },
};
</script>
<style lang="scss" scoped>
.uni-container {
  padding: 0 16px;
}
.top {
  .title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .intro {
    margin: 2px 0;
    font-size: 12px;
    line-height: 17px;
    color: #777;
  }
  ::v-deep .tag-filter {
    padding: 12px 0;
  }
}
::v-deep .switch-tab {
  padding: 0 16px;
}
.html {
  margin-top: 12px;
  background: #fff;
  border-radius: 8px 8px 0px 0px;
  padding: 16px;
  rich-text {
    font-size: 14px;
    color: #222;
  }
  image {
    width: 100%;
  }
}
</style>
