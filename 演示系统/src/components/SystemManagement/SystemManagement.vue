<template>
  <div class="system-management-container">
    <el-card shadow="hover" class="system-card">
      <template #header>
        <div class="card-header">
          <h2>系统管理</h2>
        </div>
      </template>
      
      <!-- 系统概览 -->
      <div class="system-overview">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="overview-card">
              <div class="card-content">
                <div class="card-icon system-icon">
                  <i class="fas fa-server"></i>
                </div>
                <div class="card-info">
                  <div class="card-title">系统版本</div>
                  <div class="card-value">v1.0.0</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="overview-card">
              <div class="card-content">
                <div class="card-icon performance-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <div class="card-info">
                  <div class="card-title">CPU使用率</div>
                  <div class="card-value">35%</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="overview-card">
              <div class="card-content">
                <div class="card-icon memory-icon">
                  <i class="fas fa-memory"></i>
                </div>
                <div class="card-info">
                  <div class="card-title">内存使用率</div>
                  <div class="card-value">48%</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="overview-card">
              <div class="card-content">
                <div class="card-icon storage-icon">
                  <i class="fas fa-hdd"></i>
                </div>
                <div class="card-info">
                  <div class="card-title">磁盘使用率</div>
                  <div class="card-value">62%</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 系统状态图表 -->
      <div class="system-status">
        <el-row :gutter="20">
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-title">CPU使用趋势</div>
              </template>
              <div ref="cpuChart" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-title">内存使用趋势</div>
              </template>
              <div ref="memoryChart" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 用户管理 -->
      <div class="user-management">
        <el-card class="user-card">
          <template #header>
            <div class="card-header">
              <h3>用户管理</h3>
              <el-button type="primary" size="small" @click="handleAddUser">
                <i class="fas fa-user-plus"></i> 新增用户
              </el-button>
            </div>
          </template>
          <el-table :data="users" stripe style="width: 100%">
            <el-table-column prop="id" label="用户ID" width="80" />
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="role" label="角色" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
                  {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-switch v-model="scope.row.status" @change="handleStatusChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="lastLogin" label="最后登录" width="180" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="handleEditUser(scope.row)">
                  <i class="fas fa-edit"></i> 编辑
                </el-button>
                <el-button size="small" type="danger" @click="handleDeleteUser(scope.row)">
                  <i class="fas fa-trash"></i> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 系统设置 -->
      <div class="system-settings">
        <el-card class="settings-card">
          <template #header>
            <div class="card-title">系统设置</div>
          </template>
          <el-form :model="systemSettings" label-width="120px">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="系统名称">
                  <el-input v-model="systemSettings.systemName" />
                </el-form-item>
                <el-form-item label="数据刷新间隔">
                  <el-select v-model="systemSettings.refreshInterval" style="width: 100%">
                    <el-option label="1分钟" value="1" />
                    <el-option label="5分钟" value="5" />
                    <el-option label="10分钟" value="10" />
                    <el-option label="30分钟" value="30" />
                  </el-select>
                </el-form-item>
                <el-form-item label="自动备份">
                  <el-switch v-model="systemSettings.autoBackup" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="备份频率">
                  <el-select v-model="systemSettings.backupFrequency" style="width: 100%" :disabled="!systemSettings.autoBackup">
                    <el-option label="每日" value="daily" />
                    <el-option label="每周" value="weekly" />
                    <el-option label="每月" value="monthly" />
                  </el-select>
                </el-form-item>
                <el-form-item label="主题设置">
                  <el-select v-model="systemSettings.theme" style="width: 100%">
                    <el-option label="明亮" value="light" />
                    <el-option label="暗黑" value="dark" />
                  </el-select>
                </el-form-item>
                <el-form-item label="语言">
                  <el-select v-model="systemSettings.language" style="width: 100%">
                    <el-option label="中文" value="zh-CN" />
                    <el-option label="English" value="en-US" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="handleSaveSettings">保存设置</el-button>
              <el-button @click="handleResetSettings">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- 系统日志 -->
      <div class="system-logs">
        <el-card class="logs-card">
          <template #header>
            <div class="card-header">
              <h3>系统日志</h3>
              <el-select v-model="logType" placeholder="日志类型" size="small" style="width: 150px; margin-right: 10px">
                <el-option label="所有" value="all" />
                <el-option label="登录" value="login" />
                <el-option label="操作" value="operation" />
                <el-option label="错误" value="error" />
              </el-select>
              <el-input v-model="logKeyword" placeholder="搜索日志" size="small" style="width: 200px" />
            </div>
          </template>
          <el-table :data="filteredLogs" stripe style="width: 100%" height="350">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="user" label="用户" width="100" />
            <el-table-column prop="type" label="类型" width="100">
              <template #default="scope">
                <el-tag :type="getLogTypeColor(scope.row.type)">
                  {{ scope.row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" />
            <el-table-column prop="ip" label="IP地址" width="120" />
          </el-table>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'SystemManagement',
  setup() {
    // 图表实例
    const cpuChart = ref(null)
    const memoryChart = ref(null)
    let cpuChartInstance = null
    let memoryChartInstance = null

    // 用户数据
    const users = reactive([
      { id: 1, username: 'admin', role: 'admin', status: true, lastLogin: '2023-12-01 14:30:00' },
      { id: 2, username: 'user1', role: 'user', status: true, lastLogin: '2023-12-01 10:20:00' },
      { id: 3, username: 'user2', role: 'user', status: false, lastLogin: '2023-11-28 09:15:00' },
      { id: 4, username: 'user3', role: 'user', status: true, lastLogin: '2023-11-30 16:45:00' },
      { id: 5, username: 'user4', role: 'user', status: true, lastLogin: '2023-12-01 11:05:00' }
    ])

    // 系统设置
    const systemSettings = reactive({
      systemName: '高铁站节能降耗管理系统',
      refreshInterval: '5',
      autoBackup: true,
      backupFrequency: 'daily',
      theme: 'light',
      language: 'zh-CN'
    })

    // 系统日志
    const logType = ref('all')
    const logKeyword = ref('')
    const logs = reactive([
      { time: '2023-12-01 14:30:00', user: 'admin', type: 'login', content: '管理员登录系统', ip: '192.168.1.100' },
      { time: '2023-12-01 14:25:00', user: 'user1', type: 'operation', content: '查看能耗分析', ip: '192.168.1.101' },
      { time: '2023-12-01 14:20:00', user: 'admin', type: 'error', content: '设备数据同步失败', ip: '192.168.1.100' },
      { time: '2023-12-01 14:15:00', user: 'user2', type: 'operation', content: '导出能耗报表', ip: '192.168.1.102' },
      { time: '2023-12-01 14:10:00', user: 'admin', type: 'operation', content: '修改系统设置', ip: '192.168.1.100' },
      { time: '2023-12-01 14:05:00', user: 'user3', type: 'login', content: '用户登录系统', ip: '192.168.1.103' },
      { time: '2023-12-01 14:00:00', user: 'user1', type: 'operation', content: '设置能耗阈值', ip: '192.168.1.101' },
      { time: '2023-12-01 13:55:00', user: 'admin', type: 'operation', content: '添加新用户', ip: '192.168.1.100' },
      { time: '2023-12-01 13:50:00', user: 'user4', type: 'error', content: '权限不足', ip: '192.168.1.104' },
      { time: '2023-12-01 13:45:00', user: 'admin', type: 'operation', content: '删除过期日志', ip: '192.168.1.100' }
    ])

    // 过滤后的日志
    const filteredLogs = computed(() => {
      return logs.filter(log => {
        const typeMatch = logType.value === 'all' || log.type === logType.value
        const keywordMatch = !logKeyword.value || log.content.includes(logKeyword.value) || log.user.includes(logKeyword.value)
        return typeMatch && keywordMatch
      })
    })

    // 获取日志类型颜色
    const getLogTypeColor = (type) => {
      switch (type) {
        case 'login': return 'primary'
        case 'operation': return 'success'
        case 'error': return 'danger'
        default: return 'info'
      }
    }

    // 初始化CPU图表
    const initCpuChart = () => {
      if (cpuChartInstance) {
        cpuChartInstance.dispose()
      }
      cpuChartInstance = echarts.init(cpuChart.value)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: 'CPU使用率',
            type: 'line',
            stack: 'Total',
            data: [32, 28, 35, 45, 55, 48, 38, 35],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
              ])
            },
            lineStyle: {
              color: '#409EFF'
            },
            itemStyle: {
              color: '#409EFF'
            }
          }
        ]
      }
      cpuChartInstance.setOption(option)
    }

    // 初始化内存图表
    const initMemoryChart = () => {
      if (memoryChartInstance) {
        memoryChartInstance.dispose()
      }
      memoryChartInstance = echarts.init(memoryChart.value)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '内存使用率',
            type: 'line',
            stack: 'Total',
            data: [42, 38, 45, 52, 58, 55, 48, 45],
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(233, 30, 99, 0.5)' },
                { offset: 1, color: 'rgba(233, 30, 99, 0.1)' }
              ])
            },
            lineStyle: {
              color: '#E91E63'
            },
            itemStyle: {
              color: '#E91E63'
            }
          }
        ]
      }
      memoryChartInstance.setOption(option)
    }

    // 响应式调整图表大小
    const handleResize = () => {
      if (cpuChartInstance) {
        cpuChartInstance.resize()
      }
      if (memoryChartInstance) {
        memoryChartInstance.resize()
      }
    }

    // 用户管理方法
    const handleAddUser = () => {
      // 新增用户逻辑
      console.log('新增用户')
    }

    const handleEditUser = (user) => {
      // 编辑用户逻辑
      console.log('编辑用户:', user)
    }

    const handleDeleteUser = (user) => {
      // 删除用户逻辑
      console.log('删除用户:', user)
    }

    const handleStatusChange = (user) => {
      // 修改用户状态逻辑
      console.log('修改用户状态:', user)
    }

    // 系统设置方法
    const handleSaveSettings = () => {
      // 保存系统设置逻辑
      console.log('保存系统设置:', systemSettings)
      alert('设置已保存')
    }

    const handleResetSettings = () => {
      // 重置系统设置逻辑
      Object.assign(systemSettings, {
        systemName: '高铁站节能降耗管理系统',
        refreshInterval: '5',
        autoBackup: true,
        backupFrequency: 'daily',
        theme: 'light',
        language: 'zh-CN'
      })
    }

    // 生命周期钩子
    onMounted(() => {
      initCpuChart()
      initMemoryChart()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      if (cpuChartInstance) {
        cpuChartInstance.dispose()
      }
      if (memoryChartInstance) {
        memoryChartInstance.dispose()
      }
      window.removeEventListener('resize', handleResize)
    })

    return {
      cpuChart,
      memoryChart,
      users,
      systemSettings,
      logType,
      logKeyword,
      filteredLogs,
      getLogTypeColor,
      handleAddUser,
      handleEditUser,
      handleDeleteUser,
      handleStatusChange,
      handleSaveSettings,
      handleResetSettings
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

/* 系统概览 */
.system-overview {
  margin-bottom: 20px;
}

.overview-card {
  height: 120px;
  border-radius: 8px;
  transition: all 0.3s;
}

.overview-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 20px;
}

.system-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.performance-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.memory-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.storage-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.card-info {
  flex: 1;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-top: 5px;
}

/* 系统状态图表 */
.system-status {
  margin-bottom: 20px;
}

.chart-card {
  height: 300px;
}

.chart-container {
  width: 100%;
  height: calc(100% - 40px);
}

/* 用户管理 */
.user-management {
  margin-bottom: 20px;
}

.user-card {
  margin-bottom: 20px;
}

/* 系统设置 */
.system-settings {
  margin-bottom: 20px;
}

.settings-card {
  margin-bottom: 20px;
}

/* 系统日志 */
.system-logs {
  margin-bottom: 20px;
}

.logs-card {
  margin-bottom: 20px;
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
  
  .card-content {
    flex-direction: column;
    text-align: center;
  }
  
  .card-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>