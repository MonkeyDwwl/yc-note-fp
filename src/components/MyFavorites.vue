<template>
  <el-container class="homeBox">
    <el-header class="header" height=80px style="background: #fff">
      <el-row type="flex" justify="space-between">
        <el-col :span="6" style="text-align: left">
          <img src="../assets/LOGO@2x.png" alt="" width="150px" @click="handleLogo">
        </el-col>
        <el-col :span="6">
          <el-dropdown @command="handleCommand" trigger="click">
            <el-button type="primary">
              <img src="../assets/user.png" alt="" style="width:20px; height:20px; color:#fff; position:relative; top: -1px;">
              <span style="font-size:20px; color: #fff;">{{userName}}</span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">前往首页</el-dropdown-item>
              <el-dropdown-item command="b">钉钉推送</el-dropdown-item>
              <el-dropdown-item command="b">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="box">
      <el-row style="width:100%">
        <el-col :span="4" style="margin-left: -20px" >
          <el-button type="primary" plain class="nav_btn" autofocus style="margin-left: 10px"><div @click="handleLabel(-1)">全部</div></el-button>
          <el-button type="primary" plain class="nav_btn" v-for="(item, index) in followTypes" :key="index">
            <div @click="handleLabel(item.value)" >{{item.label}}</div>
          </el-button>
        </el-col>
        <el-col :span="18" style="margin-left: 5%">
          <div v-for="item in articles" :key="item.id">
            <el-card shadow="hover" class="cardStyle clear-fix">
              <div @click="goToLink(item.link, item.id)" >
                <img :src="item.thumbPath" class="image">
                <H4 class="cardTitle">{{item.title}}</H4>
                <el-row type="flex" justify="space-around" style="text-align: left; color: darkgrey">
                  <p class="cardDescription">{{item.description}}</p>
                  <p class="createdTime">{{item.articlecreatedTime}}</p>
                </el-row>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-container>
  </el-container>
</template>

<script>
  import {get} from '../axios.util'
  import {API} from '../api'
  import {ARTICLE_TYPES, BASE_HOST} from '../constant'
  import _ from 'lodash'
  import moment from 'moment'

  export default {
    data() {
      return {
        input1: '',
        input2: '',
        followTypes: '',
        articles: ''
      }
    },
    methods: {
      handleLogo () {
        this.$router.push({ path: '/home' })
        this.$router.go(0)
      },
      handleCommand(command) {
        if (_.isEqual(command, 'a')) {
          this.handleLogo()
        }
        if (_.isEqual(command, 'b')) {
          const event = new CustomEvent('signout');
          document.dispatchEvent(event)
          window.localStorage.removeItem('token')
          this.$router.push({ path: '/login' })
        }
      },
      async handleLabel(typeId) {
        const theUrl = `${API.GET_USER_ARTICLE}?type=-1&offset=0&limit=10`
        const res = await get(theUrl)
        const { data } = res.data
        const articles = _.map(data, (item) => {
          const newThumbPath = `${BASE_HOST}/${item.thumbPath}`
          const time = moment(item.createdTime).format("MM-DD-YYYY")
          item.thumbPath = newThumbPath
          item.articlecreatedTime= time
          return item || []
        }) || []
        this.articles = articles
        if (typeId !== -1){
          this.articles = _.filter(articles, (article) => article.type.toString() === typeId.toString())
        }
      },
      async goToLink(url, id) {
        const visitUrl = _.replace(API.VISIT, ':id', id)
        if (this.isLogin) {
          await get(visitUrl)
        }
        window.open(url)
      }
    },
    async beforeMount () {
      this.userName = window.localStorage.getItem('userName')
      const userInfo = await get(API.GET_ME)
      if (!userInfo) {
        this.$router.push({ path: '/login' })
      }
      const { follows } = userInfo.data
      this.followTypes = _.map(follows, (item) => {
        return ARTICLE_TYPES[item.type]
      })
      await this.handleLabel(-1)
    }
  }
</script>

<style lang="scss">
  @import '../styles/normalize';
  body{
    background: #fff;
    padding: 0 20px;
  }
  .homeBox {
    padding: 80px 100px 0 100px;
  }
  .header {
    position:fixed;
    top:0;
    left:0;
    z-index:10;
    width: 100%;
    text-align: right;
    font-size: 20px;
    padding: 20px 100px;
    box-shadow: 0px 6px 6px -6px gainsboro;
  }
  .box {
    margin-top: 100px;
  }
  .nav_btn {
    padding:0;
    width:180px;
    height:40px;
    margin-bottom: 16px;
  }
  .tab {
    background: #909399;
    margin-bottom: 20px;
    color: #fff;
  }
  .image {
    width: 100%;
    height: 180px;
  }
  .cardStyle {
    float: left;
    width: 32%;
    margin: 0 1% 1% 0;
  }
  .cardTitle {
    width: 100%;
    height: 20px;
    text-align: left;
    font-size: 15px;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    margin: 5px 0;
  }
  .cardDescription {
    width: 100%;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .createdTime {
    width: 100%;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    text-align: right;
  }
  .clear-fix{
    &:before,
    &:after {
      content: " ";
      display: table;
    }
    &:after{
      clear:both;
    }
  }
</style>
