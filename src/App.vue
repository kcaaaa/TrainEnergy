<template>
  <router-view v-if="isLoginPage" />
  <div v-else class="app-container">
    <!-- 侧边导航菜单 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="app-aside">
      <div class="aside-header">
        <div class="logo-container">
          <i class="fa fa-building-o"></i>
          <span v-if="!isCollapse" class="logo-text">高铁站节能降耗</span>
        </div>
        <el-button type="text" class="collapse-btn" @click="toggleCollapse">
          <i class="fa" :class="isCollapse ? 'fa-angle-right' : 'fa-angle-left'"></i>
        </el-button>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :collapse-transition="false"
      >
        <el-menu-item index="/">
          <i class="fa fa-home"></i>
          <template #title>首页数据展示</template>
        </el-menu-item>
        <el-menu-item v-if="isSingleMode" index="/station-analysis">
          <i class="fa fa-bar-chart"></i>
          <template #title>单站能耗分析</template>
        </el-menu-item>
        <el-menu-item index="/energy-ratio">
          <i class="fa fa-pie-chart"></i>
          <template #title>能耗占比分析</template>
        </el-menu-item>
        <el-menu-item index="/energy-alert">
          <i class="fa fa-exclamation-triangle"></i>
          <template #title>能耗分析预警系统</template>
        </el-menu-item>
        <el-menu-item v-if="isMultiMode && canUseMulti" index="/multi-station-compare">
          <i class="fa fa-line-chart"></i>
          <template #title>多站能耗对比</template>
        </el-menu-item>
        <el-menu-item index="/energy-strategy">
          <i class="fa fa-lightbulb-o"></i>
          <template #title>节能策略模拟</template>
        </el-menu-item>
        <el-menu-item index="/device-management">
          <i class="fa fa-cog"></i>
          <template #title>设备与系统管理</template>
        </el-menu-item>
        <el-menu-item index="/system-management">
          <i class="fa fa-wrench"></i>
          <template #title>系统管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区域 -->
    <el-container class="app-main">
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-left">
          <el-button type="text" class="mobile-collapse-btn" @click="toggleCollapse">
            <i class="fa fa-bars"></i>
          </el-button>
          <span class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </span>
        </div>
        <div class="header-right">
          <el-radio-group
            size="small"
            v-model="currentMode"
            @change="handleModeChange"
            class="mode-switch"
          >
            <el-radio-button label="single">单站分析</el-radio-button>
            <el-radio-button :disabled="!canUseMulti" label="multi">多站分析</el-radio-button>
          </el-radio-group>
          <el-dropdown
            v-if="isSingleMode"
            trigger="click"
            @visible-change="handleStationDropdownVisibleChange"
          >
            <span class="station-info">
              <i class="fa fa-building"></i>
              <span class="station-name">{{ currentStation.label }}</span>
              <i class="fa fa-angle-down"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="station in availableStations" 
                  :key="station.value" 
                  @click="selectStation(station)"
                  :class="{ 'active-station': currentStation.value === station.value }"
                >
                  <i class="fa fa-train"></i> {{ station.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click">
            <span class="user-info">
              <i class="fa fa-user-circle-o"></i>
              <span class="user-name">{{ currentUser.nickname || currentUser.username || '未登录' }}</span>
              <i class="fa fa-angle-down"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openProfile">
                  <i class="fa fa-user"></i> 个人中心
                </el-dropdown-item>
                <el-dropdown-item @click="goSystemSettings">
                  <i class="fa fa-cog"></i> 系统设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <i class="fa fa-sign-out"></i> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="app-content">
        <router-view />
      </el-main>
    </el-container>
  </div>

  <!-- 个人中心弹窗 -->
  <el-dialog
    v-model="profileVisible"
    title="个人中心"
    width="520px"
    :close-on-click-modal="false"
  >
    <el-form :model="profileForm" :rules="profileRules" ref="profileFormRef" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="profileForm.username" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-divider>修改密码（可选）</el-divider>
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="profileForm.oldPassword" type="password" placeholder="请输入原密码" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="profileForm.newPassword" type="password" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="profileForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="profileVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveProfile">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'App',
  setup() {
    const MODE_KEY = 'analysisMode'
    const isCollapse = ref(false)
    const route = useRoute()
    const router = useRouter()
    const profileVisible = ref(false)
    const profileFormRef = ref(null)
    const currentUser = reactive(loadCurrentUser())
    const currentMode = ref(loadMode())

    // 站点选择相关数据
    const stationList = ref([
      { value: 'beijing', label: '北京南站' },
      { value: 'shanghai', label: '上海虹桥站' },
      { value: 'guangzhou', label: '广州南站' },
      { value: 'shenzhen', label: '深圳北站' },
      { value: 'hangzhou', label: '杭州东站' },
      { value: 'chengdu', label: '成都东站' },
      { value: 'wuhan', label: '武汉站' },
      { value: 'xian', label: '西安北站' }
    ])
    
    // 当前选择的站点（默认多站分析）
    const currentStation = ref({
      value: 'all',
      label: '多站分析'
    })

    const profileForm = reactive({
      username: '',
      nickname: '',
      email: '',
      phone: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const validateNewPassword = (rule, value, callback) => {
      if (value && value.length < 8) {
        return callback(new Error('新密码长度至少 8 位'))
      }
      callback()
    }

    const validateConfirmPassword = (rule, value, callback) => {
      if (profileForm.newPassword || value) {
        if (value !== profileForm.newPassword) {
          return callback(new Error('两次输入新密码不一致'))
        }
      }
      callback()
    }

    const profileRules = {
      nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      email: [{ type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }],
      phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
      newPassword: [
        { validator: validateNewPassword, trigger: 'blur' }
      ],
      confirmPassword: [
        { validator: validateConfirmPassword, trigger: 'blur' }
      ]
    }

    function loadCurrentUser() {
      const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser')
      if (raw) {
        return JSON.parse(raw)
      }
      return { username: '', nickname: '' }
    }

    function loadMode() {
      const saved = sessionStorage.getItem(MODE_KEY)
      if (saved) return saved
      // 单站管理员默认单站模式
      return 'single'
    }

    const rolesDict = computed(() => {
      const roles = JSON.parse(localStorage.getItem('roles') || '[]')
      return roles.reduce((acc, cur) => {
        acc[cur.id] = cur.roleKey
        return acc
      }, {})
    })

    const roleKey = computed(() => currentUser.roleKey || rolesDict.value[currentUser.roleId] || 'user')
    const isSuperAdmin = computed(() => roleKey.value === 'super_admin')
    const isSiteAdmin = computed(() => roleKey.value === 'site_admin')
    const isStationAdmin = computed(() => roleKey.value === 'station_admin')
    const canUseMulti = computed(() => isSuperAdmin.value || isSiteAdmin.value)
    const isSingleMode = computed(() => currentMode.value === 'single')
    const isMultiMode = computed(() => currentMode.value === 'multi')

    const activeMenu = computed(() => route.path)
    const isLoginPage = computed(() => route.path === '/login')
    const availableStations = computed(() => {
      if (isStationAdmin.value && currentUser.stationId) {
        return stationList.value.filter(s => s.value === currentUser.stationId)
      }
      return stationList.value
    })

    watch([roleKey, currentMode], ([newRole, mode]) => {
      if (newRole === 'station_admin' && mode === 'multi') {
        currentMode.value = 'single'
        saveMode('single')
      }
    })
    
    // 面包屑数据
    const breadcrumbItems = computed(() => {
      const items = []
      if (route.path !== '/') {
        const matched = route.matched
        matched.forEach(item => {
          if (item.path !== '/') {
            items.push({
              name: item.meta.title,
              path: item.path
            })
          }
        })
      }
      return items
    })

    // 切换菜单折叠状态
    const toggleCollapse = () => {
      isCollapse.value = !isCollapse.value
    }

    const openProfile = () => {
      const rawUser = loadCurrentUser()
      Object.assign(profileForm, {
        username: rawUser.username || '',
        nickname: rawUser.nickname || rawUser.username || '',
        email: rawUser.email || '',
        phone: rawUser.phone || '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      profileVisible.value = true
    }

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('currentUser')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('currentUser')
      ElMessage.success('已退出登录')
      router.push('/login')
    }

    const goSystemSettings = () => {
      router.push('/system-management')
    }

    // 站点选择相关方法
    const selectStation = (station) => {
      if (isStationAdmin.value && station.value !== currentUser.stationId) {
        ElMessage.warning('当前账号仅可查看绑定站点')
        return
      }
      currentMode.value = 'single'
      saveMode('single')
      currentStation.value = station
      // 保存到本地存储，以便其他组件获取
      localStorage.setItem('currentStation', JSON.stringify(station))
      ElMessage.success(`已切换到${station.label}`)
      // 触发站点切换事件，通知其他组件
      window.dispatchEvent(new CustomEvent('stationChanged', { detail: station }))
    }

    const selectAllStations = (silent = false) => {
      if (!canUseMulti.value) {
        ElMessage.warning('当前账号仅支持单站分析')
        return
      }
      currentMode.value = 'multi'
      saveMode('multi')
      currentStation.value = {
        value: 'all',
        label: '多站分析'
      }
      // 保存到本地存储
      localStorage.setItem('currentStation', JSON.stringify(currentStation.value))
      if (!silent) {
        ElMessage.success('已切换到多站分析')
      }
      // 触发站点切换事件
      window.dispatchEvent(new CustomEvent('stationChanged', { detail: currentStation.value }))
    }

    const saveMode = (mode) => {
      sessionStorage.setItem(MODE_KEY, mode)
    }

    const handleModeChange = (mode) => {
      if (mode === 'multi' && !canUseMulti.value) {
        ElMessage.warning('当前账号仅支持单站分析')
        currentMode.value = 'single'
        saveMode('single')
        return
      }
      currentMode.value = mode
      saveMode(mode)
      if (mode === 'multi') {
        selectAllStations(true)
        if (route.path === '/station-analysis') {
          router.push('/multi-station-compare')
        }
      } else {
        if (route.path === '/multi-station-compare') {
          router.push('/station-analysis')
        }
      }
      window.dispatchEvent(new CustomEvent('modeChanged', { detail: mode }))
      ElMessage.success(`已切换至${mode === 'single' ? '单站' : '多站'}模式，筛选已重置`)
    }

    const handleStationDropdownVisibleChange = (visible) => {
      console.log('站点选择下拉菜单可见性变化:', visible)
    }

    const handleSaveProfile = () => {
      profileFormRef.value.validate((valid) => {
        if (!valid) return
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const current = users.find(u => u.username === currentUser.username)
        if (!current) {
          ElMessage.error('当前用户不存在')
          return
        }
        // 如果输入了新密码，校验原密码
        if (profileForm.newPassword) {
          if (!profileForm.oldPassword) {
            ElMessage.warning('请输入原密码')
            return
          }
          if (profileForm.oldPassword !== current.password) {
            ElMessage.error('原密码错误')
            return
          }
          current.password = profileForm.newPassword
        }
        current.nickname = profileForm.nickname
        current.email = profileForm.email
        current.phone = profileForm.phone

        localStorage.setItem('users', JSON.stringify(users))
        const updatedUser = {
          id: current.id,
          username: current.username,
          nickname: current.nickname,
          email: current.email,
          phone: current.phone,
          roleId: current.roleId
        }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser))
        Object.assign(currentUser, updatedUser)
        ElMessage.success('个人信息已保存')
        profileVisible.value = false
      })
    }

    // 监听路由变化，更新面包屑
    watch(() => route.path, (newPath) => {
      console.log('路由变化:', newPath)
    })

    // 响应式处理
    const handleResize = () => {
      if (window.innerWidth < 768) {
        isCollapse.value = true
      }
    }

    // 生命周期钩子
    onMounted(() => {
      handleResize()
      window.addEventListener('resize', handleResize)
      
      // 从本地存储恢复站点选择状态
      const savedStation = localStorage.getItem('currentStation')
      if (savedStation) {
        currentStation.value = JSON.parse(savedStation)
      } else if (isStationAdmin.value && currentUser.stationId) {
        const own = stationList.value.find(s => s.value === currentUser.stationId) || {
          value: currentUser.stationId,
          label: currentUser.stationName || '所属站点'
        }
        currentStation.value = own
        localStorage.setItem('currentStation', JSON.stringify(own))
      }

      if (currentMode.value === 'multi' && !canUseMulti.value) {
        currentMode.value = 'single'
        saveMode('single')
      }
    })

    return {
      isCollapse,
      toggleCollapse,
      breadcrumbItems,
      isLoginPage,
      activeMenu,
      currentUser,
      roleKey,
      canUseMulti,
      isSingleMode,
      isMultiMode,
      currentMode,
      handleModeChange,
      profileVisible,
      profileForm,
      profileRules,
      profileFormRef,
      openProfile,
      handleSaveProfile,
      handleLogout,
      goSystemSettings,
      // 站点选择相关
      stationList,
      availableStations,
      currentStation,
      selectStation,
      selectAllStations,
      handleStationDropdownVisibleChange
    }
  }
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #303133;
  background-color: #f5f7fa;
}

/* 应用容器 */
.app-container {
  display: flex;
  min-height: 100vh;
}

/* 侧边导航 */
.app-aside {
  background-color: #304156;
  color: #fff;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  overflow: hidden;
  transition: width 0.28s;
}

.aside-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #263445;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.logo-container i {
  font-size: 24px;
  color: #409EFF;
}

.logo-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapse-btn {
  color: #fff;
  font-size: 16px;
}

/* 菜单样式 */
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  height: 56px;
  line-height: 56px;
}

/* 主内容区域 */
.app-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* 顶部导航栏 */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mobile-collapse-btn {
  display: none;
  font-size: 18px;
  color: #606266;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.mode-switch {
  margin-right: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
}

.user-info i {
  font-size: 18px;
}

.user-name {
  white-space: nowrap;
}

/* 站点选择样式 */
.station-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.station-info:hover {
  background-color: #f0f2f5;
}

.station-info i {
  font-size: 16px;
}

.station-name {
  white-space: nowrap;
  font-weight: 500;
}

/* 选中站点的高亮样式 */
.el-dropdown-menu__item.active-station {
  color: #409EFF;
  font-weight: bold;
}

/* 内容区域 */
.app-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-aside {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    transition: transform 0.28s;
    transform: translateX(-100%);
  }
  
  .app-aside.collapse {
    transform: translateX(0);
  }
  
  .mobile-collapse-btn {
    display: block;
  }
  
  .app-content {
    padding: 10px;
  }
}
</style>
