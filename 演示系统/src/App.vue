<template>
  <div class="app-container">
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
        default-active="/"
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
        <el-menu-item index="/station-analysis">
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
        <el-menu-item index="/multi-station-compare">
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
          <el-dropdown>
            <span class="user-info">
              <i class="fa fa-user-circle-o"></i>
              <span class="user-name">管理员</span>
              <i class="fa fa-angle-down"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <i class="fa fa-user"></i> 个人中心
                </el-dropdown-item>
                <el-dropdown-item>
                  <i class="fa fa-cog"></i> 系统设置
                </el-dropdown-item>
                <el-dropdown-item divided>
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
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const isCollapse = ref(false)
    const route = useRoute()
    
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
    })

    return {
      isCollapse,
      toggleCollapse,
      breadcrumbItems
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
