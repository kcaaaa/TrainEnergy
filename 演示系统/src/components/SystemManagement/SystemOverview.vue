<template>
  <div class="system-overview-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统概览</h2>
      <div class="header-info">
        <span class="system-time">{{ currentTime }}</span>
        <span class="system-status">
          <el-tag type="success">运行正常</el-tag>
        </span>
      </div>
    </div>

    <!-- 关键指标卡片 -->
    <div class="metrics-cards">
      <el-card class="metric-card" shadow="hover">
        <div class="metric-content">
          <div class="metric-icon user-icon">
            <i class="fa fa-users"></i>
          </div>
          <div class="metric-info">
            <div class="metric-title">用户总数</div>
            <div class="metric-value">{{ userCount }}</div>
            <div class="metric-change">
              <i class="fa fa-arrow-up" style="color: #67c23a;"></i>
              <span>环比增长 {{ userGrowthRate }}%</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card" shadow="hover">
        <div class="metric-content">
          <div class="metric-icon role-icon">
            <i class="fa fa-user-circle"></i>
          </div>
          <div class="metric-info">
            <div class="metric-title">角色数量</div>
            <div class="metric-value">{{ roleCount }}</div>
            <div class="metric-change">
              <i class="fa fa-arrow-up" style="color: #67c23a;"></i>
              <span>环比增长 {{ roleGrowthRate }}%</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card" shadow="hover">
        <div class="metric-content">
          <div class="metric-icon menu-icon">
            <i class="fa fa-bars"></i>
          </div>
          <div class="metric-info">
            <div class="metric-title">菜单总数</div>
            <div class="metric-value">{{ menuCount }}</div>
            <div class="metric-change">
              <i class="fa fa-arrow-down" style="color: #f56c6c;"></i>
              <span>环比减少 {{ menuDecreaseRate }}%</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="metric-card" shadow="hover">
        <div class="metric-content">
          <div class="metric-icon log-icon">
            <i class="fa fa-file-text"></i>
          </div>
          <div class="metric-info">
            <div class="metric-title">日志数量</div>
            <div class="metric-value">{{ logCount }}</div>
            <div class="metric-change">
              <i class="fa fa-arrow-up" style="color: #67c23a;"></i>
              <span>今日新增 {{ todayLogCount }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 系统状态与数据图表 -->
    <div class="content-row">
      <!-- 系统状态监控 -->
      <el-card class="status-card">
        <template #header>
          <div class="card-header">
            <h3>系统状态监控</h3>
          </div>
        </template>
        <div class="status-content">
          <div class="status-item">
            <span class="status-label">系统运行时间：</span>
            <span class="status-value">{{ systemUptime }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">当前在线用户：</span>
            <span class="status-value">{{ onlineUsers }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">系统版本：</span>
            <span class="status-value">{{ systemVersion }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">最后更新：</span>
            <span class="status-value">{{ lastUpdateTime }}</span>
          </div>
          
          <!-- 资源使用情况 -->
          <div class="resource-section">
            <h4>资源使用情况</h4>
            <div class="resource-item">
              <div class="resource-label">
                <span>CPU使用率</span>
                <span class="resource-percent">{{ cpuUsage }}%</span>
              </div>
              <el-progress :percentage="cpuUsage" :color="getProgressColor(cpuUsage)"></el-progress>
            </div>
            <div class="resource-item">
              <div class="resource-label">
                <span>内存使用率</span>
                <span class="resource-percent">{{ memoryUsage }}%</span>
              </div>
              <el-progress :percentage="memoryUsage" :color="getProgressColor(memoryUsage)"></el-progress>
            </div>
            <div class="resource-item">
              <div class="resource-label">
                <span>磁盘使用率</span>
                <span class="resource-percent">{{ diskUsage }}%</span>
              </div>
              <el-progress :percentage="diskUsage" :color="getProgressColor(diskUsage)"></el-progress>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 日志类型分布图表 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <h3>日志类型分布</h3>
          </div>
        </template>
        <div class="chart-container">
          <div id="logTypeChart" ref="logTypeChart" class="chart"></div>
        </div>
      </el-card>
    </div>

    <!-- 数据统计图表 -->
    <div class="content-row">
      <!-- 用户活跃度趋势 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <h3>用户活跃度趋势</h3>
          </div>
        </template>
        <div class="chart-container">
          <div id="userActivityChart" ref="userActivityChart" class="chart"></div>
        </div>
      </el-card>

      <!-- 系统访问量统计 -->
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <h3>系统访问量统计</h3>
          </div>
        </template>
        <div class="chart-container">
          <div id="accessStatsChart" ref="accessStatsChart" class="chart"></div>
        </div>
      </el-card>
    </div>

    <!-- 最新动态 -->
    <div class="content-row">
      <!-- 最新登录记录 -->
      <el-card class="activity-card">
        <template #header>
          <div class="card-header">
            <h3>最新登录记录</h3>
            <el-button type="text" size="small">查看全部</el-button>
          </div>
        </template>
        <el-table :data="latestLoginRecords" stripe style="width: 100%" height="200">
          <el-table-column prop="username" label="用户名" width="120"></el-table-column>
          <el-table-column prop="ip" label="登录IP" width="150"></el-table-column>
          <el-table-column prop="location" label="登录地点" width="150"></el-table-column>
          <el-table-column prop="time" label="登录时间" width="180"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === '成功' ? 'success' : 'danger'" size="small">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 最近操作日志 -->
      <el-card class="activity-card">
        <template #header>
          <div class="card-header">
            <h3>最近操作日志</h3>
            <el-button type="text" size="small">查看全部</el-button>
          </div>
        </template>
        <el-table :data="latestOperationLogs" stripe style="width: 100%" height="200">
          <el-table-column prop="username" label="操作人" width="120"></el-table-column>
          <el-table-column prop="module" label="操作模块" width="120"></el-table-column>
          <el-table-column prop="action" label="操作内容" min-width="180"></el-table-column>
          <el-table-column prop="time" label="操作时间" width="180"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'

// 系统时间
const currentTime = ref('')
const systemUptime = ref('0天 00:00:00')
const startTime = new Date()

// 关键指标数据
const userCount = ref(0)
const roleCount = ref(0)
const menuCount = ref(0)
const logCount = ref(0)
const todayLogCount = ref(0)

// 增长数据
const userGrowthRate = ref(15.6)
const roleGrowthRate = ref(8.2)
const menuDecreaseRate = ref(2.1)

// 系统状态数据
const onlineUsers = ref(5)
const systemVersion = ref('v1.0.0')
const lastUpdateTime = ref('2023-10-01 14:30:00')

// 资源使用数据
const cpuUsage = ref(35)
const memoryUsage = ref(68)
const diskUsage = ref(42)

// 最新登录记录
const latestLoginRecords = ref([
  { username: 'admin', ip: '127.0.0.1', location: '本地', time: '2023-10-15 09:30:25', status: '成功' },
  { username: 'user1', ip: '192.168.1.100', location: '北京', time: '2023-10-15 08:45:12', status: '成功' },
  { username: 'user2', ip: '10.0.0.5', location: '上海', time: '2023-10-14 16:20:33', status: '成功' },
  { username: 'user3', ip: '203.0.113.195', location: '广州', time: '2023-10-14 14:15:45', status: '失败' },
  { username: 'user4', ip: '172.16.0.25', location: '深圳', time: '2023-10-14 11:05:18', status: '成功' }
])

// 最近操作日志
const latestOperationLogs = ref([
  { username: 'admin', module: '用户管理', action: '新增用户 user5', time: '2023-10-15 09:45:20' },
  { username: 'user1', module: '角色管理', action: '修改角色权限', time: '2023-10-15 09:12:35' },
  { username: 'admin', module: '菜单管理', action: '新增菜单 系统设置', time: '2023-10-14 16:45:50' },
  { username: 'user2', module: '日志管理', action: '导出系统日志', time: '2023-10-14 15:30:12' },
  { username: 'user3', module: '用户管理', action: '修改个人信息', time: '2023-10-14 14:20:45' }
])

// 图表实例
let logTypeChart = null
let userActivityChart = null
let accessStatsChart = null

// 定时器ID
let timeUpdateTimer = null
let uptimeUpdateTimer = null

// 格式化当前时间
const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 更新系统运行时间
const updateSystemUptime = () => {
  const now = new Date()
  const diff = now - startTime
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  systemUptime.value = `${days}天 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage < 50) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

// 从LocalStorage获取系统数据
const loadSystemData = () => {
  // 获取用户数据
  const users = localStorage.getItem('users')
  if (users) {
    userCount.value = JSON.parse(users).length
  } else {
    userCount.value = 10
  }

  // 获取角色数据
  const roles = localStorage.getItem('roles')
  if (roles) {
    roleCount.value = JSON.parse(roles).length
  } else {
    roleCount.value = 5
  }

  // 获取菜单数据
  const menus = localStorage.getItem('menuList')
  if (menus) {
    menuCount.value = JSON.parse(menus).length
  } else {
    menuCount.value = 20
  }

  // 获取日志数据
  const logs = localStorage.getItem('systemLogs')
  if (logs) {
    const logList = JSON.parse(logs)
    logCount.value = logList.length
    
    // 计算今日新增日志数
    const today = new Date().toDateString()
    todayLogCount.value = logList.filter(log => new Date(log.createTime).toDateString() === today).length
  } else {
    logCount.value = 100
    todayLogCount.value = 15
  }
}

// 初始化日志类型分布图表
const initLogTypeChart = () => {
  const chartDom = document.getElementById('logTypeChart')
  if (chartDom) {
    logTypeChart = echarts.init(chartDom)
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['系统日志', '操作日志', '错误日志', '登录日志']
      },
      series: [
        {
          name: '日志类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 35, name: '系统日志' },
            { value: 45, name: '操作日志' },
            { value: 10, name: '错误日志' },
            { value: 10, name: '登录日志' }
          ]
        }
      ]
    }
    
    logTypeChart.setOption(option)
  }
}

// 初始化用户活跃度趋势图表
const initUserActivityChart = () => {
  const chartDom = document.getElementById('userActivityChart')
  if (chartDom) {
    userActivityChart = echarts.init(chartDom)
    
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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '活跃用户',
          type: 'line',
          stack: 'Total',
          data: [120, 132, 101, 134, 90, 230, 210],
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
    
    userActivityChart.setOption(option)
  }
}

// 初始化系统访问量统计图表
const initAccessStatsChart = () => {
  const chartDom = document.getElementById('accessStatsChart')
  if (chartDom) {
    accessStatsChart = echarts.init(chartDom)
    
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: ['系统管理', '用户管理', '角色管理', '菜单管理', '日志管理']
      },
      series: [
        {
          name: '访问量',
          type: 'bar',
          data: [1820, 1932, 1201, 1344, 900],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#409EFF' },
              { offset: 1, color: '#67c23a' }
            ])
          }
        }
      ]
    }
    
    accessStatsChart.setOption(option)
  }
}

// 监听窗口大小变化，调整图表尺寸
const handleResize = () => {
  if (logTypeChart) logTypeChart.resize()
  if (userActivityChart) userActivityChart.resize()
  if (accessStatsChart) accessStatsChart.resize()
}

// 组件挂载
onMounted(() => {
  // 更新时间
  updateCurrentTime()
  timeUpdateTimer = setInterval(updateCurrentTime, 1000)
  
  // 更新系统运行时间
  updateSystemUptime()
  uptimeUpdateTimer = setInterval(updateSystemUptime, 1000)
  
  // 加载系统数据
  loadSystemData()
  
  // 初始化图表
  initLogTypeChart()
  initUserActivityChart()
  initAccessStatsChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 组件卸载
onUnmounted(() => {
  // 清除定时器
  if (timeUpdateTimer) clearInterval(timeUpdateTimer)
  if (uptimeUpdateTimer) clearInterval(uptimeUpdateTimer)
  
  // 销毁图表实例
  if (logTypeChart) {
    logTypeChart.dispose()
    logTypeChart = null
  }
  if (userActivityChart) {
    userActivityChart.dispose()
    userActivityChart = null
  }
  if (accessStatsChart) {
    accessStatsChart.dispose()
    accessStatsChart = null
  }
  
  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.system-overview-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.system-time {
  font-size: 14px;
  color: #606266;
}

.metrics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  height: 120px;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 20px;
}

.user-icon {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.role-icon {
  background-color: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.menu-icon {
  background-color: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.log-icon {
  background-color: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.metric-info {
  flex: 1;
}

.metric-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.metric-change {
  font-size: 12px;
  color: #67c23a;
}

.content-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.status-card, .chart-card, .activity-card {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-size: 14px;
  color: #606266;
}

.status-value {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.resource-section {
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.resource-section h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.resource-item {
  margin-bottom: 15px;
}

.resource-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 13px;
  color: #606266;
}

.resource-percent {
  font-weight: 500;
  color: #303133;
}

.chart-container {
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}

.activity-card .el-table {
  font-size: 13px;
}

.activity-card .el-table th {
  font-weight: 600;
}

@media (max-width: 768px) {
  .content-row {
    grid-template-columns: 1fr;
  }
  
  .metrics-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
