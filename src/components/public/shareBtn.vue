<template>
  <button class="share-btn" open-type="share">
    <image
      src="/static/img/icon_details_share@2x.png"
      mode="aspectFit"
      class="icon"
    />
    <text>分享</text>
  </button>
</template>
<script>
export default {
  name: "shareBtn",
  onReady() {
    uni.showShareMenu({
      menus: ["shareAppMessage", "shareTimeline"],
    });
  },
};
</script>
<style lang="scss" scoped>
.share-btn {
  position: fixed;
  right: 0;
  height: 36px;
  padding: 0 18px;
  line-height: 36px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 18px 0 0 18px;
  z-index: 999;
  background: #1649ff;
  display: flex;
  align-items: center;
  .icon {
    width: 17px;
    height: 16px;
    padding-right: 4px;
  }
}
</style>
