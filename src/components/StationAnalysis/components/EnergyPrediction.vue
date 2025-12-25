<template>
  <el-card shadow="hover" class="chart-card">
    <div slot="header" class="card-header">
      <h3 class="card-title">
        <i class="fa fa-line-chart"></i> 能耗预测分析
      </h3>
      <el-select v-model="predictionDays" placeholder="预测天数" size="small" @change="updateEnergyPredictionChart">
        <el-option label="7天" value="7" />
        <el-option label="15天" value="15" />
        <el-option label="30天" value="30" />
      </el-select>
    </div>
    <div class="chart-container">
      <div ref="energyPredictionChart" class="chart"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import moment from 'moment'

export default {
  name: 'EnergyPrediction',
  props: {
    timeGranularity: {
      type: String,
      default: 'day'
    }
  },
  data() {
    return {
      predictionDays: '7',
      energyPredictionChart: null
    }
  },
  mounted() {
    this.initEnergyPredictionChart()
  },
  beforeUnmount() {
    if (this.energyPredictionChart) {
      this.energyPredictionChart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initEnergyPredictionChart() {
      this.energyPredictionChart = echarts.init(this.$refs.energyPredictionChart)
      this.updateEnergyPredictionChart()
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', this.handleResize)
    },
    updateEnergyPredictionChart() {
      const chartData = this.generateChartData()
      
      const option = {
        title: {
          text: '未来能耗预测趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}<br/>{a}: {c} kWh'
        },
        legend: {
          data: ['历史能耗', '预测能耗'],
          top: 30
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
          data: chartData.xAxisData
        },
        yAxis: {
          type: 'value',
          name: '能耗值(kWh)'
        },
        series: [
          {
            name: '历史能耗',
            type: 'line',
            data: chartData.historicalData,
            lineStyle: {
              color: '#67C23A'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
                { offset: 1, color: 'rgba(103, 194, 58, 0.1)' }
              ])
            }
          },
          {
            name: '预测能耗',
            type: 'line',
            data: chartData.predictionData,
            lineStyle: {
              color: '#409EFF',
              type: 'dashed'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
              ])
            }
          }
        ]
      }
      
      this.energyPredictionChart.setOption(option)
    },
    generateChartData() {
      const days = parseInt(this.predictionDays)
      const xAxisData = []
      const historicalData = []
      const predictionData = []
      
      // 生成历史数据（最近15天）
      for (let i = 15; i > 0; i--) {
        const date = moment().subtract(i, 'days').format('MM-DD')
        xAxisData.push(date)
        const baseValue = 10000 + Math.random() * 5000
        historicalData.push(Math.round(baseValue))
        predictionData.push(null)
      }
      
      // 生成预测数据
      for (let i = 0; i < days; i++) {
        const date = moment().add(i, 'days').format('MM-DD')
        xAxisData.push(date)
        historicalData.push(null)
        
        // 基于历史数据的最后一个值生成预测值，加入一些随机波动
        const lastHistoricalValue = historicalData[historicalData.length - 1] || 12500
        const trend = (Math.random() - 0.5) * 2000 // -1000 到 +1000 的趋势变化
        const predictionValue = Math.round(lastHistoricalValue + trend)
        predictionData.push(predictionValue)
      }
      
      return {
        xAxisData,
        historicalData,
        predictionData
      }
    },
    handleResize() {
      if (this.energyPredictionChart) {
        this.energyPredictionChart.resize()
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

.chart-container {
  width: 100%;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>