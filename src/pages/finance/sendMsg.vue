<template>
  <view
    ><dyn-form :formConfig="formConfig" ref="form"></dyn-form>
    <view class="button-box">
      <button
        class="btn blue pill"
        :loading="runtime.loading"
        @click="doSubmit"
      >
        提交
      </button>
    </view></view
  >
</template>
<script>
import dynForm from "@/components/public/dynForm.vue";
import { saveInquirys } from "@/api/mpApi.js";
export default {
  components: {
    dynForm,
  },
  onLoad(option) {
    this.runtime.data_id = option.id;
    this.runtime.type = option.type;
    this.runtime.shop_id = option.shop;
  },
  onShow() {
    if (!this.$utils.getToken()) {
      this.$utils.goLogin();
    }
    this.runtime.loading = false;
  },
  data() {
    return {
      formConfig: {
        groups: [""],
        forms: [
          {
            name: "contact_person",
            label: "联系人",
            placeholder: "",
            type: "text",
            required: true,
            value: "",
            gIndex: 0,
          },
          {
            name: "contact_phone",
            label: "联系电话",
            placeholder: "",
            type: "tel",
            value: "",
            required: true,
            rules: [
              {
                preset: "mobile",
                msg: "请输入手机号码",
              },
            ],
            gIndex: 0,
          },
        ],
      },
      runtime: {
        loading: false,
        type: null,
        data_id: null,
        shop_id: null,
      },
    };
  },
  methods: {
    async doSubmit() {
      if (this.runtime.loading) {
        return;
      }

      try {
        let data = await this.$refs.form.validate();
        this.runtime.loading = true;

        if (this.runtime.type == 1) {
          data.inquiry_type = "EQUITY";
          data.shop_id = this.runtime.data_id;
        } else if (this.runtime.type == 2) {
          data.inquiry_type = "DEBT";
          data.debt_product_id = this.runtime.data_id;
          data.shop_id = this.runtime.shop_id;
        }
        saveInquirys(data).then(() => {
          uni.showToast({
            title: "提交成功",
            icon: "none",
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 1000);
        });
      } catch (e) {
        uni.showToast({
          title: e,
          icon: "none",
        });
      } finally {
        this.runtime.loading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.button-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  // background: #fff;
}
</style>
