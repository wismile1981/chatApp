<!--
  * @File 基于Antd的显示、下载组件
  * @FileDescription 用于上传的数据显示使用
  * String type: 使用类型 图片、文件、视频或者其他 img||file 默认值: img
  * String(required) src: 组件显示或下载的地址
  * (String, Object) styleFile: 自定义样式
  * String tokenUser: 用户token
  * @click 点击事件
  * @Author 佟春晓
  * @Date 2021-10-29
  * @Update 佟春晓(2021-10-29)
-->
<template>
  <div class="container">
    <!-- 图片类型显示 -->
    <img
      v-if="type === 'img' && strFilePermissionStatus == 'AUTHORIZED'"
      :style="styleFile"
      :title="strFileName"
      :src="showUrl"
      :alt="strFileName"
      @click="handleClick()"
    />
    <!-- 文件类型显示 -->
    <span
      v-else-if="type === 'file'"
      style="cursor: pointer"
      :style="styleFile"
      @click="handleClick()"
      ><slot></slot
    ></span>
    <!-- 视图类型无权限提示 -->
    <div
      class="background-box"
      v-else-if="
        ['img'].includes(type) && strFilePermissionStatus !== 'AUTHORIZED'
      "
      :style="styleFile"
      @click="handleClick()"
    >
      <div class="background-message">
        <span class="background-text">
          {{ tokenUser ? "无权访问该文件" : "该文件需要登录后访问" }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    /* type: 使用类型 图片、文件 img||file */
    type: {
      type: String,
      default: "img",
      validator: (value) => ["img", "file"].includes(value),
    },
    /* src: 组件显示地址 */
    src: {
      type: String,
      required: true,
    },
    /* styleFile: 自定义样式 */
    styleFile: {
      type: [String, Object],
      default: null,
    },
    /* tokenUser: 用户token */
    tokenUser: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showUrl: null, // 文件缓存地址
      strFileName: "", // 文件名称
      strFilePermissionStatus: "AUTHORIZED", // 当前文件权限类型 "NONE" 无 "CHECKING" 申请中 "REJECT" 请求驳回 "AUTHORIZED" 拥有权限
    };
  },
  mounted() {
    // 默认显示时获取图片
    if (["img"].includes(this.type)) this.getFileUrl();
  },
  watch: {
    // 路由变更时 获取图片
    src(value) {
      if (["img"].includes(this.type) && this.src) {
        this.getFileUrl();
      }
    },
  },
  methods: {
    // 点击事件
    handleClick() {
      // 判断是否
      if (this.$listeners["click"]) {
        this.$emit("click");
        return;
      }
      if (["file"].includes(this.type)) this.getFileUrl();
    },
    // 获取文件
    getFileUrl() {
      if (!this.src) return;
      const _this = this;
      const headers = {};
      let strFileName = "";
      if (_this.tokenUser)
        headers["authorization"] = "Bearer " + _this.tokenUser;
      // 根据链接地址 请求文件
      uni.downloadFile({
        url: _this.src,
        method: "GET",
        header: headers,
        success: function (res) {
          if (res.statusCode === 200) {
            // 获取文件名
            strFileName = res.header["Content-Disposition"]
              ? res.header["Content-Disposition"].split("filename=")[1] || ""
              : "";
            const arrStrFileName = strFileName.split(".");
            _this.strFileName = `${decodeURI(arrStrFileName[0])}.${
              arrStrFileName[1]
            }`.replace(/"/g, "");
            // 图片文件显示缓存文件
            if (["img"].includes(_this.type)) {
              _this.showUrl = res.tempFilePath;
            } else {
              // 文本文件直接进行下载
              uni.openDocument({
                filePath: res.tempFilePath,
                showMenu: true,
                fail: function (err) {
                  console.error(err);
                },
              });
            }
          } else if (res.statusCode === 412) {
            uni.request({
              url: res.tempFilePath,
              method: "GET",
              success: function (result) {
                _this.strFilePermissionStatus =
                  result.data.data.permission_status;
                if (_this.type === "file") {
                  uni.showToast({
                    title: "无权访问该文件",
                    icon: "none",
                    duration: 2000,
                  });
                }
              },
              fail: function (err) {
                console.error(err);
              },
            });
          } else {
            console.error(res.errMsg);
          }
        },
        fail: function (err) {
          console.error(err);
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.image {
  width: 100%;
  height: 100%;
}
.background-box {
  background-size: 30rpx 30rpx;
  width: 100%;
  height: 100%;
  text-align: center;
  align-items: center;
  font-size: 24rpx;
  position: relative;
  background-image: linear-gradient(
      45deg,
      var(#ddd) var(25%),
      transparent var(25%),
      transparent var(75%),
      var(#ddd) var(75%)
    ),
    linear-gradient(
      -45deg,
      var(#ddd) var(25%),
      transparent var(25%),
      transparent var(75%),
      var(#ddd) var(75%)
    );
  .background-message {
    background: #fff;
    position: absolute;
    width: 70%;
    padding: 30rpx;
    box-shadow: 0px 0px 24rpx 6rpx rgba(0, 0, 0, 0.3);
    top: 50%;
    left: 50%;
    min-width: 160rpx;
    border-radius: 5px;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    .background-text {
      font-size: 24rpx;
    }
  }
}
</style>
