<template>
    <el-container class="homeBox">
      <el-header class="header" height=80px style="background: #fff">
        <el-row type="flex" justify="space-between">
          <el-col :span="6" style="text-align: left">
            <img src="../assets/LOGO@2x.png" alt="" width="150px" @click="handleLogo">
          </el-col>
          <el-col :span="6" v-if="isLogin">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="primary">
                <img src="../assets/user.png" alt="" style="width:20px; height:20px; color:#fff; position:relative; top: -1px;">
                <span style="font-size:20px; color: #fff;">{{userName}}</span>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">前往收藏夹</el-dropdown-item>
                <el-dropdown-item command="b">钉钉推送</el-dropdown-item>
                <el-dropdown-item command="c">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="6" v-else>
            <el-button type="primary" @click="handleLogin" >
              <img src="../assets/user.png" alt="" style="width:20px; height:20px; color:#fff; position:relative; top: -1px;">
              <span style="font-size:20px; color: #fff;">登陆</span>
            </el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-row :gutter="20" style="height: 160px; overflow:hidden; margin-bottom: 10px">
        <el-col :span="12" :offset="6">
          <el-tabs v-model="activeName" stretch style="height: 200px; width: 600px;">
            <el-tab-pane label="Google" name="first">
              <img src="../assets/google.png" alt="" style="width:70px; margin-top: 48px; margin-right: 20px;">
              <el-input placeholder="请输入搜索内容" v-model="input1" style="width:500px; margin-top: 40px" clearable>
                <el-button slot="append" icon="el-icon-search" @click="handleToGoogle"></el-button>
              </el-input>
            </el-tab-pane>
            <el-tab-pane label="收藏夹搜索" name="second">
              <img src="../assets/Mascot_Happy.png" alt="" style="width:60px; margin-top: 24px; margin-right: 30px;">
              <el-input placeholder="请输入搜索内容" v-model="input2" style="width:500px; margin-top: 40px" clearable>
                <el-button slot="append" icon="el-icon-search" @click="handleToSearch"></el-button>
              </el-input>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div style="width: 100%;">
        <el-row :gutter="20">
          <el-col :span="6" style="margin-left: -20px">
            <el-button type="primary" plain class="nav_btn" autofocus style="margin-left: 10px"><div @click="handleLabel(-1)">全部</div></el-button>
            <el-button type="primary" plain class="nav_btn" v-for="item in followTypes" :key="item.value">
              <div  @click="handleLabel(item.value)" >{{item.label}}</div>
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always" class="tab">
              最新分享
            </el-card>
            <div v-for="item in latestArticles" :key="item.id">
              <el-card shadow="hover"  class="cardStyle" >
                <div @click="goToLink(item.link, item.id)">
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
          <el-col :span="6">
            <el-card shadow="always" class="tab">
              今日最热
            </el-card>
            <div v-for="item in dayArticles" :key="item.id">
              <el-card shadow="hover"  class="cardStyle" >
                <div @click="goToLink(item.link, item.id)">
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
          <el-col :span="6">
            <el-card shadow="always" class="tab">
              本周最热
            </el-card>
            <div v-for="item in weekArticles" :key="item.id">
              <el-card shadow="hover" class="cardStyle" >
                <div @click="goToLink(item.link, item.id)">
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
      </div>
      <el-dialog title="添加钉钉机器人" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="机器人名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="hookUrl" :label-width="formLabelWidth">
            <el-input v-model="form.hookUrl" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRobot">确 定</el-button>
        </div>
      </el-dialog>
    </el-container>
</template>

<script>
  import {get, post} from '../axios.util'
  import {API} from '../api'
  import {ARTICLE_TYPES, BASE_HOST} from '../constant'
  import _ from 'lodash'
  import moment from 'moment'

  export default {
    data() {
      return {
        isLogin: false,
        input1: '',
        input2: '',
        activeName: 'first',
        userName: '',
        followTypes: [],
        latestArticles: [],
        dayArticles: [],
        weekArticles: [],
        dialogFormVisible: false,
        form: {
          name: '',
          hookUrl: ''
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      handleLogo() {
        location.reload()
      },
      async handleCommand(command) {
        if (_.isEqual(command, 'a')) {
          this.$router.push({ path: '/myfavorites' })
        }
        if (_.isEqual(command, 'c')) {
          const event = new CustomEvent('signout');
          document.dispatchEvent(event)
          window.localStorage.removeItem('token')
          this.$router.push({ path: '/login' })
        }
        if (_.isEqual(command, 'b')) {
          this.dialogFormVisible = true

        }
      },
      async addRobot() {
        this.dialogFormVisible = false
        const body = {
          name: this.form.name,
          hookUrl: this.form.hookUrl
        }
        const res = await post(API.ADD_ROBOT, body)
        if (res.success) {
          this.$message({
            message: '\(^o^)/添加钉钉机器人成功啦~',
            center: true,
            type: 'success'
          })
        }
      },
      handleToGoogle() {
        if (_.isEmpty(this.input1)) {
          this.$message({
            message: '搜索内容不可为空',
            center: true,
            type: 'warning'
          })
          return false
        }
        const query = this.input1.toString()
        const targetUrl = `https://www.google.com.hk/search?&q=${query}`
        window.open(targetUrl)
      },
      handleLogin() {
        this.$router.push({ path: '/login' })
      },
      async getMe() {
        const userInfo = await get(API.GET_ME)
        const { username, follows } = userInfo.data
        this.userName = username
        // this.followTypes = _.map(follows, (item) => {
        //   return ARTICLE_TYPES[item.type]
        // })
      },
      async handleLabel(typeId) {
        const dimension = ['latest', 'day', 'week']
        const getArticleApi = this.isLogin ? API.GET_ARTICLES : API.GET_ARTICLE_NO_TOKEN
        const articles = await Promise.all(_.map(dimension, async (item) => {
          const theUrl = `${getArticleApi}?dimension=${item}&type=${typeId}&offset=0&limit=10`
          const res = await get(theUrl)
          const { data } = res.data
          return _.map(data, (item) => {
            const newThumbPath = `${BASE_HOST}/${item.article.thumbPath}`
            const time = moment(item.articlecreatedTime).format("MM-DD-YYYY")
            item.article.thumbPath = newThumbPath
            item.article.articlecreatedTime= time
            return item.article || []
          }) || []
        }))
        if (!articles) {
          return
        }
        [this.latestArticles, this.dayArticles, this.weekArticles] = articles
      },
      async goToLink(url, id) {
        const visitUrl = _.replace(API.VISIT, ':id', id)
        if (this.isLogin) {
          await get(visitUrl)
        }
        window.open(url)
      },
      async handleToSearch () {
        if (this.isLogin) {
          const searchUrl = `${API.SEARCH}?keyword=${this.input2}&offset=0&limit=10`
          this.$router.push({ name: 'search', params: {url: searchUrl, keyword: this.input2}})
        } else {
          this.$message({
            message: '请先登录个人账户~',
            center: true,
            type: 'warning'
          })
        }
      }
    },
    async beforeMount () {
      const token = window.localStorage.getItem('token')
      await this.handleLabel(-1)
      this.isLogin = !token ? false : true
      if (this.isLogin) {
        await this.getMe()
      }
      this.followTypes = ARTICLE_TYPES
    }
  }
</script>

<style lang="scss" scoped>
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
    margin: 4px 0;
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
</style>
