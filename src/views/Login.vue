<template>
  <ScaleScreen>
    <div class="login-body">
      <div class="login-title">
        <h1>收 费 站 智 能 拥 堵 检 测 系 统</h1>
      </div>
      <div class="login-container">
        <el-card class="login-card" style="max-width: 500px ;height: 300px;">
          <p style="text-align: center;">欢迎登录</p>
          <el-form :model="form" label-width="auto" style="max-width: 450px">
            <el-form-item>
              <el-input v-model="username" placeholder="请输入用户名" style="height: 45px">
                <template #prefix>
                  <el-icon :size="20">
                    <UserFilled />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="password" type="password" placeholder="请输入密码" style="height: 45px">
                <template #prefix>
                  <el-icon :size="20">
                    <Lock />
                  </el-icon>
                  <!-- <el-button :icon="Lock" /> -->
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <el-button class="login-button" type="primary" style="width: 450px; height: 45px;"
            @click="loginHome">登录</el-button>
        </el-card>
      </div>
    </div>
    <div id="particles-js"></div>
  </ScaleScreen>
</template>

<script setup>
import { UserFilled, Lock } from '@element-plus/icons-vue'
import { ref, getCurrentInstance } from 'vue'
import request from '@/api/request'
import { login } from '@/api'
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const router = useRouter()
const formRef = ref()
const username = ref('')
const password = ref('')

const loginHome = async () => {
  if (!username.value || !password.value) {
    proxy.Message.error('用户名或密码不能为空')
    return
  }
  const data = {
    username: username.value,
    password: password.value
  }
  try {
    const res = await login(data)
    if (res.code === 200) {
      console.log('登录成功')
      router.replace('/home')
      //存储token
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('token', res.data.token)
      proxy.Message.success(res.message)
    }
  } catch (error) {
    console.log(error)
    proxy.Message.error(error.response.data.message)
  }
}


</script>

<style lang="scss" scoped>
.login-body {
  position: relative;
  height: 100%;
  width: 100%;
  background: url('../assets/img/login-bg5.jpg') no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;

  .login-title {
    text-align: center;
    margin-top: 100px;

    h1 {
      font-size: 4rem;
      // color: #0bb6d4;
      // 渐变
      background: linear-gradient(to right, #01AAFF, #00EAFF 30%, #01AAFF 50%);
      background-size: 200%;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine 10s linear infinite;
    }

    @keyframes shine {
      0% {
        background-position: 500%;
      }

      100% {
        background-position: -500%;
      }

    }
  }

  .login-container {
    width: 500px;
    height: 300px;
    position: absolute;
    top: 45%;
    right: 10%;

    .login-card {
      border: 1px solid transparent;
      border-radius: 25px;
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 5px 5px 0 0 rgba(0, 0, 0, 0.2);

      p {
        margin: 10px 0px 20px 0px;
        font-size: 26px;
        color: #01AAFF;
        font-weight: bold;
      }
    }

    .login-button {
      border-radius: 25px;
      font-size: 20px;
    }

    // background: #e9adad;
  }
}
</style>