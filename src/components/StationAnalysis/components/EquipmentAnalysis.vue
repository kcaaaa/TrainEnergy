<template>
  <el-card shadow="hover" class="chart-card">
    <div slot="header" class="card-header">
      <h3 class="card-title">
        <i class="fa fa-cogs"></i> 设备详细能耗分析
      </h3>
    </div>
    <div class="equipment-energy-analysis">
      <div class="equipment-table-container">
        <el-table
          :data="equipmentData"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column prop="name" label="设备名称" width="200" />
          <el-table-column prop="type" label="设备类型" width="120">
            <template #default="scope">
              <el-tag :type="getEquipmentTypeColor(scope.row.type)">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="energy" label="能耗值(kWh)" width="150">
            <template #default="scope">
              {{ scope.row.energy.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="运行状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="efficiency" label="运行效率" width="150">
            <template #default="scope">
              <el-progress
                :percentage="scope.row.efficiency"
                :color="getEfficiencyColor(scope.row.efficiency)"
                :stroke-width="8"
              />
              <span class="efficiency-value">{{ scope.row.efficiency }}%</span>
            </template>
          </el-table-column>
          <el-table-column prop="trend" label="能耗趋势" width="120">
            <template #default="scope">
              <span class="trend-icon" :class="scope.row.trend">
                <i v-if="scope.row.trend === '上升'" class="fa fa-arrow-up"></i>
                <i v-else-if="scope.row.trend === '下降'" class="fa fa-arrow-down"></i>
                <i v-else class="fa fa-minus"></i>
                {{ scope.row.trend }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewEquipmentDetail(scope.row)">
                <i class="fa fa-eye"></i> 查看详情
              </el-button>
              <el-button type="warning" size="small" @click="viewEquipmentEfficiency(scope.row)">
                <i class="fa fa-bar-chart"></i> 效率分析
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="equipment-chart-container">
        <div ref="equipmentEnergyChart" class="chart"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'EquipmentAnalysis',
  props: {
    timeGranularity: {
      type: String,
      default: 'day'
    }
  },
  data() {
    return {
      equipmentData: [
        { name: '空调系统-1', type: '空调', energy: 34567, status: '正常', efficiency: 85, trend: '上升' },
        { name: '空调系统-2', type: '空调', energy: 32145, status: '正常', efficiency: 88, trend: '下降' },
        { name: '照明系统-1', type: '照明', energy: 12345, status: '正常', efficiency: 92, trend: '稳定' },
        { name: '照明系统-2', type: '照明', energy: 11987, status: '正常', efficiency: 90, trend: '下降' },
        { name: '电梯系统-1', type: '电梯', energy: 8765, status: '正常', efficiency: 78, trend: '上升' },
        { name: '电梯系统-2', type: '电梯', energy: 7654, status: '正常', efficiency: 75, trend: '稳定' },
        { name: '通风系统-1', type: '通风', energy: 5678, status: '正常', efficiency: 82, trend: '上升' },
        { name: '通风系统-2', type: '通风', energy: 5432, status: '正常', efficiency: 80, trend: '下降' },
        { name: '给排水系统', type: '给排水', energy: 3456, status: '正常', efficiency: 88, trend: '稳定' },
        { name: '监控系统', type: '监控', energy: 2345, status: '正常', efficiency: 95, trend: '稳定' },
        { name: '消防系统', type: '消防', energy: 1890, status: '正常', efficiency: 98, trend: '稳定' },
        { name: '通信系统', type: '通信', energy: 4567, status: '正常', efficiency: 90, trend: '上升' },
        { name: '安检设备-1', type: '安检', energy: 2134, status: '正常', efficiency: 85, trend: '下降' },
        { name: '安检设备-2', type: '安检', energy: 1987, status: '正常', efficiency: 87, trend: '上升' },
        { name: '自动售票机-1', type: '票务', energy: 876, status: '正常', efficiency: 92, trend: '稳定' },
        { name: '自动售票机-2', type: '票务', energy: 765, status: '正常', efficiency: 90, trend: '稳定' },
        { name: '自动检票机-1', type: '票务', energy: 1234, status: '正常', efficiency: 88, trend: '上升' },
        { name: '自动检票机-2', type: '票务', energy: 1123, status: '正常', efficiency: 86, trend: '下降' },
        { name: 'LED显示屏-1', type: '显示', energy: 567, status: '正常', efficiency: 95, trend: '稳定' },
        { name: 'LED显示屏-2', type: '显示', energy: 456, status: '正常', efficiency: 93, trend: '稳定' }
      ],
      equipmentEnergyChart: null
    }
  },
  mounted() {
    this.initEquipmentEnergyChart()
  },
  beforeUnmount() {
    if (this.equipmentEnergyChart) {
      this.equipmentEnergyChart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    getEquipmentTypeColor(type) {
      const typeColors = {
        '空调': 'info',
        '照明': 'warning',
        '电梯': 'success',
        '通风': 'primary',
        '给排水': 'danger',
        '监控': 'purple',
        '消防': 'orange',
        '通信': 'cyan',
        '安检': 'lime',
        '票务': 'pink',
        '显示': 'teal'
      }
      return typeColors[type] || 'default'
    },
    getEfficiencyColor(efficiency) {
      if (efficiency >= 90) return '#67C23A'
      if (efficiency >= 80) return '#E6A23C'
      return '#F56C6C'
    },
    viewEquipmentDetail(row) {
      this.$emit('viewDetail', row)
    },
    viewEquipmentEfficiency(row) {
      this.$emit('viewEfficiency', row)
    },
    initEquipmentEnergyChart() {
      this.equipmentEnergyChart = echarts.init(this.$refs.equipmentEnergyChart)
      this.updateEquipmentEnergyChart()
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', this.handleResize)
    },
    updateEquipmentEnergyChart() {
      const chartData = this.generateChartData()
      
      const option = {
        title: {
          text: '设备能耗分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} kWh ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: chartData.legendData
        },
        series: [
          {
            name: '设备能耗',
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
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: chartData.seriesData
          }
        ]
      }
      
      this.equipmentEnergyChart.setOption(option)
    },
    generateChartData() {
      // 按设备类型分组统计能耗
      const typeMap = {}
      
      this.equipmentData.forEach(equipment => {
        if (!typeMap[equipment.type]) {
          typeMap[equipment.type] = 0
        }
        typeMap[equipment.type] += equipment.energy
      })
      
      const legendData = Object.keys(typeMap)
      const seriesData = Object.entries(typeMap).map(([type, energy]) => ({
        name: type,
        value: energy
      }))
      
      return { legendData, seriesData }
    },
    handleResize() {
      if (this.equipmentEnergyChart) {
        this.equipmentEnergyChart.resize()
      }
    }
  }
}
</script>

<style scoped>
.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.equipment-energy-analysis {
  display: flex;
  gap: 20px;
}

.equipment-table-container {
  flex: 1;
  overflow: auto;
  max-height: 500px;
}

.equipment-chart-container {
  flex: 1;
}

.chart {
  width: 100%;
  height: 400px;
}

.efficiency-value {
  margin-left: 10px;
  font-weight: bold;
}

.trend-icon {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.trend-icon.上升 {
  color: #F56C6C;
}

.trend-icon.下降 {
  color: #67C23A;
}

.trend-icon.稳定 {
  color: #909399;
}

.trend-icon i {
  margin-right: 5px;
}

@media (max-width: 1200px) {
  .equipment-energy-analysis {
    flex-direction: column;
  }
}
</style>