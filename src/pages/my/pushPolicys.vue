<template>
  <view>
    <tag-filter :tags="tags" @update:filter="tagsClick"></tag-filter>
    <policy-list
      :list="policyList"
      @scroll:lower="loadMore"
      @click:item="$utils.goNavi('/pages/policy/detail?id=' + $event.id)"
    ></policy-list>
  </view>
</template>
<script>
import policyList from "@/components/policy/policyList.vue";
import tagFilter from "@/components/public/tagFilter.vue";
import { getUserPolicy, getPolicyCategories } from "@/api/mpApi.js";

export default {
  components: {
    tagFilter,
    policyList,
  },
  onLoad() {
    this.config.policy.user_id = this.$utils.getUserInfo().user_id;
    this.getPolicyCategory();
  },
  onShow() {
    this.policyList = [];
    this.getUserPolicy();
  },
  data() {
    return {
      tags: [],
      runtime: {
        data_count: 0,
      },
      config: {
        category: { business_code: "05030" },
        policy: {
          page_size: 10,
          page_index: 1,
          user_id: null,
        },
      },
      policyList: [],
    };
  },
  methods: {
    getPolicyCategory() {
      getPolicyCategories(this.config.category).then((data) => {
        const tags = data.find((item) => {
          return item.name === "支持方式";
        });
        let filter = tags.category_tags.map((t) => {
          return {
            text: t.name,
            id: t.id,
            active: false,
          };
        });
        this.tags = filter;
      });
    },
    tagsClick(activeId) {
      console.log(activeId);
    },
    loadMore() {
      if (this.policyList.length >= this.runtime.data_count) {
        return;
      }
      this.config.policy.page_index += 1;
      this.getUserPolicy();
    },
    getUserPolicy() {
      getUserPolicy(this.config.policy).then((data) => {
        this.policyList = this.policyList.concat(data.data);
        this.config.policy.page_index = data.page_index;
        this.runtime.data_count = data.data_count;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .policy-list {
  height: calc(100vh - 76px);
}
</style>
