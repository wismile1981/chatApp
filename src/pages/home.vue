<template>
  <view class="uni-container">
    <scroll-view
      ref="scrollview"
      scroll-y="true"
      class="thread"
    >
      <view class="scroll-view-content">
        <view
          v-for="(item, index) in thread"
          :key="index"
          :class="item.role"
          class="content"
        >
          <mp-html :content="item.content" :markdown="true" :selectable="true" />
        </view>
      </view>
    </scroll-view>
    <view class="inputer">
      <uni-search-bar
        class="search-bar"
        placeholder="请输入"
        radius="5"
        v-model="inputer"
        @confirm="sendMessage"
      >
        <uni-icons
          slot="searchIcon"
          color="#999999"
          size="18"
          type="chatboxes-filled"
        />
      </uni-search-bar>
    </view>
  </view>
</template>

<script>
import { login, completions } from '@/api/mpApi.js'
import mpHtml from 'mp-html/dist/uni-app/components/mp-html/mp-html'
import short from 'short-uuid'
import uniIcons from '../uni_modules/uni-icons/components/uni-icons/uni-icons.vue'

export default {
  components: { uniIcons, mpHtml },
  data() {
    return {
      user: {
        username: '',
        token: '',
        ts: new Date().getTime()
      },
      thread: [],
      inputer: ''
    }
  },
  onLoad() {
    this.login()
  },
  computed: {},
  methods: {
    async login() {
      if (uni.getStorageSync('user')) {
        this.user = JSON.parse(uni.getStorageSync('user'))
        if(new Date().getTime() - this.user.ts > 8*3600*1000) {
          await this.doLogin()
        }
      } else {
        this.user.username = short().new()
        await this.doLogin()
      }
    },
    async doLogin() {
      this.user.token = await login(this.user.username)
      this.user.ts = new Date().getTime()
      uni.setStorageSync('token', this.user.token)
      uni.setStorageSync('user', JSON.stringify(this.user))
    },

    // async getHomeData() {
    //   // if (!uni.getStorageSync('token')) {
    //   this.user.token = await login(this.user.username)
    //   // console.log(this.user.token)
      
    //   // }
    // },
    async sendMessage() {
      const sendMsg = this.inputer
      let data = {
        model: 'gpt-3.5-turbo',
        messages: this.thread.slice(-4)
      }
      data.messages.push({
        role: 'user',
        content: sendMsg
      })

      this.thread.push({
        content: sendMsg,
        role: 'user'
      })
      this.inputer = ''
      const res = await completions(data)
      for (let i = 0; i < res.choices.length; i++) {
        this.thread.push({
          content: res.choices[i].message.content,
          role: res.choices[i].message.role
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-view-content {
  display: flex;
  flex-direction: column;
  padding: 0 20rpx;
}
.thread {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 110rpx;
  .content {
    width: 80%;
    background: #ddd;
    padding: 0rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10px;
    font-size: 14px;
    &.user {
      background: #28d700;
      align-self: flex-end;
    }
  }
}
.inputer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
