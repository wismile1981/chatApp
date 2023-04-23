<template>
  <view class="dyn-form">
    <view v-for="(g, gIndex) in config.groups" :key="gIndex">
      <view class="group-title" :key="gIndex">{{ g }}</view>
      <view class="form-box">
        <template v-for="(item, index) in config.forms">
          <view
            class="line-input flex-row justify-between items-center"
            :class="[
              item.required ? 'required' : '',
              item.type === 'textarea' ? 'flex-wrap' : '',
            ]"
            :key="index"
            v-if="item.gIndex === gIndex"
            @click="clickLabel(index)"
            v-show="!item.hidden"
          >
            <template v-if="item.type === 'text'">
              <text class="label">{{ item.label }}</text>
              <input
                type="text"
                class="input flex1"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :focus="index === runtime.focus"
                v-model.trim="item.value"
                @change="changeValue(index, $event)"
              />
            </template>
            <template v-if="item.type === 'number'">
              <text class="label">{{ item.label }}</text>
              <input
                type="number"
                class="input flex1"
                v-model.trim="item.value"
                :disabled="item.disabled"
                :focus="index === runtime.focus"
                :placeholder="item.placeholder"
                @change="changeValue(index, $event)"
              />
            </template>
            <template v-if="item.type === 'tel'">
              <text class="label">{{ item.label }}</text>
              <input
                type="tel"
                class="input flex1"
                v-model.trim="item.value"
                :placeholder="item.placeholder"
                :disabled="item.disabled"
                :focus="index === runtime.focus"
                @change="changeValue(index, $event)"
              />
            </template>
            <template v-if="item.type === 'digit'">
              <text class="label">{{ item.label }}</text>
              <input
                type="digit"
                class="input flex1"
                v-model.trim="item.value"
                :disabled="item.disabled"
                :focus="index === runtime.focus"
                :placeholder="item.placeholder"
                @change="changeValue(index, $event)"
              />
            </template>
            <template v-if="item.type === 'idcard'">
              <text class="label">{{ item.label }}</text>
              <input
                type="idcard"
                class="input flex1"
                v-model.trim="item.value"
                :disabled="item.disabled"
                :focus="index === runtime.focus"
                :placeholder="item.placeholder"
                @change="changeValue(index, $event)"
              />
            </template>
            <template v-if="item.type === 'textarea'">
              <text class="label">{{ item.label }}</text>
              <textarea
                class="textarea"
                v-model.trim="item.value"
                :disabled="item.disabled"
                :focus="index === runtime.focus"
                :placeholder="item.placeholder"
                @change="changeValue(index, $event)"
              ></textarea>
            </template>
            <template v-if="item.type === 'selector'">
              <text class="label">{{ item.label }}</text>
              <picker
                mode="selector"
                :range="item.data"
                range-key="key"
                :value="item.activeIndex"
                class="flex1"
                :disabled="item.disabled"
                @change="changeValue(index, $event)"
              >
                <view class="input">{{
                  item.activeIndex >= 0
                    ? item.data[item.activeIndex].key
                    : item.placeholder || "请选择"
                }}</view>
                <!-- <view class="input">{{ item.placeholder }}</view> -->
              </picker>
            </template>
            <template v-if="item.type === 'datepicker'">
              <text class="label">{{ item.label }}</text>
              <picker
                mode="date"
                class="flex1"
                :value="item.value"
                :start="item.config.start"
                :end="item.config.end"
                :fields="item.config.fields"
                :disabled="item.disabled"
                @change="changeValue(index, $event)"
              >
                <view class="input">{{
                  item.value ? item.value : item.placeholder || "请选择"
                }}</view>
              </picker>
            </template>
            <template v-if="item.type === 'checkbox'">
              <text class="label">{{ item.label }}</text>
              <view class="uni-list">
                <checkbox-group @change="changeValue(index, $event)">
                  <label
                    class="uni-list-cell uni-list-cell-pd flex-row"
                    v-for="(k, kindex) in item.data"
                    :key="kindex"
                  >
                    <view>
                      <checkbox :value="k.value" :checked="k.checked" />
                    </view>
                    <view>{{ k.key }}</view>
                  </label>
                </checkbox-group>
              </view>
            </template>
            <template v-if="item.type === 'upload'">
              <text class="label">{{ item.label }}</text>
              <upload
                :tokenUser="$utils.getToken()"
                :maxFiles="item.config.maxFiles"
                :type="item.config.type"
                :urlShowFiles="item.config.urlShowFiles"
                :urlUpload="item.config.urlUpload"
                :maxSizes="item.config.maxSizes"
                :protected="item.config.protected"
                :resultFormat="item.config.resultFormat"
                v-model="item.value"
                :ref="item.name"
                @change="changeValue(index, $event)"
              ></upload>
            </template>
            <text class="unit" v-if="item.unit">{{ item.unit }}</text>
            <uni-icons
              v-if="['selector', 'datepicker'].includes(item.type)"
              type="right"
              class="icon"
              color="#CECECE"
              size="12"
            ></uni-icons>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import Upload from "@/components/Dialog/Upload/Upload.vue";
export default {
  name: "dynForm",
  components: { Upload },
  props: {
    formConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  watch: {
    formConfig: {
      handler() {
        let config = JSON.parse(JSON.stringify(this.formConfig));
        config.forms.forEach((item) => {
          this.initItem(item);
        });
        this.config = config;
        // console.log(config);
      },
      immediate: true,
    },
  },
  data() {
    return {
      config: {},
      presets: {
        email:
          /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
        mobile: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/,
      },
      runtime: {
        focus: null,
      },
    };
  },
  methods: {
    changeValue(index, e) {
      // console.log(e);
      const item = this.config.forms[index];
      if (item.type === "selector") {
        item.activeIndex = e.target.value;
        item.value = item.data[item.activeIndex].value;
      } else if (["datepicker", "timepicker", "checkbox"].includes(item.type)) {
        item.value = e.target.value;
        if (item.value && item.placeholder !== " ") {
          item.placeholder = " ";
        }
      }
      this.$emit("change:value", {
        name: item.name,
        value: item.value,
      });
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.config.forms.forEach((item) => {
          let required = item.required;
          let rules = item.rules;

          if (required && item.value === "") {
            reject(`请填写 ${item.label}`);
          } else if (item.value !== "" && rules) {
            rules.forEach((r) => {
              if (!this.presets[r.preset].test(item.value)) {
                reject(item.label + " " + r.msg);
              }
            });
          }
        });
        resolve(this.collectData());
      });
    },
    initItem(item) {
      if (typeof item.value === "undefined") {
        item.value = "";
      }
      if (
        ["selector", "checkbox"].includes(item.type) &&
        (!item.data || !item.data.length)
      ) {
        item.data = [];
        item.hidden = true;
      } else {
        item.hidden = false;
      }

      if (item.type === "selector") {
        item.activeIndex = item.data.findIndex((d) => {
          return d.value == item.value;
        });
      }
      if (item.type === "checkbox") {
        item.data.forEach((ch) => {
          if (item.value.includes(ch.value)) {
            ch.checked = true;
          }
        });
      }
    },
    collectData() {
      const forms = this.config.forms;
      let data = {};
      forms.forEach((item) => {
        data[item.name] = item.value;
      });
      return data;
    },
    dispatchData(itemName, data, value) {
      // console.log(this.config.forms);
      if (!itemName || !data) {
        return;
      }
      const forms = this.config.forms;

      let item = forms.find((f) => {
        return f.name === itemName;
      });
      if (item) {
        item.data = data;
        item.value = typeof value === "undefined" ? item.value : value;
        this.initItem(item);
      }
    },
    clickLabel(index) {
      let item = this.config.forms[index];
      if (
        !["selector", "datepicker", "timpicker", "checkbox", "upload"].includes(
          item.type
        ) &&
        !item.disabled
      ) {
        this.runtime.focus = index;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.group-title {
  font-size: 16px;
  font-weight: 600;
  color: #222222;
  line-height: 2;
}
.form-box {
  padding: 0 16px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;

  .line-input {
    min-height: 54px;
    box-sizing: border-box;
    padding: 12px;
    color: #222;
    font-size: 16px;
    position: relative;
    .input {
      text-align: right;
    }
    label {
      padding: 4px 0;
      min-width: 175px;
    }
    .textarea {
      background: #f6f7f8;
      margin-top: 5px;
      padding: 6px;
    }
    &:nth-of-type(n + 2) {
      border-top: #f0f0f0 1px solid;
    }
    &.required {
      &::before {
        content: "*";
        position: absolute;
        color: #f00;
        left: 0;
      }
    }
    &.error {
      .label {
        color: #f00;
      }
    }
    .unit,
    .icon {
      justify-self: flex-end;
      font-size: 12px;
      margin-left: 4px;
    }
  }
}
</style>
