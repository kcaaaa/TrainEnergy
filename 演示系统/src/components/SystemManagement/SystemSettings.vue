<template>
  <div class="system-settings-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统设置</h2>
      <div class="header-info">
        <span class="system-time">{{ currentTime }}</span>
      </div>
    </div>

    <!-- 系统设置选项卡 -->
    <el-tabs v-model="activeTab" type="card">
      <!-- 系统信息 -->
      <el-tab-pane label="系统信息" name="info">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>系统基本信息</h3>
            </div>
          </template>
          <div class="system-info-content">
            <div class="info-item">
              <span class="info-label">系统名称：</span>
              <span class="info-value">{{ systemInfo.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">系统版本：</span>
              <span class="info-value">{{ systemInfo.version }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">开发框架：</span>
              <span class="info-value">{{ systemInfo.framework }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">数据库版本：</span>
              <span class="info-value">{{ systemInfo.dbVersion }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">最后更新时间：</span>
              <span class="info-value">{{ systemInfo.lastUpdateTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">系统状态：</span>
              <span class="info-value">
                <el-tag type="success" size="small">正常运行</el-tag>
              </span>
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <h3>服务器信息</h3>
            </div>
          </template>
          <div class="system-info-content">
            <div class="info-item">
              <span class="info-label">服务器IP：</span>
              <span class="info-value">{{ serverInfo.ip }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">服务器名称：</span>
              <span class="info-value">{{ serverInfo.name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">操作系统：</span>
              <span class="info-value">{{ serverInfo.os }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">处理器：</span>
              <span class="info-value">{{ serverInfo.cpu }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">内存：</span>
              <span class="info-value">{{ serverInfo.memory }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">运行时间：</span>
              <span class="info-value">{{ serverInfo.uptime }}</span>
            </div>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 安全设置 -->
      <el-tab-pane label="安全设置" name="security">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>密码策略</h3>
            </div>
          </template>
          <el-form :model="securitySettings.password" label-width="150px">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="securitySettings.password.minLength" :min="6" :max="20" />
            </el-form-item>
            <el-form-item label="需要包含大写字母">
              <el-switch v-model="securitySettings.password.requireUppercase" />
            </el-form-item>
            <el-form-item label="需要包含小写字母">
              <el-switch v-model="securitySettings.password.requireLowercase" />
            </el-form-item>
            <el-form-item label="需要包含数字">
              <el-switch v-model="securitySettings.password.requireNumber" />
            </el-form-item>
            <el-form-item label="需要包含特殊字符">
              <el-switch v-model="securitySettings.password.requireSpecialChar" />
            </el-form-item>
            <el-form-item label="密码有效期（天）">
              <el-input-number v-model="securitySettings.password.expireDays" :min="0" :max="365" />
            </el-form-item>
            <el-form-item label="密码错误次数限制">
              <el-input-number v-model="securitySettings.password.maxErrorAttempts" :min="0" :max="10" />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="hover" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <h3>登录安全</h3>
            </div>
          </template>
          <el-form :model="securitySettings.login" label-width="150px">
            <el-form-item label="登录超时时间（分钟）">
              <el-input-number v-model="securitySettings.login.timeoutMinutes" :min="5" :max="120" />
            </el-form-item>
            <el-form-item label="启用验证码登录">
              <el-switch v-model="securitySettings.login.enableCaptcha" />
            </el-form-item>
            <el-form-item label="启用双因素认证">
              <el-switch v-model="securitySettings.login.enable2FA" />
            </el-form-item>
            <el-form-item label="登录IP白名单">
              <el-input v-model="securitySettings.login.ipWhitelist" type="textarea" placeholder="多个IP地址用逗号分隔" :rows="3" />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="hover" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <h3>操作日志</h3>
            </div>
          </template>
          <el-form :model="securitySettings.log" label-width="150px">
            <el-form-item label="记录登录日志">
              <el-switch v-model="securitySettings.log.recordLogin" />
            </el-form-item>
            <el-form-item label="记录操作日志">
              <el-switch v-model="securitySettings.log.recordOperation" />
            </el-form-item>
            <el-form-item label="日志保留天数">
              <el-input-number v-model="securitySettings.log.retentionDays" :min="7" :max="365" />
            </el-form-item>
          </el-form>
        </el-card>

        <div class="form-actions">
          <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
          <el-button @click="resetSecuritySettings">重置</el-button>
        </div>
      </el-tab-pane>

      <!-- 通知设置 -->
      <el-tab-pane label="通知设置" name="notification">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>邮件服务器配置</h3>
            </div>
          </template>
          <el-form :model="notificationSettings.email" label-width="150px">
            <el-form-item label="SMTP服务器">
              <el-input v-model="notificationSettings.email.smtpServer" placeholder="smtp.example.com" />
            </el-form-item>
            <el-form-item label="SMTP端口">
              <el-input-number v-model="notificationSettings.email.smtpPort" :min="1" :max="65535" />
            </el-form-item>
            <el-form-item label="发件人邮箱">
              <el-input v-model="notificationSettings.email.senderEmail" placeholder="noreply@example.com" />
            </el-form-item>
            <el-form-item label="发件人名称">
              <el-input v-model="notificationSettings.email.senderName" placeholder="系统通知" />
            </el-form-item>
            <el-form-item label="认证用户名">
              <el-input v-model="notificationSettings.email.username" />
            </el-form-item>
            <el-form-item label="认证密码">
              <el-input v-model="notificationSettings.email.password" type="password" show-password />
            </el-form-item>
            <el-form-item label="启用SSL/TLS">
              <el-switch v-model="notificationSettings.email.enableSSL" />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="hover" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <h3>通知模板</h3>
            </div>
          </template>
          <el-form :model="notificationSettings.templates" label-width="150px">
            <el-form-item label="用户注册通知">
              <el-switch v-model="notificationSettings.templates.userRegister" />
            </el-form-item>
            <el-form-item label="密码重置通知">
              <el-switch v-model="notificationSettings.templates.passwordReset" />
            </el-form-item>
            <el-form-item label="登录异常通知">
              <el-switch v-model="notificationSettings.templates.loginAlert" />
            </el-form-item>
            <el-form-item label="系统公告通知">
              <el-switch v-model="notificationSettings.templates.systemNotice" />
            </el-form-item>
            <el-form-item label="操作审批通知">
              <el-switch v-model="notificationSettings.templates.approvalNotice" />
            </el-form-item>
          </el-form>
        </el-card>

        <div class="form-actions">
          <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
          <el-button @click="resetNotificationSettings">重置</el-button>
          <el-button type="info" @click="testEmailSettings">测试邮件配置</el-button>
        </div>
      </el-tab-pane>

      <!-- 备份恢复 -->
      <el-tab-pane label="备份恢复" name="backup">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>手动备份</h3>
            </div>
          </template>
          <div class="backup-content">
            <div class="backup-info">
              <p>当前数据库大小：{{ dbSize }}</p>
              <p>上次备份时间：{{ lastBackupTime }}</p>
              <p>备份文件路径：{{ backupPath }}</p>
            </div>
            <div class="backup-actions">
              <el-button type="primary" @click="performBackup" :loading="backupLoading">
                <i class="fa fa-download"></i> 立即备份
              </el-button>
              <el-button type="warning" @click="backupSettingsVisible = true">
                <i class="fa fa-cog"></i> 备份设置
              </el-button>
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <h3>备份列表</h3>
            </div>
          </template>
          <el-table :data="backupList" stripe style="width: 100%">
            <el-table-column prop="fileName" label="备份文件名" width="250"></el-table-column>
            <el-table-column prop="fileSize" label="文件大小" width="100"></el-table-column>
            <el-table-column prop="backupTime" label="备份时间" width="180"></el-table-column>
            <el-table-column prop="backupType" label="备份类型" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.backupType === '手动' ? 'primary' : 'success'" size="small">
                  {{ scope.row.backupType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === '完成' ? 'success' : 'warning'" size="small">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="primary" size="small" @click="restoreBackup(scope.row)">
                  <i class="fa fa-undo"></i> 恢复
                </el-button>
                <el-button type="danger" size="small" @click="deleteBackup(scope.row)">
                  <i class="fa fa-trash"></i> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 备份设置对话框 -->
    <el-dialog
      v-model="backupSettingsVisible"
      title="备份设置"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="backupSettings" label-width="150px">
        <el-form-item label="自动备份">
          <el-switch v-model="backupSettings.autoBackup" />
        </el-form-item>
        <el-form-item label="备份周期">
          <el-select v-model="backupSettings.period" placeholder="选择备份周期">
            <el-option label="每天" value="daily"></el-option>
            <el-option label="每周" value="weekly"></el-option>
            <el-option label="每月" value="monthly"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备份时间">
          <el-time-picker
            v-model="backupSettings.time"
            placeholder="选择时间"
            value-format="HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备份保留数量">
          <el-input-number v-model="backupSettings.retentionCount" :min="1" :max="30" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="backupSettingsVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBackupSettings">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 当前时间
const currentTime = ref('')

// 激活的选项卡
const activeTab = ref('info')

// 系统信息
const systemInfo = reactive({
  name: '中国高铁站节能降耗管理系统',
  version: 'v1.0.0',
  framework: 'Vue 3 + Element Plus',
  dbVersion: 'SQLite 3.41.2',
  lastUpdateTime: '2023-10-15 14:30:00'
})

// 服务器信息
const serverInfo = reactive({
  ip: '192.168.1.100',
  name: 'Server-01',
  os: 'Windows Server 2022',
  cpu: 'Intel Xeon E5-2670 v3',
  memory: '16 GB',
  uptime: '15天 08:30:25'
})

// 安全设置
const securitySettings = reactive({
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    expireDays: 90,
    maxErrorAttempts: 5
  },
  login: {
    timeoutMinutes: 30,
    enableCaptcha: true,
    enable2FA: false,
    ipWhitelist: '127.0.0.1,192.168.1.0/24'
  },
  log: {
    recordLogin: true,
    recordOperation: true,
    retentionDays: 90
  }
})

// 通知设置
const notificationSettings = reactive({
  email: {
    smtpServer: 'smtp.example.com',
    smtpPort: 465,
    senderEmail: 'noreply@example.com',
    senderName: '系统通知',
    username: 'noreply@example.com',
    password: '',
    enableSSL: true
  },
  templates: {
    userRegister: true,
    passwordReset: true,
    loginAlert: true,
    systemNotice: true,
    approvalNotice: false
  }
})

// 备份设置
const backupSettingsVisible = ref(false)
const backupSettings = reactive({
  autoBackup: true,
  period: 'daily',
  time: '02:00',
  retentionCount: 10
})

// 备份相关数据
const backupLoading = ref(false)
const dbSize = ref('2.5 MB')
const lastBackupTime = ref('2023-10-14 02:00:00')
const backupPath = ref('D:\\Backup\\')
const backupList = ref([
  {
    id: 1,
    fileName: 'backup_20231015020000.sql',
    fileSize: '2.5 MB',
    backupTime: '2023-10-15 02:00:00',
    backupType: '自动',
    status: '完成'
  },
  {
    id: 2,
    fileName: 'backup_20231014020000.sql',
    fileSize: '2.4 MB',
    backupTime: '2023-10-14 02:00:00',
    backupType: '手动',
    status: '完成'
  }
])

// 更新时间
const updateCurrentTime = () => {
  currentTime.value = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 安全设置
const saveSecuritySettings = () => {
  ElMessage.success('安全设置已保存')
}

const resetSecuritySettings = () => {
  securitySettings.password = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    expireDays: 90,
    maxErrorAttempts: 5
  }
  securitySettings.login = {
    timeoutMinutes: 30,
    enableCaptcha: true,
    enable2FA: false,
    ipWhitelist: '127.0.0.1,192.168.1.0/24'
  }
  securitySettings.log = {
    recordLogin: true,
    recordOperation: true,
    retentionDays: 90
  }
  ElMessage.success('安全设置已重置')
}

// 通知设置
const saveNotificationSettings = () => {
  ElMessage.success('通知设置已保存')
}

const resetNotificationSettings = () => {
  notificationSettings.email = {
    smtpServer: 'smtp.example.com',
    smtpPort: 465,
    senderEmail: 'noreply@example.com',
    senderName: '系统通知',
    username: 'noreply@example.com',
    password: '',
    enableSSL: true
  }
  notificationSettings.templates = {
    userRegister: true,
    passwordReset: true,
    loginAlert: true,
    systemNotice: true,
    approvalNotice: false
  }
  ElMessage.success('通知设置已重置')
}

const testEmailSettings = () => {
  ElMessage.success('测试邮件发送成功（模拟）')
}

// 备份操作
const performBackup = () => {
  backupLoading.value = true
  setTimeout(() => {
    const newItem = {
      id: Date.now(),
      fileName: `backup_${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 14)}.sql`,
      fileSize: '2.6 MB',
      backupTime: new Date().toLocaleString('zh-CN'),
      backupType: '手动',
      status: '完成'
    }
    backupList.value.unshift(newItem)
    lastBackupTime.value = newItem.backupTime
    backupLoading.value = false
    ElMessage.success('备份完成')
  }, 800)
}

const restoreBackup = (row) => {
  ElMessage.success(`已恢复备份：${row.fileName}`)
}

const deleteBackup = (row) => {
  const index = backupList.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    backupList.value.splice(index, 1)
    ElMessage.success('备份已删除')
  }
}

const saveBackupSettings = () => {
  ElMessage.success('备份设置已保存')
}

onMounted(() => {
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
})
</script>

<style scoped>
.system-settings-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.system-time {
  font-size: 14px;
  color: #606266;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.system-info-content .info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.form-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.backup-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.backup-info p {
  margin: 4px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>