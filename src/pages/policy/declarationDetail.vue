<template>
  <view>
    <view class="uni-container top">
      <view class="title">{{ declaration.title }}</view>
      <view class="intro">{{ declaration.end_date.substring(0, 10) }}截止</view>
      <view class="intro">
        {{ declaration.policy_level }}
        {{
          declaration.pub_date ? declaration.pub_date.substring(0, 10) : ""
        }}发布
      </view>
      <tag-filter :tags="declaration.tagsBind" readonly="true"></tag-filter>
    </view>
    <switch-tab :tabs="tabs"></switch-tab>
    <view class="html">
      <rich-text :nodes="declaration.content"></rich-text>
    </view>
  </view>
</template>
<script>
import tagFilter from "@/components/public/tagFilter.vue";
import SwitchTab from "@/components/public/switchTab.vue";
import { getPolicyDeclaration } from "@/api/mpApi.js";

export default {
  components: { tagFilter, SwitchTab },
  data() {
    return {
      dataId: null,
      declaration: "",
      tabs: ["正文"],
    };
  },
  onLoad(option) {
    this.dataId = option.id;
    this.getDetail();
  },
  onShow() {},
  methods: {
    getDetail() {
      getPolicyDeclaration(this.dataId).then((declaration) => {
        declaration.tagsBind = declaration.tags.map((tag, index) => {
          return {
            id: index,
            text: tag,
            active: false,
          };
        });
        this.declaration = declaration;
      });
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
