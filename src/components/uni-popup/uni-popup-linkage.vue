<template>
	<view class="uni-popup-dialog">
		<view class="uni-dialog-title">
			<text class="uni-dialog-title-text">三级联动</text>
		</view>
  
		<view class="uni-dialog-content">
      <view class="screen-container">
        <view class="flex-middle search-item">
          <text>园区名称</text>
          <view class="value">
            <picker class="select"
                    mode="selector"
                    range-key="park_name"
                    :range="parksList"
                    :value="searchData.parkIndex"
                    @change="PickerChange($event, 'park')"
            >
              <view>{{parksList[searchData.parkIndex].park_name}}</view>
            </picker>
          </view>
        </view>
        <view class="flex-middle search-item">
          <text>楼栋名称</text>
          <view class="value">
            <picker class="select"
                    mode="selector"
                    range-key="building_name"
                    :range="buildingList"
                    :value="searchData.buildingIndex"
                    @change="PickerChange($event,'building')">
              <view>{{buildingList[searchData.buildingIndex].building_name}}</view>
            </picker>
          </view>
        </view>
        <view class="flex-middle search-item">
          <text>楼层编号</text>
          <view class="value">
            <picker class="select"
                    mode="selector"
                    range-key="floor_name"
                    :range="floorList"
                    :value="searchData.floorIndex"
                    @change="PickerChange($event,'floor')">
              <view>{{floorList[searchData.floorIndex].floor_name}}</view>
            </picker>
          </view>
        </view>
      </view>
		</view>
  
		<view class="uni-dialog-button-group">
			<view class="uni-dialog-button" @click="close">
				<text class="uni-dialog-button-text">取消</text>
			</view>
			<view class="uni-dialog-button uni-border-left" @click="onOk">
				<text class="uni-dialog-button-text uni-button-color">确定</text>
			</view>
		</view>

	</view>
</template>

<script>
  import { getParkList, getBuildingList, getFloorList } from '@/api/customer';
	/**
	 * PopUp 弹出层-对话框样式
	 * @description 弹出层-对话框样式
	 * @tutorial https://ext.dcloud.net.cn/plugin?id=329
	 * @property {String} value input 模式下的默认值
	 * @property {String} placeholder input 模式下输入提示
	 * @property {String} type = [success|warning|info|error] 主题样式
	 *  @value success 成功
	 * 	@value warning 提示
	 * 	@value info 消息
	 * 	@value error 错误
	 * @property {String} mode = [base|input] 模式、
	 * 	@value base 基础对话框
	 * 	@value input 可输入对话框
	 * @property {String} content 对话框内容
	 * @property {Boolean} beforeClose 是否拦截取消事件
	 * @event {Function} confirm 点击确认按钮触发
	 * @event {Function} close 点击取消按钮触发
	 */

	export default {
		name: "pickerDialog",
		data() {
			return {
        parksList: [
          {
            id: 0,
            park_name: '请选择'
          }
        ],
        buildingList:[{ id:0, building_name:"请选择" }],
        floorList:[{ id:0, floor_name:"请选择" }],
        multiArray: [],
        multiIndex: [0, 0, 0],
        searchData: {
          houseTypeIndex: 0,
          parkIndex: 0,
          buildingIndex: 0,
          floorIndex: 0
        }
      }
		},
		watch: {},
		created() {},
		mounted() {
		  this.getPark()
    },
		methods: {
      // 获取楼层列表
      getFloor () {
        const _this = this
        const params = {}
        params.building_id = _this.buildingList[_this.searchData.buildingIndex].id // 园区id
        params.building_name = _this.buildingList[_this.searchData.buildingIndex].building_name // 园区名称
        params.page_index = 1 // 当前页数
        params.page_size = 999 // 查询记录条数
        getFloorList(params).then(res => {
          if (res.message) {
            uni.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          } else {
            _this.floorList = _this.floorList.concat(res.data)
          }
        })
      },
      // 运维获取楼栋列表
      getBuilding () {
        const _this = this
        const params = {}
        params.park_id = _this.parksList[_this.searchData.parkIndex].id // 园区id
        params.park_name = _this.parksList[_this.searchData.parkIndex].park_name // 园区名称
        params.page_index = 1 // 当前页数
        params.page_size = 999 // 查询记录条数
        getBuildingList(params).then(res => {
          if (res.message) {
            uni.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          } else {
            _this.buildingList = _this.buildingList.concat(res.data)
          }
        })
      },
      // 运维获取工位列表
      getPark () {
        const _this = this
        const params = {}
        params.org_id = 2
        params.page_index = 1 // 当前页数
        params.page_size = 999 // 查询记录条数
        getParkList(params).then(res => {
          if (res.message) {
            uni.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          } else {
            _this.parksList = _this.parksList.concat(res.data)
            _this.multiArray[0] = res.data
            _this.getBuilding()
          }
        })
      },
      /**
       * 选择发生改变时
       */
      PickerChange (e, type) {
        const _this = this
        switch (type) {
          case 'park':
            _this.searchData.parkIndex = e.target.value
            _this.buildingList = [{ id:0, building_name:"请选择" }]
            _this.searchData.buildingIndex = 0
            setTimeout(() => {
              _this.getBuilding()
            }, 10)
            break
          case 'building':
            _this.searchData.buildingIndex = e.target.value
            _this.floorList = [{ id:0, building_name:"请选择" }]
            _this.searchData.buildingIndex = 0
            _this.getFloor()
            break
          case 'floor':
            _this.searchData.buildingIndex = e.target.value
            break
        }
      },
			/**
			 * 点击确认按钮
			 */
			onOk() {
				this.$emit('pickerConfirm')
			},
			/**
			 * 点击取消按钮
			 */
			close() {
        this.$emit('pickerClose')
			}
		}
	}
</script>

<style lang="scss">
  @import "./static/css/common"; /* 通用组件、模板样式库，可以当作一套ui库应用 */
</style>
<style lang="scss" scoped>
  .search-item{
    margin-top: 20rpx;
    .key{
      font-size: 12px;
      line-height: 8vw;
    }
    .value{
      flex: 1;
      width: 100%;
      font-size: 12px;
      line-height: 8vw;
      border: #DDDDDD solid 1upx;
      padding: 0 10upx;
      margin-left: 10upx;
    }
  }
	.uni-popup-dialog {
		width: 300px;
		border-radius: 15px;
		background-color: #fff;
	}

  .screen-container {
    width: 100%;
  }
  
	.uni-dialog-title {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		padding-top: 15px;
		padding-bottom: 5px;
	}

	.uni-dialog-title-text {
		font-size: 16px;
		font-weight: 500;
	}

	.uni-dialog-content {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 5px 15px 15px 15px;
	}

	.uni-dialog-content-text {
		font-size: 14px;
		color: #6e6e6e;
	}

	.uni-dialog-button-group {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		border-top-color: #f5f5f5;
		border-top-style: solid;
		border-top-width: 1px;
	}

	.uni-dialog-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 45px;
	}

	.uni-border-left {
		border-left-color: #f0f0f0;
		border-left-style: solid;
		border-left-width: 1px;
	}

	.uni-dialog-button-text {
		font-size: 14px;
	}

	.uni-button-color {
		color: #007aff;
	}

	.uni-dialog-input {
		flex: 1;
		font-size: 14px;
	}

	.uni-popup__success {
		color: #4cd964;
	}

	.uni-popup__warn {
		color: #f0ad4e;
	}

	.uni-popup__error {
		color: #dd524d;
	}

	.uni-popup__info {
		color: #909399;
	}
</style>