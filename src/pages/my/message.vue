<template>
  <scroll-view class="main" scroll-y="true" @scrolltolower="loadMore">
    <view
      class="item"
      v-for="(msg, index) in msgs"
      :key="index"
      @click="readMsg(index)"
    >
      <view
        class="flex-row justify-between items-center"
        :class="{ read: msg.status }"
      >
        <text class="title">{{ msg.subject }}</text>
        <text class="date">{{ msg.created_at.substring(0, 10) }}</text>
      </view>
      <view class="intro">{{ msg.content }}</view>
    </view>
  </scroll-view>
</template>

<script>
import { listInternalMsg, setInternalMsgStatus } from "@/api/mpApi.js";
export default {
  data() {
    return {
      msgs: [],
      runtime: {},
      config: {
        page_index: 1,
      },
    };
  },
  onShow() {
    if (!this.$utils.getToken()) {
      this.$utils.goLogin();
    } else {
      this.msgs = [];
      this.config.page_index = 1;
      this.getMsgList();
    }
  },
  methods: {
    getMsgList() {
      listInternalMsg(this.config).then((data) => {
        this.runtime.data_count = data.data_count;
        this.msgs = this.msgs.concat(data.data);
      });
    },
    loadMore() {
      if (this.runtime.data_count <= this.msgs.length) {
        uni.showToast({
          title: "没有更多记录了",
          icon: "none",
        });
      } else {
        this.config.page_index += 1;
        this.getMsgList();
      }
    },
    readMsg(index) {
      const msg = this.msgs[index];
      uni.showModal({
        title: msg.subject,
        content: msg.content,
        showCancel: false,
        success: () => {
          if (!msg.status) {
            setInternalMsgStatus({ multi_msg_id: [msg.id], status: 1 });
            this.msgs[index].status = 1;
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100vh;
  box-sizing: border-box;
  background: #fff;
  padding: 16px;
  .item {
    padding: 16px 0;
    border-top: #f0f0f0 1px solid;
    &:first-of-type {
      padding-top: 0;
      border: none;
    }
    .read {
      .title {
        font-weight: 400;
        color: #666;
      }
    }
    .title {
      color: #222;
      font-weight: 500;
    }
    .date,
    .intro {
      font-size: 12px;
      color: #999;
    }
    .intro {
      padding-top: 6px;
    }
  }
}
</style>
