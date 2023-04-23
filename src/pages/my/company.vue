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
import {
  api,
  addMyEnterprise,
  editMyEnterprise,
  setMyEnterpriseLicense,
  setMyEnterpriseLogo,
  listBaseData,
} from "@/api/mpApi.js";
export default {
  components: { dynForm },
  data() {
    return {
      company: null,
      industry: [],
      formConfig: {
        groups: [""],
        forms: [
          {
            name: "name",
            label: "企业名称",
            placeholder: "",
            type: "text",
            required: true,
            value: "",
            gIndex: 0,
          },
          {
            name: "suc_code",
            label: "社会统一信用代码",
            placeholder: "",
            type: "text",
            value: "",
            required: false,
            gIndex: 0,
          },
          {
            name: "legal_representative",
            label: "法人姓名",
            placeholder: "",
            type: "text",
            value: "",
            required: true,
            gIndex: 0,
          },
          {
            name: "industry",
            label: "所属行业 ",
            placeholder: "请选择行业",
            type: "selector",
            value: "",
            data: [],
            required: true,
            gIndex: 0,
          },
          {
            name: "registered_capital",
            label: "注册资金(万元)",
            placeholder: "",
            type: "digit",
            value: "",
            required: true,
            gIndex: 0,
          },
          {
            name: "contacts_name",
            label: "联系人姓名",
            placeholder: "",
            type: "text",
            value: "",
            required: true,
            gIndex: 0,
          },
          {
            name: "contacts_phone",
            label: "联系电话",
            placeholder: "",
            type: "tel",
            value: "",
            required: true,
            gIndex: 0,
          },
          {
            name: "contacts_email",
            label: "联系邮箱",
            placeholder: "",
            type: "text",
            value: "",
            required: false,
            gIndex: 0,
          },
          {
            name: "logo",
            label: "LOGO",
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
          {
            name: "business_license",
            label: "营业执照",
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
    this.company = uni.getStorageSync("company");
    this.getIndustry();
    if (this.company.name) {
      this.formConfig.forms.forEach((item) => {
        if (item.type === "upload" && typeof item.value === "string") {
          item.value = [this.company[item.name]];
        } else {
          item.value = this.company[item.name];
        }
      });
    }
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
      editMyInfo()
        .then(() => {
          uni.navigateBack();
        })
        .catch((e) => {
          this.loading = false;
          uni.showToast({
            title: "保存失败",
            icon: "error",
          });
        });
    },
    getIndustry() {
      const param = { data_type: 3 };

      listBaseData(param).then((data) => {
        let list = [];
        data.forEach((item) => {
          list.push({
            key: item.data_name,
            value: item.id,
          });
        });
        this.formConfig.forms[3].data = list;
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
}
.button-box {
  // position: fixed;
  // bottom: 0;
  // left: 0;
  width: 100%;
  padding: 16px 0;
  // background: #fff;
}
</style>
