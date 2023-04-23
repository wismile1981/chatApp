<template>
  <view class="uni-container">
    <view class="info">请完善您的企业信息，以便我们为您定制推送政策信息。</view>
    <dyn-form
      :formConfig="formConfig"
      ref="form"
      @change:value="formChange"
    ></dyn-form>
    <view class="flex-row justify-between">
      <button
        class="btn blue blank"
        :loading="runtime.loading"
        @click="doSubmit(1)"
      >
        模糊匹配
      </button>
      <button
        class="btn blue pill"
        :loading="runtime.loading"
        @click="doSubmit(2)"
      >
        精确匹配
      </button>
    </view>
  </view>
</template>

<script>
import dynForm from "@/components/public/dynForm.vue";
import { getEnterpriseInfo, setEnterpriseInfo, listArea } from "@/api/mpApi.js";

export default {
  components: {
    dynForm,
  },
  onShow() {
    if (!this.$utils.getToken()) {
      this.$utils.goLogin();
    } else {
      this.runtime.loading = false;
      this.getEnterprise();
    }
  },
  data() {
    return {
      formConfig: {
        groups: ["基本信息", "资质情况", "经营状况"],
        forms: [
          {
            name: "enterprise_name",
            label: "企业名称",
            placeholder: "",
            type: "text",
            required: true,
            gIndex: 0,
          },
          {
            name: "registration_time",
            label: "注册时间",
            placeholder: "",
            type: "datepicker",
            config: {
              fields: "day",
            },
            required: true,
            gIndex: 0,
          },
          {
            name: "province_id",
            label: "注册地址",
            placeholder: "请选择省",
            type: "selector",
            // required: true,
            gIndex: 0,
          },
          {
            name: "city_id",
            label: "",
            placeholder: "请选择市",
            type: "selector",
            // hidden: true,
            gIndex: 0,
          },
          {
            name: "county_id",
            label: "",
            placeholder: "请选择地区",
            type: "selector",
            // hidden: true,
            gIndex: 0,
          },
          {
            name: "business_fields",
            label: "所属领域",
            placeholder: "",
            type: "checkbox",
            required: true,
            data: [
              {
                key: "科技企业",
                value: "科技企业",
              },
              {
                key: "工业企业",
                value: "工业企业",
              },
              {
                key: "服务业企业",
                value: "服务业企业",
              },
              {
                key: "外资企业",
                value: "外资企业",
              },
              {
                key: "服务机构",
                value: "服务机构",
              },
              {
                key: "金融机构",
                value: "金融机构",
              },
              {
                key: "载体平台",
                value: "载体平台",
              },
              {
                key: "高校",
                value: "高校",
              },
              {
                key: "科技院所",
                value: "科技院所",
              },
              {
                key: "其他",
                value: "其他",
              },
            ],
            gIndex: 0,
          },
          {
            name: "copyright_count",
            label: "著作权数量",
            placeholder: "",
            type: "number",
            required: true,
            gIndex: 1,
          },
          {
            name: "patent_count",
            label: "发明专利数量",
            placeholder: "",
            type: "number",
            required: true,
            gIndex: 1,
          },
          {
            name: "trademark_count",
            label: "商标数量",
            placeholder: "",
            type: "number",
            required: true,
            gIndex: 1,
          },
          {
            name: "new_plant_varieties_count",
            label: "植物新品种数量",
            placeholder: "",
            type: "number",
            required: true,
            gIndex: 1,
          },
          {
            name: "integrated_circuit_layout_design_rights_count",
            label: "集成电路布图设计权数量",
            placeholder: "",
            type: "number",
            required: true,
            gIndex: 1,
          },
          {
            name: "talent_situation",
            label: "企业人才情况",
            type: "checkbox",
            required: true,
            data: [
              {
                key: "海外留学",
                value: "海外留学",
              },
              {
                key: "获国家、省市级奖项",
                value: "获国家、省市级奖项",
              },
              {
                key: "大企业高管",
                value: "大企业高管",
              },
              {
                key: "硕士以上学历",
                value: "硕士以上学历",
              },
              {
                key: "大学生创业",
                value: "大学生创业",
              },
            ],
            gIndex: 1,
          },
          {
            name: "last_year_income",
            label: "上年度销售收入（万元）",
            placeholder: "",
            type: "number",
            required: true,
            gIndex: 2,
          },
          {
            name: "equity_financing_amount",
            label: "股权融资（万元）",
            placeholder: "",
            type: "number",
            required: true,
            gIndex: 2,
          },
          {
            name: "debt_financing_amount",
            label: "债权融资（万元）",
            placeholder: "",
            type: "number",
            required: true,
            gIndex: 2,
          },
          // {
          //   name: "test",
          //   label: "上传",
          //   placeholder: "",
          //   type: "upload",
          //   gIndex: 2,
          //   config: {
          //     type: "img",
          //     maxFiles: 1,
          //     maxSizes: 5,
          //     urlShowFiles: api.base.urlDownFile,
          //     urlUpload: api.base.urlUploadFile,
          //     protected: "PUBLIC",
          //   },
          //   value: [],
          // },
        ],
      },
      runtime: {
        loading: false,
        area: {
          province: [],
          city: [],
          county: [],
        },
      },
      enterprise: null,
    };
  },
  methods: {
    getEnterprise() {
      getEnterpriseInfo().then((data) => {
        // console.log(data);
        if (data) {
          data.province_id = data.area.province_id
            ? data.area.province_id
            : null;
          data.city_id = data.area.city_id ? data.area.city_id : null;
          data.county_id = data.area.county_id ? data.area.county_id : null;

          this.enterprise = data;
          // init form data
          this.formConfig.forms.forEach((item) => {
            if (item.type === "datepicker") {
              item.value = data[item.name].substring(0, 10);
            } else {
              item.value = data[item.name];
            }
          });
        }
        this.listArea(-1, "province");

        if (data.province_id) {
          this.listArea(data.province_id, "city");
        }

        if (data.city_id) {
          this.listArea(data.city_id, "county");
        }
      });
    },
    listArea(parentId, type) {
      listArea(parentId).then((data) => {
        let distData = data.map((item) => {
          return {
            value: item.id,
            key: item.region_name,
          };
        });
        this.runtime.area[type] = distData;
        this.$refs.form.dispatchData(`${type}_id`, distData);
      });
    },
    formChange(item) {
      if (item.name === "province_id") {
        this.listArea(item.value, "city");
        this.$refs.form.dispatchData(`county_id`, []);
      }
      if (item.name === "city_id") {
        this.listArea(item.value, "county");
      }
    },
    async doSubmit(type) {
      if (this.runtime.loading) {
        return;
      }

      try {
        let data = await this.$refs.form.validate();
        this.runtime.loading = true;

        data.area = {};
        data.registration_time += "T00:00:00Z";
        data.area.province_id = data.province_id;
        data.area.city_id = data.city_id;
        data.area.county_id = data.county_id;
        data.user_id = this.$utils.getUserInfo().user_id;

        setEnterpriseInfo(data)
          .then(() => {
            let threshold = 70;
            if (type === 2) {
              threshold = 100;
            }
            this.$utils.goNavi(`declarations?threshold=${threshold}`);
          })
          .catch((e) => {
            console.error(e);
            this.runtime.loading = false;
            uni.showToast({
              title: "系统错误，请稍后再试",
              icon: "none",
            });
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
.info {
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}
.btn {
  width: 168px;
}
</style>
