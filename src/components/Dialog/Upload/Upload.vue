<!--
  * @File 基于Antd的上传组件
  * @FileDescription 上传
  * value: 默认值 列表 'object_name, path, url 需要传值其中的一个' 'fileName, file_name, name, object_name 需要传值其中的一个 [{},{},{}]
  * String(required) urlShowFiles: 文件显示的url
  * String(required) urlUpload: 文件上传的的url
  * String type: 使用类型 图片或者文件 可选值 'img', 'file' 默认值img
  * Number maxFiles: 最大上传数量 默认值 5
  * Number maxSizes 最大单个文件上传大小 单位:MB 默认值 10
  * Array verifyType 验证类型 用于限制上传文件类型 传值文件类型或者后缀
  * String protected: 权限 PUBLIC(默认) 公开  所有用户均可访问 PROTECTED 受保护的  上传文件的用户可直接访问，运营人员可通过权限申请进行访问'
  * String tokenUser: 用户token 权限为保护的情况下必传
  * Array resultFormat: 返回值格式 可选值: 'uid', 'fileName', 'file_name', 'icon', 'name', 'object_name', 'path', 'status', 'thumbUrl', 'type' 其中若需要type类型 默认赋值时需要传值
  * @slot 增加显示位插槽和上传样式插槽
  * uploadImgView 图片按钮插槽 直接插入图片按钮样式 示例 <view slot="uploadImgView">插槽选择图片</view>
  * uploadFileView 文件按钮插槽 直接插入文件按钮样式 示例 <view slot="uploadFileView">插槽选择文件</view>
  * uploadImgShow 图片显示插槽 显示图片列表中每一个的样式 注解：可以调用组件内删除函数进行删除操作 示例：
                              插槽样式
                              <template v-slot:uploadImgShow="{ index, item }">
                                <view>
                                  插槽： 文件名称：{{ item.file_name }} 文件后端编码: {{ item.object_name }} 文件索引: {{index}}
                                </view>
                                <view @click='deleteImg(index)'>
                                  删除
                                </view>
                              </template>
                              插槽删除事件
                              deleteImg (index) {
                                this.$refs.uploadImg.deleteFileList(index)
                              }
  * uploadFileShow 文件显示插槽 使用方式同图片插槽
  * @Author 佟春晓
  * @Date 2021-10-29
  * @Update 佟春晓(2021-10-29)
-->
<template>
  <div>
    <view>
      <view class="uni-uploader-body">
        <view class="uni-uploader__files" v-if="'img' === type">
          <block v-for="(item, index) in listFiles" :key="index">
            <slot name="uploadImgShow" :item="item" :index="index">
              <view class="uni-uploader__file" style="position: relative">
                <uni-icons
                  type="clear"
                  color="red"
                  size="28"
                  @tap="deleteFileList(index)"
                  class="uni-uploader__del"
                />
                <image
                  class="uni-uploader__img"
                  :src="item.thumbUrl"
                  :data-src="item.thumbUrl"
                  @tap="handlePreview"
                ></image>
              </view>
            </slot>
          </block>
          <view v-if="listFiles.length < maxFiles" @tap="beforeImgUpload">
            <slot name="uploadImgView">
              <view class="uni-uploader__input-box">
                <view class="uni-uploader__input"></view>
              </view>
            </slot>
          </view>
        </view>
        <view class="uni-uploader" v-if="'file' === type">
          <view
            class="uni-uploader-file__input-box"
            v-if="listFiles.length < maxFiles"
            @tap="beforeImgUpload"
          >
            <slot name="uploadFileView">
              <view class="uni-uploader-file__input"> 选择文件 </view>
            </slot>
          </view>
          <block v-for="(item, index) in listFiles" :key="index">
            <slot name="uploadFileShow" :item="item" :index="index">
              <view class="uni-uploader-file__file" style="position: relative">
                <text class="uni-uploader-file__text">{{
                  item.file_name
                }}</text>
                <uni-icons
                  type="trash-filled"
                  color="blue"
                  size="20"
                  @tap="deleteFileList(index)"
                  class="uni-uploader-file__del"
                />
              </view>
            </slot>
          </block>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
import SparkMD5 from "./Static/spark-md5.min.js";
// import getSvgIcon from './static/iconsvg'
// import ShowFile from './ShowFile'
export default {
  components: {
    // ShowFile
  },
  props: {
    // 默认值
    value: {
      type: Array,
      default: () => [],
    },
    /* 文件显示的url */
    urlShowFiles: {
      type: String,
      default: "",
      required: true,
    },
    /* 文件上传的的url */
    urlUpload: {
      type: String,
      default: "",
      required: true,
    },
    /* 使用类型 图片或者文件 'img', 'file' */
    type: {
      type: String,
      default: "img",
      validator: (value) => ["img", "file"].includes(value),
    },
    /* 用户token 权限为保护的情况下必传 */
    tokenUser: {
      type: String,
      default: "",
    },
    /* 最大上传数量 */
    maxFiles: {
      type: Number,
      default: 5,
    },
    /* 最大单个文件上传大小 单位:MB */
    maxSizes: {
      type: Number,
      default: 10,
    },
    /* 验证类型  用于限制上传文件类型 传值文件类型或者后缀 */
    verifyType: {
      type: Array,
      default: null,
    },
    /* 权限 PUBLIC 公开  所有用户均可访问 PROTECTED 受保护的  上传文件的用户可直接访问，运营人员可通过权限申请进行访问 */
    protected: {
      type: String,
      default: "PUBLIC",
    },
    /* 返回值格式 可选值: 'uid', 'fileName', 'file_name', 'icon', 'name', 'object_name', 'path', 'status', 'thumbUrl', 'type' 其中若需要type类型 默认赋值时需要传值 */
    resultFormat: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isBeforeSure: false,
      isPreviewVisible: false,
      urlPreviewFiles: "",
      listFiles: [],
      strFileName: "",
      objFileFormat: {
        uid: "",
        fileName: "",
        file_name: "",
        name: "",
        object_name: "",
        path: "",
        status: "",
        thumbUrl: "",
      },
    };
  },
  created() {},
  mounted() {
    // 默认有数据 进行默认处理并赋值
    if (this.value.length > 0) {
      this.setFileDefult(this.value).then((list) => {
        this.listFiles = list;
      });
    }
  },
  methods: {
    // 图片上传
    sendMainFiles(file) {
      /* 表单方式提交 const formData = new FormData() formData.append('upload', file); 留存 后期增加 */
      const _this = this;
      // 获取文件和MD5文件加密
      this.setFilesMD5(file, (objFile) => {
        // 上传请求接口
        this.getSendFilesMessage(objFile)
          .then((item) => {
            // 判断文件是否已经存在
            if (item.upload_url) {
              // 文件未上传 则上传文件
              this.sendFiles(item, objFile)
                .then((result) => {
                  _this.finshSendFile(item, file);
                })
                .catch((e) => {
                  _this.changeFiles({ file: {}, fileList: {} });
                });
            } else {
              // 文件存在 则复用当前文件
              _this.finshSendFile(item, file);
            }
          })
          .catch((e) => {
            console.error("error:");
            console.error(e);
            _this.changeFiles({ file: {}, fileList: {} });
          });
      });
    },
    // 触发上传事件
    customImgRequest(file) {
      this.sendMainFiles(file);
    },
    // 上传状态改变
    changeFiles(info) {
      // 将当前文件列表数据 赋值到控件状态
      const fileList = (info.fileList = this.listFiles);
      this.listFiles = info.fileList = this.setFileList(fileList);
      this.$emit("setImgList", this.listFiles);
    },
    // 验证文件
    verifyFile(file) {
      const arrTypeSuffix = file.path.split(".");
      const typeSuffix = arrTypeSuffix[arrTypeSuffix.length - 1];
      // 自定义的后缀验证
      if (this.verifyType !== null) {
        if (!this.verifyType.includes(typeSuffix)) {
          return "只能上传" + this.verifyType.join(",") + "格式的文件";
        }
        // 如果没有自定义 则根据组件类型进行验证
      } else {
        // 图片类型验证
        if (this.type === "img") {
          if (!["jpeg", "png", "jpg"].includes(typeSuffix)) {
            return "只能上传jpeg,png,jpg格式的图片";
          }
          // 文件类型验证
        } else if (this.type === "file") {
          if (
            !["txt", "doc", "docx", "xls", "xlsx", "pptx", "pdf"].includes(
              typeSuffix
            )
          ) {
            return "只能上传txt,doc,xls,pdf格式的文档";
          }
        }
      }
      // 文件大小验证
      const isLt2M = file.size / 1024 / 1024;
      if (isLt2M > this.maxSizes) {
        return "文件大小不能超过" + this.maxSizes + "M!";
      }
      return "";
    },
    // 图片 文件上传之前验证
    beforeImgUpload(file) {
      const _this = this;
      // #ifdef MP-WEIXIN
      const funChoosePlm = (obj) => wx.chooseMessageFile(obj);
      // #endif
      // #ifndef MP-WEIXIN
      const funChoosePlm = (obj) => wx.chooseFile(obj);
      // #endif
      const funChooseType = ["img"].includes(this.type)
        ? (obj) => uni.chooseImage(obj)
        : (obj) => funChoosePlm(obj);
      funChooseType({
        count:
          this.maxFiles - this.listFiles.length > 9
            ? 9
            : this.maxFiles - this.listFiles.length,
        success: (res) => {
          // 上传验证
          let err = "";
          for (let i = 0; i < res.tempFiles.length; i++) {
            err = this.verifyFile(res.tempFiles[i]);
            if (err) break;
          }
          if (!err) {
            for (let i = 0; i < res.tempFiles.length; i++) {
              this.customImgRequest(res.tempFiles[i]);
            }
          } else {
            uni.showToast({
              title: err,
              icon: "none",
              duration: 2000,
            });
          }
        },
        fail: (err) => {
          // #ifdef APP-PLUS
          if (err["code"] && err.code !== 0 && this.sourceTypeIndex === 2) {
            this.checkPermission(err.code);
          }
          // #endif
          // #ifdef MP
          if (err.errMsg.indexOf("cancel") !== "-1") {
            return;
          }
          uni.getSetting({
            success: (res) => {
              let authStatus = false;
              switch (this.sourceTypeIndex) {
                case 0:
                  authStatus = res.authSetting["scope.camera"];
                  break;
                case 1:
                  authStatus = res.authSetting["scope.album"];
                  break;
                case 2:
                  authStatus =
                    res.authSetting["scope.album"] &&
                    res.authSetting["scope.camera"];
                  break;
                default:
                  break;
              }
              if (!authStatus) {
                uni.showModal({
                  title: "授权失败",
                  content:
                    "Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限",
                  success: (res) => {
                    if (res.confirm) {
                      uni.openSetting();
                    }
                  },
                });
              }
            },
          });
          // #endif
        },
      });
    },
    // 删除文件
    deleteFileList(index) {
      this.listFiles.splice(index, 1);
    },
    // 预览
    handlePreview(e) {
      if ((this.type = "img")) {
        var current = e.target.dataset.src;
        uni.previewImage({
          current: current,
          urls: this.listFiles.map((v) => v.thumbUrl),
        });
      }
    },
    /* 转换文件格式
     * 将文件转格式转换为原始文件格式、MD5格式、buffer格式。
     * @param {file} 文件
     * @param {function} 转换完成后的回调函数
     * @param {number=} p3 参数3的说明（可选）
     * @callback {Object} {md5File: MD5文件格式,bufferFile: buffer文件格式,file: 文件格式}
     */
    setFilesMD5(file, callbackFunction) {
      uni.getFileSystemManager().readFile({
        filePath: file.path, //选择图片返回的相对路径
        success: (res) => {
          var spark = new SparkMD5.ArrayBuffer();
          spark.append(res.data);
          callbackFunction({
            md5File: spark.end(false),
            bufferFile: res.data,
            file: file,
          });
        },
      });
    },
    // 获取上传文件信息请求接口
    getSendFilesMessage(objFile) {
      const _this = this;
      return new Promise((resolve, reject) => {
        const headers = {
          credentials: "same-origin",
          "content-type": "application/json",
        };
        if (_this.protected !== "PUBLIC" && !_this.tokenUser) {
          uni.showToast({
            title: "上传私密文件需要登录后上传",
            icon: "none",
            duration: 2000,
          });
          reject(new Error("上传私密文件需要登录后上传"));
          return;
        }
        if (_this.tokenUser) {
          headers["authorization"] = "Bearer " + _this.tokenUser;
        }
        let name = objFile.file.name;
        if (!name) {
          const arrTypeSuffix = objFile.file.path.split(".");
          const typeSuffix = arrTypeSuffix[arrTypeSuffix.length - 1];
          name = this.generateUUID() + "." + typeSuffix;
        }
        uni.request({
          url: _this.urlUpload,
          method: "POST",
          header: headers,
          data: {
            md5: objFile.md5File,
            file_name: name,
            file_size: objFile.file.size,
            protected_level: _this.protected,
          },
          success: (res) => {
            if (res.statusCode == 200) {
              resolve(res.data.data);
            } else {
              reject(res);
            }
          },
          fail: (res) => {
            reject(res);
          },
        });
      });
    },
    // 上传文件
    sendFiles(item, objFile) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: item.upload_url,
          filePath: objFile.file.path,
          method: "PUT",
          name: "file",
          header: item.headers,
          data: objFile.bufferFile,
          success: (res) => {
            if (res.statusCode == 200) {
              resolve(res.data.data);
            } else {
              reject(res);
            }
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
    // 文件上传成功
    async finshSendFile(item, file) {
      file.file_name = item.file_name;
      file.object_name = item.object_name;
      file.status = "done";
      // 获取唯一Id
      file.uid = this.generateUUID();
      // 如果是图片或者是视频 生成缓存缩略图
      if (this.type === "img") {
        file.thumbUrl = file.path;
      }
      this.listFiles = [...this.listFiles, file];
      const info = { file: file, fileList: this.listFiles };
      this.changeFiles(info);
    },
    // 创建UUID
    generateUUID() {
      var d = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    // 设置文件信息
    setFileList(fileList) {
      for (var i in fileList) {
        if (fileList[i].status === "done") {
          // if (!fileList[i].type) { continue }
          var url = this.urlShowFiles + fileList[i].object_name;
          if (["img"].includes(this.type)) {
            fileList[i].url = url;
          }
          fileList[i].path = url;
          fileList[i].fileName = fileList[i].file_name;
        }
      }
      return fileList;
    },
    // 设置文件默认值
    async setFileDefult(list) {
      const listDefult = [];
      for (var value of list) {
        const objItem = value;
        if (
          !objItem["fileName"] &&
          !objItem["file_name"] &&
          !objItem["name"] &&
          !objItem["object_name"]
        ) {
          console.error(
            "fileName, file_name, name, object_name 需要传值其中的一个"
          );
          return;
        }
        if (!objItem["object_name"] && !objItem["path"] && !objItem["url"]) {
          console.error("object_name, path, url 需要传值其中的一个");
          return;
        }
        const item = await this.getFileUrl(
          this.urlShowFiles + objItem["object_name"] ||
            objItem["path"] ||
            objItem["url"]
        );
        for (var index in this.objFileFormat) {
          if (!objItem[index]) {
            switch (index) {
              case "fileName":
                objItem[index] =
                  objItem["file_name"] || objItem["name"] || item.fileName;
                break;
              case "file_name":
                objItem[index] =
                  objItem["fileName"] || objItem["name"] || item.fileName;
                break;
              case "name":
                objItem[index] =
                  objItem["fileName"] || objItem["file_name"] || item.fileName;
                break;
              case "status":
                objItem[index] = "done";
                break;
              case "uid":
                objItem[index] = this.generateUUID();
                break;
              case "object_name":
                objItem[index] = "";
                break;
              case "path":
                objItem[index] =
                  objItem["url"] || this.urlShowFiles + objItem["object_name"];
                break;
              case "url":
                objItem[index] =
                  objItem["path"] || this.urlShowFiles + objItem["object_name"];
                break;
              case "thumbUrl":
                if (this.type === "img") {
                  objItem[index] = item.src;
                }
                break;
            }
          }
        }
        listDefult.push(objItem);
      }
      return listDefult;
    },
    // 下载文件 获取当前文件信息
    getFileUrsl(srcFile) {
      return new Promise((resolve, reject) => {
        if (!srcFile) {
          resolve("没有文件路径");
          return;
        }
        const headers = {};
        const item = {};
        let strFileName = "";
        if (this.tokenUser)
          headers["authorization"] = "Bearer " + this.tokenUser;
        fetch(srcFile, {
          method: "GET",
          headers: headers,
          responseType: "blob",
        })
          .then((res) => {
            const name = res.headers.get("Content-Disposition");
            strFileName = name
              ? name.split("filename=")[1]
              : this.generateUUID() + ".txt";
            strFileName = strFileName.replace(/"/g, "");
            const arrStrFileName = strFileName.split(".");
            item.fileName = `${decodeURI(arrStrFileName[0])}.${
              arrStrFileName[1]
            }`;
            return res.blob();
          })
          .then((blob) => {
            const _URL = window.URL || window.webkitURL;
            item.src = _URL.createObjectURL(blob);
            resolve(item);
          });
      });
    },

    // 获取文件
    getFileUrl(srcFile) {
      return new Promise((resolve, reject) => {
        if (!srcFile) {
          reject("没有文件路径");
          return;
        }
        const _this = this;
        const headers = {};
        const item = {};
        let strFileName = "";
        if (_this.tokenUser)
          headers["authorization"] = "Bearer " + _this.tokenUser;
        // 根据链接地址 请求文件
        uni.downloadFile({
          url: srcFile,
          method: "GET",
          header: headers,
          success: function (res) {
            if (res.statusCode === 200) {
              const name = res.header["Content-Disposition"]
                ? res.header["Content-Disposition"].split("filename=")[1] || ""
                : "";
              strFileName = name || this.generateUUID() + ".txt";
              strFileName = strFileName.replace(/"/g, "");
              const arrStrFileName = strFileName.split(".");
              item.fileName = `${decodeURI(arrStrFileName[0])}.${
                arrStrFileName[1]
              }`;
              item.src = res.tempFilePath;
              resolve(item);
            } else if (res.statusCode === 412) {
              uni.showToast({
                title: "您操作的文件中，有无权访问的私密文件，请更换账号操作",
                icon: "none",
                duration: 2000,
              });
            } else {
              console.error(res.errMsg);
            }
          },
          fail: function (err) {
            console.error(err);
          },
        });
      });
    },
    async checkPermission(code) {
      let type = code ? code - 1 : this.sourceTypeIndex;
      let status = permision.isIOS
        ? await permision.requestIOS(sourceType[type][0])
        : await permision.requestAndroid(
            type === 0
              ? "android.permission.CAMERA"
              : "android.permission.READ_EXTERNAL_STORAGE"
          );
      if (status === null || status === 1) {
        status = 1;
      } else {
        uni.showModal({
          content: "没有开启权限",
          confirmText: "设置",
          success: function (res) {
            if (res.confirm) {
              permision.gotoAppSetting();
            }
          },
        });
      }
      return status;
    },
  },
  watch: {
    // 监听组件默认值
    value(list) {
      if (this.listFiles.length !== list.length) {
        this.setFileDefult(list).then((r) => {
          this.listFiles = r;
        });
      }
    },
    // 当前值改变时给组件赋值
    listFiles(list) {
      // 是否为初始化值
      let listNew = [];
      // 按照需求格式 格式化当前返回值
      if (this.resultFormat.length > 0) {
        list.forEach((item) => {
          var objItemNew = {};
          for (var i in item) {
            if (this.resultFormat.includes(i)) {
              objItemNew[i] = item[i];
            }
          }
          listNew.push(objItemNew);
        });
      } else {
        listNew = list;
      }
      this.$emit("input", listNew);
      this.$emit("change", listNew);
    },
  },
};
</script>
<style scoped>
@import "/static/css/uni.css";
.uni-uploader__del {
  position: absolute;
  right: -2rpx;
  top: -4rpx;
}
.uni-uploader-file__input-box {
  position: relative;
  margin: 10rpx;
  width: 208rpx;
  height: 48rpx;
  line-height: 46rpx;
}
.uni-uploader-file__input {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #333333;
  text-align: center;
  font-size: 24rpx;
  border: 2rpx solid #d9d9d9;
}
.uni-uploader-file__file {
  margin: 10rpx;
}
.uni-uploader-file__text {
  text-align: left;
  font-size: 30rpx;
}
.uni-uploader-file__del {
  position: absolute;
  right: 0;
}
</style>