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
  const existing = localStorage.getItem('users')
  if (!existing) {
    const mock = [
      { id: '1', username: 'admin', nickname: '系统管理员', password: '12345678', roleId: '1', status: true },
      { id: '2', username: 'user1', nickname: '演示用户', password: '12345678', roleId: '2', status: true }
    ]
    localStorage.setItem('users', JSON.stringify(mock))
  }
  const roles = localStorage.getItem('roles')
  if (!roles) {
    const mockRoles = [
      { id: '1', roleKey: 'admin', roleName: '管理员', description: '系统管理员', status: true },
      { id: '2', roleKey: 'user', roleName: '普通用户', description: '普通用户', status: true }
    ]
    localStorage.setItem('roles', JSON.stringify(mockRoles))
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
        roleId: found.roleId
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
</style>

