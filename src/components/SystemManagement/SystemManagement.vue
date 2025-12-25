<template>
  <div class="system-management-container">
    <el-card shadow="hover" class="system-card">
      <template #header>
        <div class="card-header">
          <h2>系统管理</h2>
        </div>
      </template>
      
      <!-- 标签页导航 -->
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="系统概览" name="overview">
          <SystemOverview />
        </el-tab-pane>
        <el-tab-pane label="用户管理" name="user">
          <UserManagement />
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="role">
          <RoleManagement />
        </el-tab-pane>
        <el-tab-pane label="菜单管理" name="menu">
          <MenuManagement />
        </el-tab-pane>
        <el-tab-pane label="系统日志" name="log">
          <LogManagement />
        </el-tab-pane>
        <el-tab-pane label="系统设置" name="settings">
          <SystemSettings />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { ref } from 'vue'
import SystemOverview from './SystemOverview.vue'
import UserManagement from './UserManagement.vue'
import RoleManagement from './RoleManagement.vue'
import MenuManagement from './MenuManagement.vue'
import LogManagement from './LogManagement.vue'
import SystemSettings from './SystemSettings.vue'

export default {
  name: 'SystemManagement',
  components: {
    SystemOverview,
    UserManagement,
    RoleManagement,
    MenuManagement,
    LogManagement,
    SystemSettings
  },
  setup() {
    const activeTab = ref('overview')
    
    return {
      activeTab
    }
  }
}
</script>

<style scoped>
.system-management-container {
  padding: 20px;
}

.system-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .system-management-container {
    padding: 10px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .card-header h2,
  .card-header h3 {
    margin-bottom: 10px;
  }
}
</style>