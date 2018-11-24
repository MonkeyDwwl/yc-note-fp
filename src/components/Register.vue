<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">
      <img src="../assets/LOGO@2x.png" alt="">
    </h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="pass">
      <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-select v-model="types" multiple placeholder="请选择关注类型" style="width:100%">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleRegist">完成注册</el-button>
        </el-col>
        <el-col :span="8"><el-button type="primary" @click.native.prevent="handleToLogin">登录</el-button></el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
  import {API} from '../api'
  import {ARTICLE_TYPES} from '../constant'
  import {post} from '../axios.util'

  export default {
    data() {
      return {
        ruleForm2: {
          account: '',
          pass: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          pass: [
            { required: true, message: '请设置密码', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
          ]
        },
        options: ARTICLE_TYPES,
        types: []
      };
    },
    methods: {
       handleRegist() {
        this.$refs.ruleForm2.validate(async (valid) => {
          if (valid) {
            const registerParams = {
              username: this.ruleForm2.account,
              password: this.ruleForm2.pass,
              confirmPassword: this.ruleForm2.checkPass,
              types: this.types
            }
            const res = await post(API.REGISTER, registerParams)
            if (!res.success) {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
            if (res.success) {
              // TODO 跳转登录页
              this.$router.push({ path: '/login' })
              window.localStorage.setItem('userName', this.ruleForm2.account)
              window.localStorage.setItem('pwd', this.ruleForm2.pass)
            }
          }
        });
      },
      handleToLogin() {
        this.$router.push({ path: '/login' })
      }
    }
  }

</script>

<style lang="scss" scoped>
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
      margin: 0px 0px 35px 0px;
    }
  }
</style>
