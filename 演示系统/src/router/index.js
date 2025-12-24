import { createRouter, createWebHashHistory } from 'vue-router'

// 导入组件
import Home from '../components/Home/Home.vue'
import StationAnalysis from '../components/StationAnalysis/StationAnalysis.vue'
import EnergyRatio from '../components/EnergyRatio/EnergyRatio.vue'
import EnergyAlert from '../components/EnergyAlert/EnergyAlert.vue'
import MultiStationCompare from '../components/MultiStationCompare/MultiStationCompare.vue'
import EnergyStrategy from '../components/EnergyStrategy/EnergyStrategy.vue'
import DeviceManagement from '../components/DeviceManagement/DeviceManagement.vue'
import SystemManagement from '../components/SystemManagement/SystemManagement.vue'
import Login from '../components/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页数据展示' }
  },
  {
    path: '/station-analysis',
    name: 'StationAnalysis',
    component: StationAnalysis,
    meta: { title: '单站能耗分析' }
  },
  {
    path: '/energy-ratio',
    name: 'EnergyRatio',
    component: EnergyRatio,
    meta: { title: '能耗占比分析' }
  },
  {
    path: '/energy-alert',
    name: 'EnergyAlert',
    component: EnergyAlert,
    meta: { title: '能耗分析预警系统' }
  },
  {
    path: '/multi-station-compare',
    name: 'MultiStationCompare',
    component: MultiStationCompare,
    meta: { title: '多站能耗对比' }
  },
  {
    path: '/energy-strategy',
    name: 'EnergyStrategy',
    component: EnergyStrategy,
    meta: { title: '节能策略模拟' }
  },
  {
    path: '/device-management',
    name: 'DeviceManagement',
    component: DeviceManagement,
    meta: { title: '设备与系统管理' }
  },
  {
    path: '/system-management',
    name: 'SystemManagement',
    component: SystemManagement,
    meta: { title: '系统管理' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', public: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `高铁站节能降耗演示系统 - ${to.meta.title}`
  }

  const publicPage = to.meta.public
  const token = localStorage.getItem('token')

  if (!publicPage && !token) {
    return next({ path: '/login' })
  }

  if (to.path === '/login' && token) {
    return next({ path: '/' })
  }

  next()
})

export default router