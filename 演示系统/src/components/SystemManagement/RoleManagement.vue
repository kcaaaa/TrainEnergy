<template>
  <div class="role-management-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <h2><i class="fa fa-user-secret"></i> 角色管理</h2>
          <el-button type="primary" @click="handleAddRole">
            <i class="fa fa-plus"></i> 新增角色
          </el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <el-form :inline="true" class="search-form">
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="searchForm.roleKey" placeholder="请输入角色标识" clearable />
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
      
      <!-- 角色列表 -->
      <el-table
        v-loading="loading"
        :data="pagedRoles"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="角色ID" width="80" />
        <el-table-column prop="roleKey" label="角色标识" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="description" label="描述" min-width="200" />
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
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditRole(scope.row)"
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="handlePermission(scope.row)"
              icon="el-icon-lock"
            >
              权限设置
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteRole(scope.row)"
              icon="el-icon-delete"
              :disabled="scope.row.roleKey === 'admin'"
              :title="scope.row.roleKey === 'admin' ? '管理员角色不可删除' : ''"
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
          :total="filteredRoles.length"
        />
      </div>
    </el-card>
    
    <!-- 新增/编辑角色弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-position="top"
        label-width="80px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色标识" prop="roleKey">
              <el-input 
                v-model="roleForm.roleKey" 
                placeholder="请输入角色标识" 
                :disabled="isEdit && roleForm.roleKey === 'admin'"
              />
              <div v-if="isEdit && roleForm.roleKey === 'admin'" class="role-key-hint">
                管理员角色标识不可修改
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="角色描述" prop="description">
              <el-input
                v-model="roleForm.description"
                placeholder="请输入角色描述"
                type="textarea"
                rows="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="状态">
              <el-switch 
                v-model="roleForm.status" 
                active-text="启用" 
                inactive-text="禁用"
                :disabled="roleForm.roleKey === 'admin'"
              />
              <div v-if="roleForm.roleKey === 'admin'" class="role-status-hint">
                管理员角色状态不可修改
              </div>
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
    
    <!-- 角色权限设置弹窗 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="角色权限设置"
      width="800px"
      @close="handlePermissionDialogClose"
    >
      <div class="permission-dialog-content">
        <h3>{{ selectedRole.roleName }} - 权限设置</h3>
        <p class="permission-hint">勾选权限项为该角色分配相应权限</p>
        
        <!-- 权限树 -->
        <el-tree
          v-model="checkedPermissions"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="permissionTreeProps"
        />
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePermission">保存权限</el-button>
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
        <p>确定要删除角色 <strong>{{ deleteRoleName }}</strong> 吗？</p>
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
  roleName: '',
  roleKey: '',
  status: ''
})

// 角色列表
const roles = reactive([])
const loading = ref(false)

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const isEdit = ref(false)
const roleFormRef = ref(null)

// 角色表单
const roleForm = reactive({
  id: '',
  roleKey: '',
  roleName: '',
  description: '',
  status: true
})

// 验证角色标识唯一性
const validateRoleKeyUnique = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  
  const existingRole = roles.find(r => r.roleKey === value && r.id !== roleForm.id)
  if (existingRole) {
    callback(new Error('角色标识已存在'))
  } else {
    callback()
  }
}

// 验证角色名称唯一性
const validateRoleNameUnique = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  
  const existingRole = roles.find(r => r.roleName === value && r.id !== roleForm.id)
  if (existingRole) {
    callback(new Error('角色名称已存在'))
  } else {
    callback()
  }
}

// 表单验证规则
const roleRules = reactive({
  roleKey: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    { min: 3, max: 20, message: '角色标识长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '角色标识只能包含字母、数字和下划线，且以字母开头', trigger: 'blur' },
    { validator: validateRoleKeyUnique, trigger: 'blur' }
  ],
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: 'blur' },
    { validator: validateRoleNameUnique, trigger: 'blur' }
  ],
  description: [
    { max: 100, message: '角色描述不能超过 100 个字符', trigger: 'blur' }
  ]
})

// 权限设置对话框
const permissionDialogVisible = ref(false)
const selectedRole = reactive({
  id: '',
  roleName: ''
})

// 权限树数据
const permissionTree = ref([
  {
    id: 'system',
    label: '系统管理',
    children: [
      { id: 'system:user', label: '用户管理' },
      { id: 'system:role', label: '角色管理' },
      { id: 'system:menu', label: '菜单管理' },
      { id: 'system:log', label: '日志管理' }
    ]
  },
  {
    id: 'dashboard',
    label: '仪表盘',
    children: [
      { id: 'dashboard:view', label: '查看仪表盘' },
      { id: 'dashboard:export', label: '导出数据' }
    ]
  },
  {
    id: 'energy',
    label: '能耗管理',
    children: [
      { id: 'energy:monitor', label: '实时监控' },
      { id: 'energy:analysis', label: '能耗分析' },
      { id: 'energy:report', label: '报表生成' }
    ]
  },
  {
    id: 'alarm',
    label: '告警管理',
    children: [
      { id: 'alarm:view', label: '查看告警' },
      { id: 'alarm:handle', label: '处理告警' },
      { id: 'alarm:export', label: '导出告警' }
    ]
  }
])

// 权限树配置
const permissionTreeProps = {
  children: 'children',
  label: 'label'
}

// 选中的权限
const checkedPermissions = ref([])

// 删除对话框
const deleteDialogVisible = ref(false)
const deleteRoleId = ref('')
const deleteRoleName = ref('')

// 加载角色数据
const loadRoles = () => {
  loading.value = true
  
  // 模拟异步加载
  setTimeout(() => {
    const rolesData = localStorage.getItem('roles')
    if (rolesData) {
      const parsedRoles = JSON.parse(rolesData)
      roles.splice(0, roles.length, ...parsedRoles)
    } else {
      // 如果没有角色数据，使用模拟数据
      const mockRoles = [
        {
          id: '1', 
          roleKey: 'admin', 
          roleName: '管理员', 
          description: '系统管理员，拥有所有权限', 
          status: true,
          createTime: '2023-01-01 10:00:00',
          updateTime: '2023-01-01 10:00:00'
        },
        {
          id: '2', 
          roleKey: 'user', 
          roleName: '普通用户', 
          description: '普通系统用户，拥有基本操作权限', 
          status: true,
          createTime: '2023-01-01 10:00:00',
          updateTime: '2023-01-01 10:00:00'
        },
        {
          id: '3', 
          roleKey: 'viewer', 
          roleName: '查看者', 
          description: '只能查看数据，不能进行操作', 
          status: true,
          createTime: '2023-01-01 10:00:00',
          updateTime: '2023-01-01 10:00:00'
        }
      ]
      roles.splice(0, roles.length, ...mockRoles)
      localStorage.setItem('roles', JSON.stringify(mockRoles))
    }
    
    loading.value = false
  }, 500)
}

// 保存角色数据
const saveRoles = () => {
  localStorage.setItem('roles', JSON.stringify(roles))
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

// 过滤后的角色列表
const filteredRoles = computed(() => {
  return roles.filter(role => {
    // 角色名称过滤
    if (searchForm.roleName && !role.roleName.includes(searchForm.roleName)) {
      return false
    }
    
    // 角色标识过滤
    if (searchForm.roleKey && !role.roleKey.includes(searchForm.roleKey)) {
      return false
    }
    
    // 状态过滤
    if (searchForm.status !== '' && role.status !== searchForm.status) {
      return false
    }
    
    return true
  })
})

// 分页后的角色列表
const pagedRoles = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredRoles.value.slice(start, end)
})

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
}

// 重置搜索
const handleReset = () => {
  searchForm.roleName = ''
  searchForm.roleKey = ''
  searchForm.status = ''
  pagination.currentPage = 1
}

// 打开新增角色对话框
const handleAddRole = () => {
  dialogTitle.value = '新增角色'
  isEdit.value = false
  resetRoleForm()
  dialogVisible.value = true
}

// 打开编辑角色对话框
const handleEditRole = (row) => {
  dialogTitle.value = '编辑角色'
  isEdit.value = true
  
  // 复制角色数据到表单
  Object.assign(roleForm, { ...row })
  
  dialogVisible.value = true
}

// 重置角色表单
const resetRoleForm = () => {
  if (roleFormRef.value) {
    roleFormRef.value.resetFields()
  }
  
  Object.assign(roleForm, {
    id: '',
    roleKey: '',
    roleName: '',
    description: '',
    status: true
  })
}

// 关闭对话框
const handleDialogClose = () => {
  resetRoleForm()
}

// 提交表单
const handleSubmit = async () => {
  if (!roleFormRef.value) return
  
  try {
    await roleFormRef.value.validate()
    
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
      // 编辑角色
      const index = roles.findIndex(r => r.id === roleForm.id)
      if (index !== -1) {
        roles[index] = {
          ...roles[index],
          ...roleForm,
          updateTime: now
        }
        saveRoles()
        ElMessage.success('角色信息更新成功')
        addSystemLog('角色管理-编辑', `编辑角色：${roles[index].roleName}`)
      }
    } else {
      // 新增角色
      const newRole = {
        ...roleForm,
        id: Date.now().toString(),
        createTime: now,
        updateTime: now
      }
      roles.push(newRole)
      saveRoles()
      ElMessage.success('角色新增成功')
      addSystemLog('角色管理-新增', `新增角色：${newRole.roleName}`)
    }
    
    dialogVisible.value = false
  } catch (error) {
    // 表单验证失败
    console.error('表单验证失败:', error)
  }
}

// 打开角色权限设置对话框
const handlePermission = (row) => {
  selectedRole.id = row.id
  selectedRole.roleName = row.roleName
  
  // 加载角色已有的权限（这里使用模拟数据，实际应该从localStorage获取）
  // 管理员角色默认拥有所有权限
  if (row.roleKey === 'admin') {
    // 勾选所有权限
    const getAllPermissionIds = (tree) => {
      let ids = []
      tree.forEach(node => {
        ids.push(node.id)
        if (node.children && node.children.length > 0) {
          ids = [...ids, ...getAllPermissionIds(node.children)]
        }
      })
      return ids
    }
    checkedPermissions.value = getAllPermissionIds(permissionTree.value)
  } else {
    // 普通角色默认没有权限或从localStorage获取
    checkedPermissions.value = []
  }
  
  permissionDialogVisible.value = true
}

// 关闭权限设置对话框
const handlePermissionDialogClose = () => {
  checkedPermissions.value = []
}

// 保存角色权限
const handleSavePermission = () => {
  // 这里可以将角色权限保存到localStorage
  // 示例：保存权限信息
  const rolePermissions = {
    roleId: selectedRole.id,
    permissions: checkedPermissions.value,
    updateTime: new Date().toLocaleString('zh-CN')
  }
  
  // 保存到localStorage
  const permissionsData = localStorage.getItem('rolePermissions')
  let allPermissions = permissionsData ? JSON.parse(permissionsData) : []
  
  const existingIndex = allPermissions.findIndex(p => p.roleId === selectedRole.id)
  if (existingIndex !== -1) {
    allPermissions[existingIndex] = rolePermissions
  } else {
    allPermissions.push(rolePermissions)
  }
  
  localStorage.setItem('rolePermissions', JSON.stringify(allPermissions))
  
  ElMessage.success('角色权限设置保存成功')
  addSystemLog('角色管理-权限设置', `保存角色权限：${selectedRole.roleName}`)
  permissionDialogVisible.value = false
}

// 打开删除确认对话框
const handleDeleteRole = (row) => {
  deleteRoleId.value = row.id
  deleteRoleName.value = row.roleName
  deleteDialogVisible.value = true
}

// 确认删除
const handleConfirmDelete = () => {
  const index = roles.findIndex(r => r.id === deleteRoleId.value)
  if (index !== -1) {
    // 检查是否有用户使用该角色
    const usersData = localStorage.getItem('users')
    if (usersData) {
      const users = JSON.parse(usersData)
      const hasUsers = users.some(user => user.roleId === deleteRoleId.value)
      
      if (hasUsers) {
        ElMessage.warning('该角色已被用户使用，无法删除')
        deleteDialogVisible.value = false
        return
      }
    }
    
    roles.splice(index, 1)
    saveRoles()
    ElMessage.success('角色删除成功')
    addSystemLog('角色管理-删除', `删除角色：${deleteRoleName.value}`)
  }
  
  deleteDialogVisible.value = false
}

// 状态变更
const handleStatusChange = (row) => {
  // 管理员角色状态不可修改
  if (row.roleKey === 'admin') {
    row.status = true
    ElMessage.warning('管理员角色状态不可修改')
    return
  }
  
  // 更新本地存储
  saveRoles()
  
  const statusText = row.status ? '启用' : '禁用'
  ElMessage.success(`角色${statusText}成功`)
  addSystemLog('角色管理-状态变更', `角色${row.roleName}状态调整为：${statusText}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadRoles()
})
</script>

<style scoped>
.role-management-container {
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

.role-key-hint,
.role-status-hint {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}

.permission-dialog-content h3 {
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
}

.permission-hint {
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
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