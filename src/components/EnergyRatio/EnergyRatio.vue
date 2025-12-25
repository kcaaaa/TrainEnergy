<template>
  <div class="energy-ratio-container">
    <el-card shadow="hover" class="energy-card">
      <template #header>
        <div class="card-header">
          <div class="title-block">
            <div class="title-main">能耗比例分析</div>
            <div class="title-desc">按日期/粒度实时切换，联动图表与数据明细</div>
          </div>
        </div>
      </template>

      <!-- 筛选条 -->
      <div class="filter-bar">
        <el-form :inline="true" class="filter-form" label-position="top">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              value-format="YYYY-MM-DD"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              :disabled-date="disableFuture"
              unlink-panels
              :shortcuts="dateShortcuts"
              :prefix-icon="Calendar"
            />
          </el-form-item>

          <el-form-item label="能耗类型">
            <el-select v-model="energyType" placeholder="请选择能耗类型" size="small" clearable :suffix-icon="DataLine">
              <el-option label="总能耗" value="total" />
              <el-option label="电力" value="electricity" />
              <el-option label="空调" value="airConditioning" />
              <el-option label="照明" value="lighting" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="趋势粒度">
            <el-radio-group v-model="trendMode" size="small" class="mode-switch" @change="renderTrendChart">
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label=" ">
            <div class="filter-actions">
              <el-button type="primary" size="small" class="action-btn" @click="handleRefresh">
                <el-icon><Refresh /></el-icon>
                查询并刷新
              </el-button>
              <el-button size="small" plain class="action-btn" @click="handleExport">
                <el-icon><Download /></el-icon>
                导出报表
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 能耗比例概览 -->
      <div class="ratio-overview">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="overview-card">
              <div class="card-content">
                <div class="card-icon total-icon">
                  <i class="fas fa-bolt"></i>
                </div>
                <div class="card-info">
                  <div class="card-title">总能耗占比</div>
                  <div class="card-value">{{ totalEnergyRatio }}%</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="overview-card">
              <div class="card-content">
                <div class="card-icon electricity-icon">
                  <i class="fas fa-plug"></i>
                </div>
                <div class="card-info">
                  <div class="card-title">电力能耗占比</div>
                  <div class="card-value">{{ electricityRatio }}%</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="overview-card">
              <div class="card-content">
                <div class="card-icon ac-icon">
                  <i class="fas fa-snowflake"></i>
                </div>
                <div class="card-info">
                  <div class="card-title">空调能耗占比</div>
                  <div class="card-value">{{ acRatio }}%</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="6">
            <el-card class="overview-card">
              <div class="card-content">
                <div class="card-icon lighting-icon">
                  <i class="fas fa-lightbulb"></i>
                </div>
                <div class="card-info">
                  <div class="card-title">照明能耗占比</div>
                  <div class="card-value">{{ lightingRatio }}%</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 能耗比例图表 -->
      <div class="ratio-charts">
        <el-row :gutter="20">
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-title">按区域能耗比例</div>
              </template>
              <div ref="areaChart" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-title">按设备类型能耗比例</div>
              </template>
              <div ref="deviceTypeChart" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-title">按时段能耗比例</div>
              </template>
              <div ref="timeChart" class="chart-container"></div>
            </el-card>
          </el-col>
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-title">能耗类型分布</div>
              </template>
              <div ref="energyTypeChart" class="chart-container"></div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 能耗趋势分析 -->
      <div class="trend-analysis">
        <el-card class="trend-card">
          <template #header>
            <div class="card-header">
              <div class="card-title">能耗比例趋势</div>
              <el-radio-group v-model="trendMode" size="small" class="mode-switch" @change="renderTrendChart">
                <el-radio-button label="day">日</el-radio-button>
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChart" class="chart-container-large"></div>
        </el-card>
      </div>

      <!-- 详细数据分析 -->
      <div class="detailed-analysis">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <h3>详细数据分析</h3>
              <el-radio-group v-model="analysisDimension" size="small" class="mode-switch" @change="refreshCharts">
                <el-radio-button label="area">区域</el-radio-button>
                <el-radio-button label="deviceType">设备类型</el-radio-button>
                <el-radio-button label="time">时段</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <el-table :data="detailedData" stripe border height="360px" style="width: 100%">
            <el-table-column prop="name" label="名称" width="150" fixed />
            <el-table-column prop="energyConsumption" label="能耗值(kWh)" width="150">
              <template #default="scope">
                <el-tag type="info" effect="plain">{{ scope.row.energyConsumption.toLocaleString() }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="percentage" label="占比" width="140">
              <template #default="scope">
                <el-progress :percentage="scope.row.percentage" :stroke-width="10" status="success" />
              </template>
            </el-table-column>
            <el-table-column prop="cost" label="成本(¥)" width="130">
              <template #default="scope">
                <span class="cost-text">¥{{ scope.row.cost.toLocaleString() }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="yearOnYear" label="同比变化" width="120">
              <template #default="scope">
                <span :class="scope.row.yearOnYear >= 0 ? 'increase' : 'decrease'">
                  {{ scope.row.yearOnYear >= 0 ? '+' : '' }}{{ scope.row.yearOnYear }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="monthOnMonth" label="环比变化" width="120">
              <template #default="scope">
                <span :class="scope.row.monthOnMonth >= 0 ? 'increase' : 'decrease'">
                  {{ scope.row.monthOnMonth >= 0 ? '+' : '' }}{{ scope.row.monthOnMonth }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column label="趋势" min-width="180">
              <template #default="scope">
                <div class="trend-bar">
                  <div class="trend-bar__label">近7日</div>
                  <el-progress
                    :percentage="scope.row.trend7d"
                    :stroke-width="8"
                    text-inside
                    color="#409EFF"
                    :format="() => scope.row.trend7d + '%'"
                  />
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { Calendar, DataLine, Download, Refresh } from '@element-plus/icons-vue'

export default {
  name: 'EnergyRatio',
  setup() {
    // 图表实例
    const areaChart = ref(null)
    const deviceTypeChart = ref(null)
    const timeChart = ref(null)
    const energyTypeChart = ref(null)
    const trendChart = ref(null)
    let areaChartInstance = null
    let deviceTypeChartInstance = null
    let timeChartInstance = null
    let energyTypeChartInstance = null
    let trendChartInstance = null

    // 颜色与基础数据
    const palette = ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd', '#E86452', '#73C0DE']
    const energyFactorMap = {
      total: 1,
      electricity: 0.98,
      airConditioning: 1.08,
      lighting: 0.82,
      other: 0.72
    }

    const baseEnergyTypes = [
      { name: '电力', key: 'electricity', value: 16000 },
      { name: '空调', key: 'airConditioning', value: 10800 },
      { name: '照明', key: 'lighting', value: 5400 },
      { name: '其他', key: 'other', value: 1800 }
    ]

    const baseAreaData = [
      { name: '候车大厅', base: 12500, yoy: -5.2, mom: 2.1 },
      { name: '售票区域', base: 4500, yoy: 3.5, mom: 1.8 },
      { name: '站台区域', base: 8200, yoy: -2.8, mom: -0.5 },
      { name: '办公区域', base: 6800, yoy: 4.2, mom: 3.1 },
      { name: '其他区域', base: 3400, yoy: 1.5, mom: -1.2 }
    ]

    const baseDeviceTypeData = [
      { name: '空调系统', base: 9800, yoy: 2.5, mom: 1.2 },
      { name: '照明系统', base: 5600, yoy: -1.3, mom: 0.4 },
      { name: '电力设备', base: 7200, yoy: 3.1, mom: 1.9 },
      { name: '通风系统', base: 4300, yoy: -0.6, mom: -0.3 },
      { name: '其他设备', base: 2200, yoy: 0.5, mom: 0.1 }
    ]

    const baseTimeSlotData = [
      { name: '00:00-06:00', base: 2600, yoy: -1.6, mom: 0.4 },
      { name: '06:00-12:00', base: 8200, yoy: 2.4, mom: 1.1 },
      { name: '12:00-18:00', base: 7600, yoy: 1.5, mom: -0.2 },
      { name: '18:00-24:00', base: 6800, yoy: 3.2, mom: 1.7 }
    ]

    const trendSeeds = {
      day: {
        axis: Array.from({ length: 7 }, (_, i) => `${i + 1}日`),
        series: [
          { name: '电力', data: [42, 43, 41, 44, 43, 45, 46] },
          { name: '空调', data: [35, 36, 34, 35, 36, 37, 38] },
          { name: '照明', data: [12, 11, 12, 13, 12, 12, 13] },
          { name: '其他', data: [6, 5, 5, 4, 4, 4, 3] }
        ]
      },
      week: {
        axis: ['第1周', '第2周', '第3周', '第4周', '第5周'],
        series: [
          { name: '电力', data: [43, 44, 45, 46, 47] },
          { name: '空调', data: [37, 38, 39, 40, 41] },
          { name: '照明', data: [12, 12, 13, 13, 14] },
          { name: '其他', data: [8, 7, 6, 6, 5] }
        ]
      },
      month: {
        axis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        series: [
          { name: '电力', data: [42, 45, 43, 46, 44, 47, 45, 48, 46, 49, 47, 50] },
          { name: '空调', data: [28, 30, 32, 35, 38, 42, 45, 48, 45, 42, 38, 32] },
          { name: '照明', data: [18, 17, 16, 14, 13, 11, 10, 9, 11, 13, 15, 17] },
          { name: '其他', data: [12, 8, 9, 5, 5, 0, 0, 0, 5, 6, 8, 10] }
        ]
      }
    }

    const formatDate = (date) => {
      const d = new Date(date)
      const month = `${d.getMonth() + 1}`.padStart(2, '0')
      const day = `${d.getDate()}`.padStart(2, '0')
      return `${d.getFullYear()}-${month}-${day}`
    }

    // 筛选条件与状态
    const today = new Date()
    const lastMonth = new Date()
    lastMonth.setDate(today.getDate() - 29)
    const dateRange = ref([formatDate(lastMonth), formatDate(today)])
    const energyType = ref('total')
    const analysisDimension = ref('area')
    const trendMode = ref('month')

    const disableFuture = (date) => date.getTime() > Date.now()

    const calcRangeFactor = () => {
      if (!dateRange.value || dateRange.value.length !== 2) return 1
      const [start, end] = dateRange.value
      const startTime = new Date(start).getTime()
      const endTime = new Date(end).getTime()
      const days = Math.max(1, Math.round((endTime - startTime) / (1000 * 60 * 60 * 24)))
      return Math.min(1.6, Math.max(0.6, 1 + (days - 30) / 180))
    }

    const calcEnergyFactor = () => energyFactorMap[energyType.value] || 1

    const buildList = (baseList) => {
      const factor = calcRangeFactor() * calcEnergyFactor()
      const list = baseList.map((item) => {
        const energyConsumption = Math.round(item.base * factor)
        return {
          name: item.name,
          energyConsumption,
          cost: Math.round(energyConsumption * 0.7),
          yearOnYear: +item.yoy.toFixed(1),
          monthOnMonth: +item.mom.toFixed(1),
          trend7d: Math.min(100, Math.max(0, Math.round(50 + item.mom * 5)))
        }
      })
      const total = list.reduce((sum, i) => sum + i.energyConsumption, 0) || 1
      return list.map((item) => ({
        ...item,
        percentage: +((item.energyConsumption / total) * 100).toFixed(1)
      }))
    }

    const energyTypeList = computed(() => {
      const factor = calcRangeFactor() * calcEnergyFactor()
      const list = baseEnergyTypes.map((item) => ({
        ...item,
        value: Math.round(item.value * factor)
      }))
      const total = list.reduce((sum, i) => sum + i.value, 0) || 1
      return list.map((item) => ({
        ...item,
        ratio: +((item.value / total) * 100).toFixed(1)
      }))
    })

    const dateShortcuts = [
      {
        text: '近7天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setDate(start.getDate() - 6)
          return [start, end]
        }
      },
      {
        text: '近30天',
        value: () => {
          const end = new Date()
          const start = new Date()
          start.setDate(start.getDate() - 29)
          return [start, end]
        }
      }
    ]

    const totalEnergyRatio = computed(() => 100)
    const electricityRatio = computed(() => energyTypeList.value.find((i) => i.key === 'electricity')?.ratio || 0)
    const acRatio = computed(() => energyTypeList.value.find((i) => i.key === 'airConditioning')?.ratio || 0)
    const lightingRatio = computed(() => energyTypeList.value.find((i) => i.key === 'lighting')?.ratio || 0)

    const areaData = computed(() => buildList(baseAreaData))
    const deviceTypeData = computed(() => buildList(baseDeviceTypeData))
    const timeSlotData = computed(() => buildList(baseTimeSlotData))

    const detailedData = computed(() => {
      if (analysisDimension.value === 'deviceType') return deviceTypeData.value
      if (analysisDimension.value === 'time') return timeSlotData.value
      return areaData.value
    })

    // 初始化按区域能耗比例图表
    const renderAreaChart = () => {
      if (areaChartInstance) {
        areaChartInstance.dispose()
      }
      areaChartInstance = echarts.init(areaChart.value)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>能耗: {c} kWh ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          textStyle: { color: '#4E5969' }
        },
        series: [
          {
            name: '区域能耗',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 8,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold'
              }
            },
            data: areaData.value.map((item, idx) => ({
              value: item.energyConsumption,
              name: item.name,
              itemStyle: { color: palette[idx % palette.length] }
            }))
          }
        ]
      }
      areaChartInstance.setOption(option)
    }

    // 初始化按设备类型能耗比例图表
    const renderDeviceTypeChart = () => {
      if (deviceTypeChartInstance) {
        deviceTypeChartInstance.dispose()
      }
      deviceTypeChartInstance = echarts.init(deviceTypeChart.value)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: { left: '3%', right: '4%', bottom: '6%', containLabel: true },
        xAxis: {
          type: 'value',
          axisLabel: { formatter: '{value}%' }
        },
        yAxis: {
          type: 'category',
          data: deviceTypeData.value.map((i) => i.name)
        },
        series: [
          {
            name: '能耗占比',
            type: 'bar',
            barWidth: 16,
            data: deviceTypeData.value.map((item, idx) => ({
              value: item.percentage,
              itemStyle: {
                borderRadius: [0, 6, 6, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: palette[idx % palette.length] },
                  { offset: 1, color: palette[(idx + 1) % palette.length] }
                ])
              }
            }))
          }
        ]
      }
      deviceTypeChartInstance.setOption(option)
    }

    // 初始化按时段能耗比例图表
    const renderTimeChart = () => {
      if (timeChartInstance) {
        timeChartInstance.dispose()
      }
      timeChartInstance = echarts.init(timeChart.value)
      const option = {
        tooltip: { trigger: 'item' },
        radar: {
          shape: 'polygon',
          splitNumber: 4,
          indicator: timeSlotData.value.map((item) => ({ name: item.name, max: 100 })),
          axisName: { color: '#4E5969' }
        },
        series: [
          {
            name: '时段能耗比例',
            type: 'radar',
            areaStyle: { color: 'rgba(64, 158, 255, 0.25)' },
            lineStyle: { color: '#409EFF' },
            itemStyle: { color: '#409EFF' },
            data: [
              {
                value: timeSlotData.value.map((item) => item.percentage),
                name: '能耗占比'
              }
            ]
          }
        ]
      }
      timeChartInstance.setOption(option)
    }

    // 初始化能耗类型分布图表
    const renderEnergyTypeChart = () => {
      if (energyTypeChartInstance) {
        energyTypeChartInstance.dispose()
      }
      energyTypeChartInstance = echarts.init(energyTypeChart.value)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} kWh ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: energyTypeList.value.map((i) => i.name)
        },
        series: [
          {
            name: '能耗类型',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '42%'],
            label: { formatter: '{b}\n{d}%' },
            data: energyTypeList.value.map((item, idx) => ({
              value: item.value,
              name: item.name,
              itemStyle: { color: palette[idx % palette.length] }
            }))
          }
        ]
      }
      energyTypeChartInstance.setOption(option)
    }

    // 初始化能耗比例趋势图表
    const renderTrendChart = () => {
      if (trendChartInstance) {
        trendChartInstance.dispose()
      }
      trendChartInstance = echarts.init(trendChart.value)
      const seed = trendSeeds[trendMode.value] || trendSeeds.month
      const factor = calcRangeFactor() * calcEnergyFactor()
      const series = seed.series.map((item, idx) => ({
        name: item.name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: { color: `${palette[idx % palette.length]}33` },
        lineStyle: { color: palette[idx % palette.length], width: 2 },
        data: item.data.map((v) => +(v * factor).toFixed(1))
      }))

      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: seed.series.map((i) => i.name) },
        grid: { left: '3%', right: '3%', bottom: '6%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: seed.axis },
        yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
        series
      }
      trendChartInstance.setOption(option)
    }

    // 响应式调整图表大小
    const handleResize = () => {
      areaChartInstance && areaChartInstance.resize()
      deviceTypeChartInstance && deviceTypeChartInstance.resize()
      timeChartInstance && timeChartInstance.resize()
      energyTypeChartInstance && energyTypeChartInstance.resize()
      trendChartInstance && trendChartInstance.resize()
    }

    const refreshCharts = () => {
      renderAreaChart()
      renderDeviceTypeChart()
      renderTimeChart()
      renderEnergyTypeChart()
      renderTrendChart()
    }

    // 刷新数据
    const handleRefresh = () => {
      refreshCharts()
      ElMessage.success('已按筛选条件刷新数据')
    }

    // 导出报表（占位提示）
    const handleExport = () => {
      ElMessage.info('报表导出功能待接入后端接口，当前为前端示例')
    }

    // 联动监听：日期/类型/维度/趋势粒度变化时更新
    watch([dateRange, energyType, analysisDimension, trendMode], () => {
      refreshCharts()
    })

    // 生命周期钩子
    onMounted(() => {
      refreshCharts()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      areaChartInstance?.dispose()
      deviceTypeChartInstance?.dispose()
      timeChartInstance?.dispose()
      energyTypeChartInstance?.dispose()
      trendChartInstance?.dispose()
      window.removeEventListener('resize', handleResize)
    })

    return {
      areaChart,
      deviceTypeChart,
      timeChart,
      energyTypeChart,
      trendChart,
      dateRange,
      energyType,
      analysisDimension,
      trendMode,
      Calendar,
      DataLine,
      Download,
      Refresh,
      totalEnergyRatio,
      electricityRatio,
      acRatio,
      lightingRatio,
      detailedData,
      disableFuture,
      handleRefresh,
      handleExport,
      renderTrendChart,
      refreshCharts
    }
  }
}
</script>

<style scoped>
.energy-ratio-container {
  padding: 20px;
}

.energy-card {
  margin-bottom: 20px;
  border: 1px solid #eef0f3;
  box-shadow: 0 6px 18px rgba(31, 56, 88, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.title-block {
  display: flex;
  flex-direction: column;
}

.title-main {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1d2129;
}

.title-desc {
  font-size: 12px;
  color: #86909c;
  margin-top: 2px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.action-item {
  margin-right: 8px;
}

.filter-bar {
  padding: 12px 0 4px;
}

.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px 16px;
  align-items: end;
}

.filter-form :deep(.el-form-item__label) {
  font-size: 12px;
  color: #86909c;
  padding-bottom: 4px;
}

.filter-form :deep(.el-input__wrapper),
.filter-form :deep(.el-select .el-select__wrapper),
.filter-form :deep(.el-date-editor) {
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  box-shadow: none;
  background: #f7f8fa;
  min-height: 36px;
}

.filter-form :deep(.el-input__inner),
.filter-form :deep(.el-select__selected-item),
.filter-form :deep(.el-range-input) {
  color: #1d2129;
}

.filter-form :deep(.el-input__wrapper.is-focus),
.filter-form :deep(.el-select .el-select__wrapper.is-focused),
.filter-form :deep(.el-date-editor.is-active) {
  border-color: #409eff;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.12);
  background: #fff;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  min-width: 110px;
  border-radius: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 能耗比例概览 */
.ratio-overview {
  margin-bottom: 20px;
}

.overview-card {
  height: 120px;
  border-radius: 8px;
  transition: all 0.3s;
  border: 1px solid #f0f2f5;
}

.overview-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
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

.total-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.electricity-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.ac-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.lighting-icon {
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

/* 能耗比例图表 */
.ratio-charts {
  margin-bottom: 20px;
}

.chart-card {
  height: 300px;
  border: 1px solid #f0f2f5;
}

.chart-container {
  width: 100%;
  height: calc(100% - 40px);
}

.chart-container-large {
  width: 100%;
  height: 400px;
}

/* 能耗趋势分析 */
.trend-analysis {
  margin-bottom: 20px;
}

.trend-card {
  margin-bottom: 20px;
  border: 1px solid #f0f2f5;
}

/* 详细数据分析 */
.detailed-analysis {
  margin-bottom: 20px;
}

.analysis-card {
  margin-bottom: 20px;
  border: 1px solid #f0f2f5;
}

/* 数据变化样式 */
.increase {
  color: #f56c6c;
}

.decrease {
  color: #67c23a;
}

.mode-switch {
  display: inline-flex;
  align-items: center;
}

.cost-text {
  font-weight: 600;
  color: #1d2129;
}

.trend-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-bar__label {
  color: #86909c;
  font-size: 12px;
  width: 48px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .energy-ratio-container {
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
  
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  
  .header-actions .el-date-picker,
  .header-actions .el-select,
  .header-actions .el-button {
    width: 100%;
    margin-right: 0;
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