<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef"
               :model="loginForm"
               :rules="loginFormRules"
               label-width="0px"
               class="login_form">
        <el-form-item class="item-header">
          <h2>学生管理系统</h2>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username"
                    prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password"
                    prefix-icon="el-icon-lock"
                    type="password"></el-input>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item>
          <el-radio-group v-model="loginForm.type">
            <el-radio label="1">管理员</el-radio>
            <el-radio label="2">学生</el-radio>
            <el-radio label="3">教师</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary"
                     @click="login">登录</el-button>
          <el-button type="info"
                     @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
        type: '1'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users/login', this.loginForm)
        console.log(res)
        // if (res !== '') return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.jwt_token)
        if (res.loginData[0].type === 1) this.$router.push('/admin')
        if (res.loginData[0].type === 2) this.$router.push('/student')
        if (res.loginData[0].type === 3) this.$router.push('/teacher')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login_container {
    background-color: #eee;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 350px;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .item-header {
    text-align: center;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
