<template>
  <el-container>
    <el-header class="header" height=100px style="background: #fff">
      <el-row  type="flex" justify="space-between" style="height:80px">
        <el-col :span="8" style="margin-top: 10px">
          <el-row style="text-align: left">
            <el-col :span="6"><img src="../assets/Mascot_Happy.png" alt="" width="40px" style="margin-right: 10px;" @click="handleLogo"></el-col>
            <el-col :span="18" style="margin-left: -40px">
              <el-input placeholder="请输入内容" v-model="input" style="width:500px" clearable>
                <el-button slot="append" icon="el-icon-search" @click="handleToSearch"></el-button>
              </el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-dropdown @command="handleCommand" trigger="click" >
            <el-button type="primary">
              <img src="../assets/user.png" alt="" style="width:20px; height:20px; color:#fff; position:relative; top: -1px;">
              <span style="font-size:20px; color: #fff;">{{userName}}</span>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">前往收藏夹</el-dropdown-item>
              <el-dropdown-item command="b">前往首页</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="resultBox" v-if="data.length">
      <el-card shadow="hover" v-for="(item, index) in data" :key="index" class="cardStyle">
        <div @click="goToLink(item._source.link, item._id)">
          <img :src="item._source.thumbPath" class="searchImage">
          <H4 class="cardTitle">{{item._source.title}}</H4>
          <div class="highlightBox">
            <div v-for="(highText, index) in item.highlight.content" :key="index" >
              <div v-html="highText" style="font-size:14px; color: lightslategrey; line-height: 1.5"></div>
            </div>
          </div>
          <el-row type="flex" justify="space-around" style="text-align: left; color: darkgrey">
            <p class="cardDescription"><span>备注：</span>{{item._source.description}}</p>
          </el-row>
        </div>
      </el-card>
    </el-main>
    <el-main class="resultBox" v-else>
      <p style="font-size: 18px; padding: 40px;">暂无搜索结果~~~</p>
      <img src="../assets/lufei.png" alt="" style="width:50%">
    </el-main>
  </el-container>
</template>

<script>
  import {get} from '../axios.util'
  import {API} from '../api'
  import {BASE_HOST} from '../constant'
  import moment from 'moment'

  export default {
    data() {
      return {
        userName: '',
        input: '',
        data: []
      }
    },
    methods: {
      handleLogo() {
        this.$router.push({ path: '/home' })
        this.$router.go(0)
      },
      async handleToSearch () {
        const searchUrl = `${API.SEARCH}?keyword=${this.input}&offset=0&limit=10`
        await this.search(searchUrl)
      },
      async search (url) {
        const res = await get(url)
        this.data = res.data.hits
        return _.map(this.data, (item) => {
          const newThumbPath = `${BASE_HOST}/${item._source.thumbPath}`
          const time = moment(item._source.createdAt).format("MM-DD-YYYY")
          item._source.thumbPath = newThumbPath
          item._source.createdAt = time
          return item|| []
        }) || []
      },
      async goToLink(url, id) {
        const visitUrl = _.replace(API.VISIT, ':id', id)
        if (this.isLogin) {
          await get(visitUrl)
        }
        window.open(url)
      },
      handleCommand(command) {
        if (_.isEqual(command, 'a')) {
          this.$router.push({ path: '/myfavorites' })
        }
        if (_.isEqual(command, 'b')) {
          this.handleLogo()
        }
      },
    },
    async beforeMount() {
      this.userName = window.localStorage.getItem('userName')
      this.input = this.$route.params.keyword || ''
      if (this.$route.params.url) {
        await this.search(this.$route.params.url)
      }
    }
  }
</script>
<style lang="scss">
  @import '../styles/normalize';
  body{
    background: #fff;
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
  .resultBox{
    padding: 140px 100px;
  }
  .cardStyle {
    float: left;
    width: 288px;
    margin: 10px;
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
  .searchImage {
    width: 300px;
    height: 200px;
  }
  .highlightBox {
    margin-bottom: 10px;
    width:100%;
    height:60px;
    overflow:scroll;
    text-align:left;
    line-height: 1.5;
  }
</style>
