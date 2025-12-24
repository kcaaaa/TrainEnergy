<template>
  <div class="log-management-container">
    <el-card class="log-card">
      <template #header>
        <div class="card-header">
          <h3>日志管理</h3>
          <div class="header-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="输入关键词搜索日志"
              clearable
              size="small"
              class="search-input"
            >
              <template #prefix>
                <i class="fa fa-search"></i>
              </template>
            </el-input>
            <el-select
              v-model="logTypeFilter"
              placeholder="日志类型"
              size="small"
              class="filter-select"
            >
              <el-option label="全部类型" value=""></el-option>
              <el-option label="系统日志" value="system"></el-option>
              <el-option label="操作日志" value="operation"></el-option>
              <el-option label="错误日志" value="error"></el-option>
              <el-option label="登录日志" value="login"></el-option>
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              class="date-picker"
            ></el-date-picker>
            <el-button type="success" size="small" @click="handleExportLogs">
              <i class="fa fa-download"></i> 导出日志
            </el-button>
          </div>
        </div>
      </template>

      <!-- 日志列表表格 -->
      <el-table
        :data="pagedLogs"
        stripe
        style="width: 100%"
        height="500"
        v-loading="loading"
        element-loading-text="加载日志数据中..."
      >
        <el-table-column prop="id" label="日志ID" width="80" align="center"></el-table-column>
        <el-table-column prop="type" label="日志类型" width="120" align="center">
          <template #default="scope">
            <el-tag
              :type="getLogTypeTagType(scope.row.type)"
              size="small"
            >
              {{ getLogTypeName(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="日志标题" min-width="150"></el-table-column>
        <el-table-column prop="content" label="日志内容" min-width="250">
          <template #default="scope">
            <div class="log-content">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="120" align="center"></el-table-column>
        <el-table-column prop="ip" label="操作IP" width="120" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template #default="scope">
            {{ formatDateTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click="handleViewLogDetail(scope.row)"
              title="查看详情"
            >
              <i class="fa fa-eye"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredLogs.length"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 日志详情弹窗 -->
    <el-dialog
      v-model="logDetailVisible"
      title="日志详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="log-detail-content">
        <div class="detail-item">
          <span class="detail-label">日志ID：</span>
          <span class="detail-value">{{ selectedLog.id }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">日志类型：</span>
          <span class="detail-value">
            <el-tag :type="getLogTypeTagType(selectedLog.type)">{{ getLogTypeName(selectedLog.type) }}</el-tag>
          </span>
        </div>
        <div class="detail-item">
          <span class="detail-label">日志标题：</span>
          <span class="detail-value">{{ selectedLog.title }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">日志内容：</span>
          <span class="detail-value log-full-content">{{ selectedLog.content }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">操作人：</span>
          <span class="detail-value">{{ selectedLog.operator }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">操作IP：</span>
          <span class="detail-value">{{ selectedLog.ip }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">用户代理：</span>
          <span class="detail-value user-agent">{{ selectedLog.userAgent }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">创建时间：</span>
          <span class="detail-value">{{ formatDateTime(selectedLog.createTime) }}</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="logDetailVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 状态管理
const loading = ref(false)
const searchKeyword = ref('')
const logTypeFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const logDetailVisible = ref(false)
const selectedLog = ref({})

// 日志数据
const logList = ref([])

// 过滤后的日志
const filteredLogs = computed(() => {
  let result = [...logList.value]

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(log => 
      log.title.toLowerCase().includes(keyword) || 
      log.content.toLowerCase().includes(keyword) ||
      log.operator.toLowerCase().includes(keyword) ||
      log.ip.includes(keyword)
    )
  }

  // 日志类型过滤
  if (logTypeFilter.value) {
    result = result.filter(log => log.type === logTypeFilter.value)
  }

  // 日期范围过滤
  if (dateRange.value && dateRange.value.length === 2) {
    const startTime = dateRange.value[0].getTime()
    const endTime = dateRange.value[1].getTime()
    result = result.filter(log => {
      const logTime = new Date(log.createTime).getTime()
      return logTime >= startTime && logTime <= endTime
    })
  }

  return result
})

// 分页后的日志
const pagedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

// 获取日志类型标签样式
const getLogTypeTagType = (type) => {
  const typeMap = {
    system: 'info',
    operation: 'primary',
    error: 'danger',
    login: 'success'
  }
  return typeMap[type] || 'info'
}

// 获取日志类型名称
const getLogTypeName = (type) => {
  const typeMap = {
    system: '系统日志',
    operation: '操作日志',
    error: '错误日志',
    login: '登录日志'
  }
  return typeMap[type] || '未知类型'
}

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 查看日志详情
const handleViewLogDetail = (log) => {
  selectedLog.value = { ...log }
  logDetailVisible.value = true
}

// 导出日志
const handleExportLogs = () => {
  if (filteredLogs.value.length === 0) {
    ElMessage.warning('没有日志数据可导出')
    return
  }

  // 构造CSV内容
  const headers = ['日志ID', '日志类型', '日志标题', '日志内容', '操作人', '操作IP', '创建时间']
  const csvContent = [
    headers.join(','),
    ...filteredLogs.value.map(log => [
      log.id,
      `"${getLogTypeName(log.type)}"`,
      `"${log.title}"`,
      `"${log.content.replace(/"/g, '""')}"`,
      `"${log.operator}"`,
      log.ip,
      `"${formatDateTime(log.createTime)}"`
    ].join(','))
  ].join('\n')

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `系统日志_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('日志导出成功')
  // 记录操作日志
  addSystemLog('日志管理', `导出系统日志，共${filteredLogs.value.length}条记录`)
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current) => {
  currentPage.value = current
}

// 从LocalStorage加载日志数据
const loadLogData = () => {
  loading.value = true
  // 模拟加载延迟
  setTimeout(() => {
    const savedLogs = localStorage.getItem('systemLogs')
    if (savedLogs) {
      logList.value = JSON.parse(savedLogs)
    } else {
      // 初始化默认日志数据
      const defaultLogs = generateDefaultLogs()
      logList.value = defaultLogs
      localStorage.setItem('systemLogs', JSON.stringify(defaultLogs))
    }
    loading.value = false
  }, 500)
}

// 生成默认日志数据
const generateDefaultLogs = () => {
  const logs = []
  const types = ['system', 'operation', 'error', 'login']
  const operators = ['admin', 'user1', 'user2', 'system']
  const titles = ['系统启动', '用户登录', '数据修改', '配置更新', '异常错误']
  const ips = ['127.0.0.1', '192.168.1.100', '10.0.0.5', '203.0.113.195']
  
  for (let i = 1; i <= 50; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const operator = operators[Math.floor(Math.random() * operators.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]
    const ip = ips[Math.floor(Math.random() * ips.length)]
    
    logs.push({
      id: i,
      type,
      title,
      content: `这是一条${getLogTypeName(type)}记录，用于演示日志管理功能。操作人：${operator}，IP地址：${ip}。`,
      operator,
      ip,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      createTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
    })
  }
  
  // 按时间倒序排序
  return logs.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
}

// 添加系统日志
const addSystemLog = (module, content) => {
  const newLog = {
    id: logList.value.length + 1,
    type: 'system',
    title: `系统操作 - ${module}`,
    content,
    operator: 'system',
    ip: '127.0.0.1',
    userAgent: '系统内部操作',
    createTime: new Date().toISOString()
  }
  
  logList.value.unshift(newLog)
  // 只保留最近1000条日志
  if (logList.value.length > 1000) {
    logList.value = logList.value.slice(0, 1000)
  }
  localStorage.setItem('systemLogs', JSON.stringify(logList.value))
}

// 组件挂载时加载数据
onMounted(() => {
  loadLogData()
})
</script>

<style scoped>
.log-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  width: 200px;
}

.filter-select {
  width: 120px;
}

.date-picker {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.log-content {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.log-detail-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  margin-bottom: 10px;
}

.detail-label {
  width: 80px;
  font-weight: 600;
  color: #606266;
}

.detail-value {
  flex: 1;
  word-break: break-word;
}

.log-full-content {
  background-color: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  min-height: 80px;
}

.user-agent {
  background-color: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  overflow-wrap: break-word;
}
</style>
