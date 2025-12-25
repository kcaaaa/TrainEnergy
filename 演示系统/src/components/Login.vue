<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <div class="login-header">
        <h2>高铁站节能降耗管理系统</h2>
        <p>请登录后继续</p>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="rememberMe">记住我（本机）</el-checkbox>
        </el-form-item>
        <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
          <i class="fa fa-sign-in"></i> 登录
        </el-button>
      </el-form>

      <el-divider>演示账号说明</el-divider>
      <el-alert type="info" show-icon :closable="false" class="account-tip">
        <template #title>可直接复制使用</template>
        <div class="account-list">
          <div class="account-item">
            <strong>超级管理员</strong>：admin / 12345678
          </div>
          <div class="account-item">
            <strong>全站管理员</strong>：Allsite / 12345678
          </div>
          <div class="account-item">
            <strong>单站管理员</strong>：station01 / 12345678（北京南站）
          </div>
          <div class="account-item">
            <strong>单站管理员</strong>：station02 / 12345678（上海虹桥站）
          </div>
        </div>
      </el-alert>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const rememberMe = ref(true)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const ensureMockUsers = () => {
  const roles = [
    { id: '1', roleKey: 'super_admin', roleName: '超级管理员', description: '系统最高权限', status: true },
    { id: '2', roleKey: 'site_admin', roleName: '全站管理员', description: '多站与全站配置', status: true },
    { id: '3', roleKey: 'station_admin', roleName: '单站管理员', description: '单站权限', status: true }
  ]

  const users = [
    { id: '1', username: 'admin', nickname: '超级管理员', password: '12345678', roleId: '1', roleKey: 'super_admin', status: true },
    { id: '2', username: 'Allsite', nickname: '全站管理员', password: '12345678', roleId: '2', roleKey: 'site_admin', status: true },
    { id: '3', username: 'station01', nickname: '北京南站管理员', password: '12345678', roleId: '3', roleKey: 'station_admin', stationId: 'beijing', stationName: '北京南站', status: true },
    { id: '4', username: 'station02', nickname: '上海虹桥站管理员', password: '12345678', roleId: '3', roleKey: 'station_admin', stationId: 'shanghai', stationName: '上海虹桥站', status: true }
  ]

  if (!localStorage.getItem('roles')) {
    localStorage.setItem('roles', JSON.stringify(roles))
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users))
  }
}

const handleLogin = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    loading.value = true
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const found = users.find(u => u.username === form.username && u.password === form.password && u.status)
      if (!found) {
        ElMessage.error('用户名或密码错误，或账户已禁用')
        loading.value = false
        return
      }
      const token = `token-${Date.now()}`
      const userInfo = {
        id: found.id,
        username: found.username,
        nickname: found.nickname || found.username,
        roleId: found.roleId,
        roleKey: found.roleKey,
        stationId: found.stationId || '',
        stationName: found.stationName || ''
      }
      localStorage.setItem('token', token)
      localStorage.setItem('currentUser', JSON.stringify(userInfo))
      if (!rememberMe.value) {
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('currentUser', JSON.stringify(userInfo))
      }
      ElMessage.success('登录成功')
      router.push('/')
    }, 300)
  })
}

onMounted(() => {
  ensureMockUsers()
  const token = localStorage.getItem('token')
  if (token) {
    router.push('/')
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 50%, #c0dfff 100%);
}

.login-card {
  width: 420px;
  padding: 10px 20px 20px;
  border-radius: 12px;
}

.login-header {
  text-align: center;
  margin-bottom: 16px;
}

.login-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.login-header p {
  margin: 4px 0 0;
  color: #909399;
  font-size: 13px;
}

.login-btn {
  width: 100%;
  margin-top: 8px;
}

.account-tip {
  margin-top: 12px;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
}

.account-item {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}
</style>

