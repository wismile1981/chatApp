<template>
  <view class="uni-container">
    <dyn-form :formConfig="formConfig" ref="form"></dyn-form>
    <view class="button-box">
      <button
        class="btn blue pill"
        :loading="runtime.loading"
        @click="doSubmit"
      >
        提交
      </button>
    </view>
  </view>
</template>

<script>
import dynForm from "@/components/public/dynForm.vue";
import { addUniversalDemand } from "@/api/mpApi.js";
export default {
  components: {
    dynForm,
  },
  onShow() {
    this.runtime.loading = false;
  },
  data() {
    return {
      formConfig: {
        groups: [""],
        forms: [
          {
            name: "name",
            label: "联络人姓名",
            placeholder: "",
            type: "text",
            required: true,
            value: "",
            gIndex: 0,
          },
          {
            name: "phone",
            label: "联络人电话",
            placeholder: "",
            type: "tel",
            value: "",
            required: true,
            gIndex: 0,
            rules: [
              {
                preset: "mobile",
                msg: "请输入手机号码",
              },
            ],
          },
          {
            name: "demand_area",
            label: "需求面积",
            placeholder: "",
            type: "number",
            unit: "㎡",
            value: "",
            gIndex: 0,
          },
          {
            name: "space_type",
            label: "意向空间类",
            placeholder: "请选择",
            type: "selector",
            value: "",
            activeIndex: null,
            data: [
              {
                key: "办公室",
                value: 1,
              },
              {
                key: "厂房",
                value: 2,
              },
              {
                key: "联合办公",
                value: 3,
              },
            ],
            gIndex: 0,
          },
          // {
          //   name: "time",
          //   label: "预约时间",
          //   placeholder: "请选择",
          //   type: "datepicker",
          //   value: "",
          //   config: {
          //     start: "2021-12-12",
          //     end: "2021-12-20",
          //     fields: "day",
          //   },
          //   gIndex: 0,
          // },
          {
            name: "description",
            label: "其他需求",
            placeholder: "",
            value: "",
            type: "textarea",
            gIndex: 0,
          },
        ],
      },
      runtime: {
        loading: false,
      },
      config: { business_code: "010000" },
    };
  },
  methods: {
    doSubmit() {
      // const data = this.$refs.form.collectData();
      this.$refs.form
        .validate()
        .then((data) => {
          console.log(data);
          data.extra = {};
          data.extra.demand_area = data.demand_area;
          data.extra.space_type = data.space_type;
          Object.assign(data, this.config);

          if (this.runtime.loading) {
            return;
          }
          this.runtime.loading = true;
          addUniversalDemand(data).then(() => {
            uni.showToast({
              title: "提交成功",
              icon: "success",
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1000);
          });
        })
        .catch((e) => {
          uni.showToast({
            title: e,
            icon: "none",
          });
        });
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
  background: #fff;
}
</style>
