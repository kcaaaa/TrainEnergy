<template>
  <div class="station-analysis-container">
    <!-- 页面头部 -->
    <el-page-header @back="handleBack" content="单站能耗分析" />

    <!-- 筛选区域 -->
    <FilterBar
      :station-list="stationList"
      :selected-station="searchForm.station"
      :time-granularity="searchForm.timeGranularity"
      @update:selected-station="searchForm.station = $event"
      @update:time-granularity="searchForm.timeGranularity = $event"
      @query="handleQuery"
      @reset="handleReset"
    />

    <!-- 指标概览 -->
    <MetricsOverview
      :total-energy="metrics.totalEnergy"
      :unit-area-energy="metrics.unitAreaEnergy"
      :energy-cost="metrics.energyCost"
      :energy-efficiency="metrics.energyEfficiency"
    />

    <!-- 能耗趋势 -->
    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>能耗趋势分析</span>
        </div>
      </template>
      <EnergyTrend
        :time-granularity="searchForm.timeGranularity"
      />
    </el-card>

    <!-- 能耗结构 -->
    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>能耗结构分析</span>
        </div>
      </template>
      <EnergyStructure
        :time-granularity="searchForm.timeGranularity"
      />
    </el-card>

    <!-- 异常能耗 -->
    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>异常能耗检测</span>
        </div>
      </template>
      <AbnormalEnergy
        :abnormal-energy-list="abnormalEnergyList"
        :page-info="abnormalPageInfo"
        @mark-resolved="handleMarkResolved"
        @size-change="handleAbnormalSizeChange"
        @current-change="handleAbnormalCurrentChange"
      />
    </el-card>

    <!-- 车次能耗 -->
    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>车次能耗分析</span>
        </div>
      </template>
      <TrainAnalysis
        :train-schedule="filteredTrainSchedule"
        :page-info="trainPageInfo"
        @size-change="handleTrainSizeChange"
        @current-change="handleTrainCurrentChange"
      />
    </el-card>

    <!-- 设备能耗 -->
    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>设备能耗分析</span>
        </div>
      </template>
      <EquipmentAnalysis
        :time-granularity="searchForm.timeGranularity"
      />
    </el-card>

    <!-- 异常根因 -->
    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>异常能耗根因分析</span>
        </div>
      </template>
      <AbnormalRootCause
        :time-granularity="searchForm.timeGranularity"
      />
    </el-card>

    <!-- 能耗预测 -->
    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>能耗预测</span>
        </div>
      </template>
      <EnergyPrediction
        :time-granularity="searchForm.timeGranularity"
      />
    </el-card>
  </div>
</template>

<script>
import FilterBar from './components/FilterBar.vue'
import MetricsOverview from './components/MetricsOverview.vue'
import EnergyTrend from './components/EnergyTrend.vue'
import EnergyStructure from './components/EnergyStructure.vue'
import AbnormalEnergy from './components/AbnormalEnergy.vue'
import TrainAnalysis from './components/TrainAnalysis.vue'
import EquipmentAnalysis from './components/EquipmentAnalysis.vue'
import AbnormalRootCause from './components/AbnormalRootCause.vue'
import EnergyPrediction from './components/EnergyPrediction.vue'

export default {
  name: 'StationAnalysis',
  components: {
    FilterBar,
    MetricsOverview,
    EnergyTrend,
    EnergyStructure,
    AbnormalEnergy,
    TrainAnalysis,
    EquipmentAnalysis,
    AbnormalRootCause,
    EnergyPrediction
  },
  data() {
    return {
      // 搜索表单
      searchForm: {
        station: 'beijing-south',
        timeGranularity: 'day'
      },
      // 站点列表
      stationList: [
        { id: 'beijing-south', name: '北京南站' },
        { id: 'shanghai-hongqiao', name: '上海虹桥站' },
        { id: 'guangzhou-south', name: '广州南站' },
        { id: 'shenzhen-north', name: '深圳北站' },
        { id: 'hangzhou-east', name: '杭州东站' }
      ],
      // 指标数据
      metrics: {
        totalEnergy: '2,345,678',
        unitAreaEnergy: '123.45',
        energyCost: '187,654.32',
        energyEfficiency: '85.6'
      },
      // 异常能耗列表
      abnormalEnergyList: [],
      // 异常能耗分页信息
      abnormalPageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 车次时刻表数据
      trainSchedule: [
        { trainNumber: 'G101', arrivalTime: '06:35', departureTime: '06:37', energyConsumption: '3456', energyEfficiency: '87.2' },
        { trainNumber: 'G102', arrivalTime: '07:12', departureTime: '07:14', energyConsumption: '3210', energyEfficiency: '88.5' },
        { trainNumber: 'G103', arrivalTime: '07:50', departureTime: '07:52', energyConsumption: '3678', energyEfficiency: '86.8' },
        { trainNumber: 'G104', arrivalTime: '08:28', departureTime: '08:30', energyConsumption: '3345', energyEfficiency: '87.9' },
        { trainNumber: 'G105', arrivalTime: '09:05', departureTime: '09:07', energyConsumption: '3567', energyEfficiency: '87.5' },
        { trainNumber: 'G106', arrivalTime: '09:42', departureTime: '09:44', energyConsumption: '3123', energyEfficiency: '89.1' },
        { trainNumber: 'G107', arrivalTime: '10:20', departureTime: '10:22', energyConsumption: '3789', energyEfficiency: '86.3' },
        { trainNumber: 'G108', arrivalTime: '10:58', departureTime: '11:00', energyConsumption: '3432', energyEfficiency: '87.7' },
        { trainNumber: 'G109', arrivalTime: '11:35', departureTime: '11:37', energyConsumption: '3654', energyEfficiency: '87.0' },
        { trainNumber: 'G110', arrivalTime: '12:12', departureTime: '12:14', energyConsumption: '3298', energyEfficiency: '88.2' },
        { trainNumber: 'G111', arrivalTime: '12:50', departureTime: '12:52', energyConsumption: '3712', energyEfficiency: '86.5' },
        { trainNumber: 'G112', arrivalTime: '13:28', departureTime: '13:30', energyConsumption: '3387', energyEfficiency: '87.8' },
        { trainNumber: 'G113', arrivalTime: '14:05', departureTime: '14:07', energyConsumption: '3598', energyEfficiency: '87.4' },
        { trainNumber: 'G114', arrivalTime: '14:42', departureTime: '14:44', energyConsumption: '3189', energyEfficiency: '88.9' },
        { trainNumber: 'G115', arrivalTime: '15:20', departureTime: '15:22', energyConsumption: '3823', energyEfficiency: '86.1' },
        { trainNumber: 'G116', arrivalTime: '15:58', departureTime: '16:00', energyConsumption: '3476', energyEfficiency: '87.6' },
        { trainNumber: 'G117', arrivalTime: '16:35', departureTime: '16:37', energyConsumption: '3689', energyEfficiency: '86.9' },
        { trainNumber: 'G118', arrivalTime: '17:12', departureTime: '17:14', energyConsumption: '3334', energyEfficiency: '87.9' },
        { trainNumber: 'G119', arrivalTime: '17:50', departureTime: '17:52', energyConsumption: '3745', energyEfficiency: '86.4' },
        { trainNumber: 'G120', arrivalTime: '18:28', departureTime: '18:30', energyConsumption: '3412', energyEfficiency: '87.7' }
      ],
      // 过滤后的车次数据
      filteredTrainSchedule: [],
      // 车次分页信息
      trainPageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.loadAbnormalEnergyData()
    this.filteredTrainSchedule = this.trainSchedule
    this.trainPageInfo.total = this.trainSchedule.length
  },
  methods: {
    // 返回上一页
    handleBack() {
      this.$router.back()
    },
    // 查询
    handleQuery() {
      // 触发查询逻辑，更新数据
      this.loadAbnormalEnergyData()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        station: 'beijing-south',
        timeGranularity: 'day'
      }
      this.handleQuery()
    },
    // 加载异常能耗数据
    loadAbnormalEnergyData() {
      // 模拟加载数据
      const mockData = [
        { id: 1, time: '2023-10-15 08:30', energyValue: '12,345', threshold: '10,000', deviation: '+23.45%', status: 'unresolved', reason: '空调系统异常' },
        { id: 2, time: '2023-10-16 14:20', energyValue: '11,876', threshold: '10,000', deviation: '+18.76%', status: 'unresolved', reason: '照明系统超时运行' },
        { id: 3, time: '2023-10-17 09:45', energyValue: '9,876', threshold: '10,000', deviation: '-1.24%', status: 'resolved', reason: '设备节能改造效果' },
        { id: 4, time: '2023-10-18 16:10', energyValue: '13,456', threshold: '10,000', deviation: '+34.56%', status: 'unresolved', reason: '高峰期设备满负荷运行' },
        { id: 5, time: '2023-10-19 11:25', energyValue: '10,987', threshold: '10,000', deviation: '+9.87%', status: 'resolved', reason: '临时设备调试' }
      ]
      
      this.abnormalEnergyList = mockData
      this.abnormalPageInfo.total = mockData.length
    },
    // 标记异常能耗为已解决
    handleMarkResolved(id) {
      const item = this.abnormalEnergyList.find(item => item.id === id)
      if (item) {
        item.status = 'resolved'
      }
    },
    // 异常能耗分页大小变化
    handleAbnormalSizeChange(size) {
      this.abnormalPageInfo.pageSize = size
    },
    // 异常能耗当前页变化
    handleAbnormalCurrentChange(current) {
      this.abnormalPageInfo.currentPage = current
    },
    // 车次分页大小变化
    handleTrainSizeChange(size) {
      this.trainPageInfo.pageSize = size
    },
    // 车次当前页变化
    handleTrainCurrentChange(current) {
      this.trainPageInfo.currentPage = current
    }
  }
}
</script>

<style scoped>
.station-analysis-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.filter-card {
  margin-bottom: 16px;
}

.chart-card {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.w-48 {
  width: 192px;
}
</style>