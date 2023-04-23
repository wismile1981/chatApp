<template>
  <view class="uni-container">
    <dyn-form :formConfig="formConfig" ref="form" />
    <view class="button-box">
      <button class="btn blue pill" :loading="loading" @click="doSubmit">
        提交
      </button>
    </view>
  </view>
</template>
<script>
import dynForm from "@/components/public/dynForm.vue";
import { api, editMyInfo } from "@/api/mpApi.js";
export default {
  components: { dynForm },
  data() {
    return {
      userInfo: {},
      formConfig: {
        groups: [""],
        forms: [
          {
            name: "nickname",
            label: "昵称",
            placeholder: "请输入昵称",
            type: "text",
            required: false,
            value: "",
            gIndex: 0,
          },
          {
            name: "phone",
            label: "手机号码",
            placeholder: "",
            type: "tel",
            value: "",
            disabled: true,
            gIndex: 0,
          },
          {
            name: "avatar_url",
            label: "头像",
            placeholder: "",
            type: "upload",
            value: [],
            config: {
              type: "img",
              maxFiles: 1,
              maxSizes: 5,
              urlShowFiles: api.base.urlDownFile,
              urlUpload: api.base.urlUploadFile,
              protected: "PUBLIC",
            },
            gIndex: 0,
          },
        ],
      },
      loading: false,
    };
  },
  onShow() {
    this.userInfo = this.$utils.getUserInfo();
    this.formConfig.forms.forEach((item) => {
      if (item.type === "upload") {
        item.value = [this.userInfo[item.name]];
      } else {
        item.value = this.userInfo[item.name];
      }
    });
  },
  methods: {
    doSubmit() {
      if (this.loading) return;

      this.loading = true;

      let data = this.$refs.form.collectData();

      if (!data) return;
      // console.log(data);
      if (data.avatar_url[0].url) {
        data.avatar_url = data.avatar_url[0].url;
      }
      data.name = this.userInfo.name;
      editMyInfo(data)
        .then(() => {
          // let userInfo = this.$utils.getUserInfo();
          this.userInfo.avatar_url = data.avatar_url;
          uni.setStorageSync("userInfo", this.userInfo);
          uni.navigateBack();
        })
        .catch((e) => {
          console.error(e);
          this.loading = false;
          uni.showToast({
            title: "保存失败",
            icon: "error",
          });
        });
    },
  },
};
</script>
<style lang="scss">
.uni-uploader__input-box,
.uni-uploader__file,
.uni-uploader__file image {
  width: 50px !important;
  height: 50px !important;
  margin: 0 !important;
  border-radius: 50px;
  background: #f0f0f0;

  &::after,
  &::before {
    opacity: 0;
  }
}
.button-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  // background: #fff;
}
</style>
