<template>
  <div class="train-analysis-container">
    <h3 class="section-title">
      <i class="fa fa-train"></i> 车次关联分析
    </h3>
    
    <div class="analysis-content">
      <div class="chart-section">
        <div ref="trainEnergyChart" class="chart"></div>
      </div>
      
      <div class="table-section">
        <div class="table-header">
          <div class="search-box">
            <el-input
              placeholder="输入车次编号搜索"
              v-model="searchQuery"
              clearable
              size="small"
              @input="handleSearch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              ></el-button>
            </el-input>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="filteredTrainList"
          style="width: 100%"
          stripe
          height="400"
        >
          <el-table-column prop="trainNumber" label="车次编号" width="120"></el-table-column>
          <el-table-column prop="arrivalTime" label="到达时间" width="150"></el-table-column>
          <el-table-column prop="departureTime" label="出发时间" width="150"></el-table-column>
          <el-table-column prop="passengerFlow" label="客流量" width="100"></el-table-column>
          <el-table-column prop="passengerImpact" label="客流影响度" width="120">
            <template slot-scope="scope">
              <el-progress
                :percentage="scope.row.passengerImpact"
                :stroke-width="10"
                :color="getProgressColor(scope.row.passengerImpact)"
                :show-text="true"
              ></el-progress>
            </template>
          </el-table-column>
          <el-table-column prop="energyConsumption" label="能耗增量(kWh)" width="120"></el-table-column>
          <el-table-column prop="energyImpact" label="能耗影响度" width="120">
            <template slot-scope="scope">
              <el-progress
                :percentage="scope.row.energyImpact"
                :stroke-width="10"
                :color="getProgressColor(scope.row.energyImpact)"
                :show-text="true"
              ></el-progress>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'TrainAnalysis',
  data() {
    return {
      loading: false,
      trainList: [],
      searchQuery: '',
      trainEnergyChart: null,
      chartData: {
        hours: [],
        trainCount: [],
        energyConsumption: []
      }
    }
  },
  computed: {
    filteredTrainList() {
      if (!this.searchQuery) {
        return this.trainList
      }
      return this.trainList.filter(item => 
        item.trainNumber.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  mounted() {
    this.fetchTrainData()
    this.initTrainEnergyChart()
    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeUnmount() {
    if (this.trainEnergyChart) {
      this.trainEnergyChart.dispose()
      this.trainEnergyChart = null
    }
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // 获取车次数据
    fetchTrainData() {
      this.loading = true
      // 模拟API请求
      setTimeout(() => {
        this.trainList = this.generateTrainData()
        this.generateChartData()
        this.updateTrainEnergyChart()
        this.loading = false
      }, 500)
    },

    // 生成模拟车次数据
    generateTrainData() {
      const trainTypes = ['G', 'D', 'C', 'Z', 'T', 'K']
      const data = []
      
      // 生成24小时内的车次数据
      for (let i = 0; i < 50; i++) {
        const hour = Math.floor(Math.random() * 24)
        const minute = Math.floor(Math.random() * 60)
        const duration = Math.floor(Math.random() * 30) + 10 // 停留时间10-40分钟
        const arrivalTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        
        const departureHour = hour + Math.floor((minute + duration) / 60)
        const departureMinute = (minute + duration) % 60
        const departureTime = `${departureHour.toString().padStart(2, '0')}:${departureMinute.toString().padStart(2, '0')}`
        
        const passengerFlow = Math.floor(Math.random() * 1200) + 200 // 客流量200-1400
        const passengerImpact = Math.floor(Math.random() * 50) + 30 // 客流影响度30-80%
        const energyConsumption = Math.floor(Math.random() * 1500) + 500 // 能耗增量500-2000 kWh
        const energyImpact = Math.floor(Math.random() * 40) + 20 // 能耗影响度20-60%
        
        const type = trainTypes[Math.floor(Math.random() * trainTypes.length)]
        const number = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
        
        data.push({
          id: i + 1,
          trainNumber: `${type}${number}`,
          arrivalTime: arrivalTime,
          departureTime: departureTime,
          passengerFlow: passengerFlow,
          passengerImpact: passengerImpact,
          energyConsumption: energyConsumption,
          energyImpact: energyImpact,
          type: type
        })
      }
      
      // 按到达时间排序
      return data.sort((a, b) => {
        return a.arrivalTime.localeCompare(b.arrivalTime)
      })
    },

    // 生成图表数据
    generateChartData() {
      // 初始化24小时数据
      this.chartData = {
        hours: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        trainCount: Array(24).fill(0),
        energyConsumption: Array(24).fill(0)
      }
      
      // 统计每小时的车次数量和能耗
      this.trainList.forEach(train => {
        const hour = parseInt(train.arrivalTime.split(':')[0])
        this.chartData.trainCount[hour]++
        this.chartData.energyConsumption[hour] += train.energyConsumption
      })
    },

    // 初始化车次能耗关联图表
    initTrainEnergyChart() {
      this.trainEnergyChart = echarts.init(this.$refs.trainEnergyChart)
      this.updateTrainEnergyChart()
    },

    // 更新车次能耗关联图表
    updateTrainEnergyChart() {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['车次数量', '能耗增量(kWh)']
        },
        xAxis: [
          {
            type: 'category',
            data: this.chartData.hours,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '车次数量',
            min: 0,
            max: Math.max(...this.chartData.trainCount) + 2,
            interval: 1,
            axisLabel: {
              formatter: '{value} 列'
            }
          },
          {
            type: 'value',
            name: '能耗增量(kWh)',
            min: 0,
            max: Math.max(...this.chartData.energyConsumption) + 500,
            axisLabel: {
              formatter: '{value} kWh'
            }
          }
        ],
        series: [
          {
            name: '车次数量',
            type: 'bar',
            data: this.chartData.trainCount,
            itemStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '能耗增量(kWh)',
            type: 'line',
            yAxisIndex: 1,
            data: this.chartData.energyConsumption,
            itemStyle: {
              color: '#F56C6C'
            },
            smooth: true,
            lineStyle: {
              width: 3
            }
          }
        ]
      }
      this.trainEnergyChart.setOption(option)
    },

    // 搜索车次
    handleSearch() {
      // 搜索逻辑已在computed中实现
    },

    // 获取进度条颜色
    getProgressColor(percentage) {
      if (percentage > 70) return '#67C23A'
      if (percentage > 40) return '#E6A23C'
      return '#F56C6C'
    },

    // 处理窗口大小变化
    handleWindowResize() {
      if (this.trainEnergyChart) {
        this.trainEnergyChart.resize()
      }
    }
  }
}
</script>

<style scoped>
.train-analysis-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-section {
  flex: 1;
  min-height: 300px;
}

.chart {
  width: 100%;
  height: 350px;
}

.table-section {
  flex: 1;
  background-color: #fff;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.search-box {
  width: 250px;
}

@media (min-width: 768px) {
  .analysis-content {
    flex-direction: row;
  }
  
  .chart-section {
    flex: 1;
  }
  
  .table-section {
    flex: 1;
  }
}
</style>