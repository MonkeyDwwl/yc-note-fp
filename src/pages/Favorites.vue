<template>
  <el-card class="container">
    <div class="title"><h3 style="line-height:30px">添加收藏</h3></div>
    <div style="width:100%; height:300px"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <img :src=imageUrl alt="" style="width:100%; height:300px">
    </div>
    <H4 class="titleName">
      {{title}}
    </H4>
    <el-select v-model="type" placeholder="请选择收藏标签" style="width:100%; margin-bottom:20px">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-row :gutter="20">
      <el-col :span="16"><el-input type="text"  auto-complete="off" placeholder="备注信息" v-model="remarkMsg"></el-input></el-col>
      <el-col :span="8"><el-checkbox class="isShare" v-model="checked">是否分享</el-checkbox></el-col>
    </el-row>
    <el-button type="primary" class="favoriteBtn" @click="handleShare">提交</el-button>
  </el-card>
</template>

<script>
  import {ARTICLE_TYPES} from '../constant'
  import {post} from '../axios.util'
  import {API} from '../api'
  import _ from 'lodash'

  export default {
    data() {
      return {
        options: ARTICLE_TYPES,
        type: '',
        imageUrl: '',
        imageName: '',
        title: '',
        loading: true,
        remarkMsg: '',
        checked: true,
        targetUrl: ''
      }
    },
    methods: {
      async handleShare () {
        const type = _.toNumber(this.type)
        const body = {
          "type": type,
          "description": this.remarkMsg || '',
          "link": this.targetUrl,
          "imageName": this.imageName,
          "isShare": this.checked
        }
        const res = await post(API.POST_ARTICLE, body)
        if (res.success) {
          this.$message({
            message: '\(^o^)/添加收藏成功，即将关闭本页面~',
            type: 'success'
          })
          _.delay(window.close(), 1000, 'later')
        }
      }
    },
    async beforeMount () {
      const token = window.localStorage.getItem('token')
      if (!token) {
        this.$message({
          message: '请先登录~',
          center: true,
          type: 'warning'
        })
        this.$router.push({ path: '/login' })
      }
      this.targetUrl = this.$route.query ? this.$route.query.link : "https://www.google.com.hk"
      const body = {
        link: this.targetUrl
      }
      const res = await post(API.GET_SHORT, body)
      if (res) {
        this.loading = false
        const {imageUrl, name, title} = res.data
        this.imageUrl = imageUrl
        this.imageName = name
        this.title = title
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 400px;
    padding: 6px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: gray;
      font-size: 18px;
      width: 100%;
      height: 30px;
    }
    .isShare {
      position:relative;
      top: 10px;
    }
  }
  .titleName {
    border-top: 2px solid darkgrey;
    padding: 20px 0;
    margin-bottom: 10px;
    width: 100%;
    height: 60px;
    line-height: 20px;
    font-size: 16px;
  }
  .favoriteBtn {
    width: 100%;
    margin-top: 20px;
  }
</style>
