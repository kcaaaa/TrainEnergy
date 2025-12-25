<template>
  <div class="user-management-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2><i class="fa fa-user"></i> 用户管理</h2>
          <el-button type="primary" @click="handleAddUser">
            <i class="fa fa-plus"></i> 新增用户
          </el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.roleId" placeholder="请选择角色" clearable>
            <el-option
              v-for="role in roles"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" :value="true" />
            <el-option label="禁用" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <i class="fa fa-search"></i> 搜索
          </el-button>
          <el-button @click="handleReset">
            <i class="fa fa-refresh"></i> 重置
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 用户列表 -->
      <el-table
        v-loading="loading"
        :data="pagedUsers"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="roleId" label="角色">
          <template #default="scope">
            {{ getRoleName(scope.row.roleId) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.row)"
              active-text="启用"
              inactive-text="禁用"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditUser(scope.row)"
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteUser(scope.row)"
              icon="el-icon-delete"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredUsers.length"
        />
      </div>
    </el-card>
    
    <!-- 新增/编辑用户弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-position="top"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" placeholder="请输入用户名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="密码" :prop="isEdit ? '' : 'password'">
              <el-input
                v-model="userForm.password"
                type="password"
                placeholder="请输入密码"
                :disabled="isEdit"
              />
              <div v-if="isEdit" class="password-hint">
                如需修改密码，请重置密码
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" :prop="isEdit ? '' : 'confirmPassword'">
              <el-input
                v-model="userForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                :disabled="isEdit"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="userForm.roleId" placeholder="请选择角色">
                <el-option
                  v-for="role in roles"
                  :key="role.id"
                  :label="role.roleName"
                  :value="role.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="状态">
              <el-switch v-model="userForm.status" active-text="启用" inactive-text="禁用" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 删除确认弹窗 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
    >
      <div class="delete-dialog-content">
        <i class="fa fa-exclamation-circle"></i>
        <p>确定要删除用户 <strong>{{ deleteUserName }}</strong> 吗？</p>
        <p class="delete-hint">删除后将无法恢复，请谨慎操作。</p>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="handleConfirmDelete">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  username: '',
  roleId: '',
  status: ''
})

// 用户列表
const users = reactive([])
const loading = ref(false)

// 角色列表（从localStorage获取或使用模拟数据）
const roles = reactive([])

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)
const userFormRef = ref(null)

// 用户表单
const userForm = reactive({
  id: '',
  username: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  roleId: '',
  status: true
})

// 密码确认验证
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== userForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 用户名唯一性验证
const validateUsernameUnique = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  const exists = users.some(u => u.username === value && u.id !== userForm.id)
  if (exists) {
    callback(new Error('用户名已存在'))
  } else {
    callback()
  }
}

// 表单验证规则
const userRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '用户名只能包含字母、数字和下划线，且以字母开头', trigger: 'blur' },
    { validator: validateUsernameUnique, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度在 8 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)[\s\S]{8,20}$/, message: '密码需包含字母和数字，可含特殊字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
})

// 删除对话框
const deleteDialogVisible = ref(false)
const deleteUserId = ref('')
const deleteUserName = ref('')

// 加载角色数据
const loadRoles = () => {
  const rolesData = localStorage.getItem('roles')
  if (rolesData) {
    const parsedRoles = JSON.parse(rolesData)
    roles.splice(0, roles.length, ...parsedRoles)
  } else {
    // 如果没有角色数据，使用模拟数据
    const mockRoles = [
      { id: '1', roleKey: 'admin', roleName: '管理员', description: '系统管理员', status: true },
      { id: '2', roleKey: 'user', roleName: '普通用户', description: '普通系统用户', status: true },
      { id: '3', roleKey: 'viewer', roleName: '查看者', description: '只能查看数据', status: true }
    ]
    roles.splice(0, roles.length, ...mockRoles)
    localStorage.setItem('roles', JSON.stringify(mockRoles))
  }
}

// 加载用户数据
const loadUsers = () => {
  loading.value = true
  
  // 模拟异步加载
  setTimeout(() => {
    const usersData = localStorage.getItem('users')
    if (usersData) {
      const parsedUsers = JSON.parse(usersData)
      users.splice(0, users.length, ...parsedUsers)
    } else {
      // 如果没有用户数据，使用模拟数据
      const mockUsers = [
        {
          id: '1',
          username: 'admin',
          nickname: '系统管理员',
          password: '12345678',
          email: 'admin@example.com',
          phone: '13800138000',
          roleId: '1',
          status: true,
          createTime: '2023-01-01 10:00:00',
          updateTime: '2023-01-01 10:00:00'
        },
        {
          id: '2',
          username: 'user1',
          nickname: '用户1',
          password: '12345678',
          email: 'user1@example.com',
          phone: '13800138001',
          roleId: '2',
          status: true,
          createTime: '2023-01-02 10:00:00',
          updateTime: '2023-01-02 10:00:00'
        },
        {
          id: '3',
          username: 'viewer1',
          nickname: '查看者1',
          password: '12345678',
          email: 'viewer1@example.com',
          phone: '13800138002',
          roleId: '3',
          status: true,
          createTime: '2023-01-03 10:00:00',
          updateTime: '2023-01-03 10:00:00'
        }
      ]
      users.splice(0, users.length, ...mockUsers)
      localStorage.setItem('users', JSON.stringify(mockUsers))
    }
    
    loading.value = false
  }, 500)
}

// 保存用户数据
const saveUsers = () => {
  localStorage.setItem('users', JSON.stringify(users))
}

// 记录系统日志
const addSystemLog = (title, content) => {
  const logs = localStorage.getItem('systemLogs')
  const logList = logs ? JSON.parse(logs) : []
  const newLog = {
    id: logList.length ? logList[0].id + 1 : 1,
    type: 'system',
    title,
    content,
    operator: 'system',
    ip: '127.0.0.1',
    userAgent: 'system',
    createTime: new Date().toISOString()
  }
  logList.unshift(newLog)
  if (logList.length > 1000) {
    logList.length = 1000
  }
  localStorage.setItem('systemLogs', JSON.stringify(logList))
}

// 根据角色ID获取角色名称
const getRoleName = (roleId) => {
  const role = roles.find(r => r.id === roleId)
  return role ? role.roleName : '未知角色'
}

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.filter(user => {
    // 用户名过滤
    if (searchForm.username && !user.username.includes(searchForm.username)) {
      return false
    }
    
    // 角色过滤
    if (searchForm.roleId && user.roleId !== searchForm.roleId) {
      return false
    }
    
    // 状态过滤
    if (searchForm.status !== '' && user.status !== searchForm.status) {
      return false
    }
    
    return true
  })
})

// 分页后的用户列表
const pagedUsers = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredUsers.value.slice(start, end)
})

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
}

// 重置搜索
const handleReset = () => {
  searchForm.username = ''
  searchForm.roleId = ''
  searchForm.status = ''
  pagination.currentPage = 1
}

// 打开新增用户对话框
const handleAddUser = () => {
  dialogTitle.value = '新增用户'
  isEdit.value = false
  resetUserForm()
  dialogVisible.value = true
}

// 打开编辑用户对话框
const handleEditUser = (row) => {
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  
  // 复制用户数据到表单
  Object.assign(userForm, {
    ...row,
    confirmPassword: row.password
  })
  
  dialogVisible.value = true
}

// 重置用户表单
const resetUserForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
  
  Object.assign(userForm, {
    id: '',
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    roleId: '',
    status: true
  })
}

// 关闭对话框
const handleDialogClose = () => {
  resetUserForm()
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    
    // 获取当前时间
    const now = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    
    if (isEdit.value) {
      // 编辑用户
      const index = users.findIndex(u => u.id === userForm.id)
      if (index !== -1) {
        users[index] = {
          ...users[index],
          ...userForm,
          updateTime: now
        }
        saveUsers()
        ElMessage.success('用户信息更新成功')
        addSystemLog('用户管理-编辑', `编辑用户：${users[index].username}`)
      }
    } else {
      // 新增用户
      const newUser = {
        ...userForm,
        id: Date.now().toString(),
        createTime: now,
        updateTime: now
      }
      users.push(newUser)
      saveUsers()
      ElMessage.success('用户新增成功')
      addSystemLog('用户管理-新增', `新增用户：${newUser.username}`)
    }
    
    dialogVisible.value = false
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error)
  }
}

// 打开删除确认对话框
const handleDeleteUser = (row) => {
  deleteUserId.value = row.id
  deleteUserName.value = row.username
  deleteDialogVisible.value = true
}

// 确认删除
const handleConfirmDelete = () => {
  const index = users.findIndex(u => u.id === deleteUserId.value)
  if (index !== -1) {
    users.splice(index, 1)
    saveUsers()
    ElMessage.success('用户删除成功')
    addSystemLog('用户管理-删除', `删除用户：${deleteUserName.value}`)
  }
  
  deleteDialogVisible.value = false
}

// 状态变更
const handleStatusChange = (row) => {
  // 更新本地存储
  saveUsers()
  
  const statusText = row.status ? '启用' : '禁用'
  ElMessage.success(`用户${statusText}成功`)
  addSystemLog('用户管理-状态变更', `用户${row.username}状态调整为：${statusText}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadRoles()
  loadUsers()
})
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.password-hint {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}

.delete-dialog-content {
  text-align: center;
  padding: 20px 0;
}

.delete-dialog-content i {
  font-size: 48px;
  color: #e6a23c;
  margin-bottom: 15px;
}

.delete-hint {
  color: #909399;
  font-size: 14px;
  margin-top: 10px;
}
</style>