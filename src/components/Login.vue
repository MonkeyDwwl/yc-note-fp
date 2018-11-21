<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">
        <img src="../assets/LOGO@2x.png" alt="">
      </h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
          </el-col>
          <el-col :span="8"><el-button type="primary" @click.native.prevent="handleRegist">注册</el-button></el-col>
        </el-row>
      </el-form-item>
    </el-form>
</template>

<script>
  import { API } from '../api'
  import { post, get } from '../axios.util'

  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      handleSubmit() {
        this.$refs.ruleForm2.validate(async (valid) => {
          if (valid) {
            this.logining = true
            let loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass }
            const res = await post(API.LOGIN, loginParams)
            this.logining = false
            console.log('>>>>', res)
            const { success, data, msg } = res
            if (!success) {
              this.$message({
                message: msg,
                type: 'error'
              })
            } else {
                if(this.checked){
                  window.localStorage.setItem('userName', this.ruleForm2.account)
                  window.localStorage.setItem('pwd', this.ruleForm2.checkPass)
                  window.localStorage.setItem('token', data.token)
                }else {
                  window.localStorage.removeItem('userName')
                  window.localStorage.removeItem('pwd')
                  window.localStorage.removeItem('token')
                }
                const event = new CustomEvent('signin', {
                  detail: {
                    token: data.token
                  }
                })
                document.dispatchEvent(event)
                this.$router.push({ path: '/home'})
            }
          }
        })
      },
      handleRegist() {
        this.$router.push({ path: '/register' })
      }
    },
    beforeMount () {
      const userName = window.localStorage.getItem('userName')
      const pwd = window.localStorage.getItem('pwd')
      if (userName && pwd) {
        this.ruleForm2 = {
          account: userName,
          checkPass: pwd
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../styles/normalize';
  body {
    background: #fff;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
    }
  }
</style>
