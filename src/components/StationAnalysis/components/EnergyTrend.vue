<template>
  <el-card shadow="hover" class="chart-card">
    <div slot="header" class="card-header">
      <h3 class="card-title">
        <i class="fa fa-line-chart"></i> 能耗趋势分析
      </h3>
      <el-button type="text" size="small" @click="$emit('toggleFullscreen')">
        <i class="fa fa-expand"></i>
      </el-button>
    </div>
    <div class="chart-container">
      <div ref="energyTrendChart" class="chart"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'EnergyTrend',
  props: {
    timeGranularity: {
      type: String,
      default: 'hour'
    },
    trainSchedule: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      energyTrendChart: null
    }
  },
  mounted() {
    this.initEnergyTrendChart()
    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeUnmount() {
    this.disposeChart()
    window.removeEventListener('resize', this.handleWindowResize)
  },
  watch: {
    timeGranularity: {
      handler() {
        this.updateEnergyTrendChart()
      },
      deep: true
    },
    trainSchedule: {
      handler() {
        this.updateEnergyTrendChart()
      },
      deep: true
    }
  },
  methods: {
    // 初始化能耗趋势图
    initEnergyTrendChart() {
      this.energyTrendChart = echarts.init(this.$refs.energyTrendChart)
      this.updateEnergyTrendChart()
    },
    
    // 根据时间粒度更新能耗趋势图
    updateEnergyTrendChart() {
      if (!this.energyTrendChart) return
      
      const { xAxisData, seriesData } = this.generateChartDataByGranularity()
      
      // 生成车次标记点数据
      const trainMarkPoints = this.generateTrainMarkPoints()
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: (params) => {
            let tooltip = params[0].axisValue + '<br/>'
            params.forEach(param => {
              tooltip += `${param.marker}${param.seriesName}: ${param.value} kWh<br/>`
            })
            
            // 添加车次信息到tooltip
            if (this.timeGranularity === 'hour') {
              const hour = parseInt(params[0].axisValue.split(':')[0])
              const hourTrains = this.trainSchedule.filter(train => {
                const trainHour = parseInt(train.time.split(':')[0])
                return trainHour === hour
              })
              
              if (hourTrains.length > 0) {
                tooltip += '<br/><strong>车次信息：</strong><br/>'
                hourTrains.forEach(train => {
                  const directionIcon = train.direction === 'arrive' ? '⬇️' : '⬆️'
                  tooltip += `${directionIcon} ${train.trainNumber} ${train.direction === 'arrive' ? '到达' : '出发'} (${train.passengers}人)<br/>`
                })
              }
            }
            
            return tooltip
          }
        },
        legend: {
          data: ['实际能耗', '预测能耗', '历史平均', '列车到达', '列车出发'],
          top: 10
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
          data: xAxisData
        },
        yAxis: [
          {
            type: 'value',
            name: '能耗(kWh)',
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: '列车',
            show: false
          }
        ],
        series: [
          {
            name: '实际能耗',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: seriesData.actual
          },
          {
            name: '预测能耗',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            lineStyle: {
              type: 'dashed'
            },
            data: seriesData.predicted
          },
          {
            name: '历史平均',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            lineStyle: {
              type: 'dotted'
            },
            data: seriesData.average
          },
          {
            name: '列车到达',
            type: 'scatter',
            yAxisIndex: 1,
            symbol: 'arrow-down',
            symbolSize: 12,
            itemStyle: {
              color: '#52c41a'
            },
            data: trainMarkPoints.arrive,
            tooltip: {
              formatter: (params) => {
                return `${params.marker}${params.seriesName}: ${params.data.trainNumber}<br/>到达时间：${params.axisValue}<br/>乘客数：${params.data.passengers}人`
              }
            }
          },
          {
            name: '列车出发',
            type: 'scatter',
            yAxisIndex: 1,
            symbol: 'arrow-up',
            symbolSize: 12,
            itemStyle: {
              color: '#ff4d4f'
            },
            data: trainMarkPoints.depart,
            tooltip: {
              formatter: (params) => {
                return `${params.marker}${params.seriesName}: ${params.data.trainNumber}<br/>出发时间：${params.axisValue}<br/>乘客数：${params.data.passengers}人`
              }
            }
          }
        ]
      }
      this.energyTrendChart.setOption(option)
    },
    
    // 根据时间粒度生成图表数据
    generateChartDataByGranularity() {
      let xAxisData = []
      let actualData = []
      let predictedData = []
      let averageData = []
      
      switch (this.timeGranularity) {
        case 'hour':
          // 生成24小时的数据
          for (let i = 0; i < 24; i++) {
            xAxisData.push(`${i}:00`)
            // 模拟小时级能耗数据，早高峰和晚高峰能耗较高
            const hour = i
            const baseValue = 5000
            const peakFactor = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) ? 2 : 1
            const randomFactor = 0.8 + Math.random() * 0.4
            actualData.push(Math.round(baseValue * peakFactor * randomFactor))
            predictedData.push(null) // 小时级暂不显示预测数据
            averageData.push(Math.round(baseValue * peakFactor * 0.9))
          }
          break
        case 'day':
          // 生成30天的数据
          for (let i = 1; i <= 30; i++) {
            xAxisData.push(`${i}日`)
            actualData.push(10000 + Math.round(Math.random() * 10000))
            predictedData.push(null)
            averageData.push(10000 + Math.round(Math.random() * 5000))
          }
          break
        case 'week':
          // 生成12周的数据
          for (let i = 1; i <= 12; i++) {
            xAxisData.push(`第${i}周`)
            actualData.push(70000 + Math.round(Math.random() * 30000))
            predictedData.push(i > 10 ? 75000 + Math.round(Math.random() * 20000) : null)
            averageData.push(72000 + Math.round(Math.random() * 25000))
          }
          break
        case 'month':
          // 生成12个月的数据
          xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          actualData = [120000, 190000, 360000, 280000, 450000, 320000, 580000, 620000, 480000, 350000, 280000, 220000]
          predictedData = [null, null, null, null, null, null, null, null, null, null, 290000, 230000]
          averageData = [180000, 220000, 310000, 290000, 410000, 350000, 520000, 580000, 450000, 330000, 270000, 210000]
          break
        case 'year':
          // 生成5年的数据
          for (let i = 2020; i <= 2024; i++) {
            xAxisData.push(`${i}年`)
            actualData.push(2000000 + Math.round(Math.random() * 500000))
            predictedData.push(i === 2024 ? 2300000 + Math.round(Math.random() * 300000) : null)
            averageData.push(2100000 + Math.round(Math.random() * 400000))
          }
          break
        default:
          xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月']
          actualData = [120000, 190000, 360000, 280000, 450000, 320000]
          predictedData = [null, null, null, null, null, null]
          averageData = [180000, 220000, 310000, 290000, 410000, 350000]
      }
      
      return {
        xAxisData,
        seriesData: {
          actual: actualData,
          predicted: predictedData,
          average: averageData
        }
      }
    },
    
    // 生成车次标记点数据
    generateTrainMarkPoints() {
      if (this.timeGranularity !== 'hour') {
        return { arrive: [], depart: [] }
      }
      
      const arrivePoints = []
      const departPoints = []
      
      this.trainSchedule.forEach(train => {
        const time = train.time
        const hour = time.split(':')[0] + ':00'
        
        if (train.direction === 'arrive') {
          arrivePoints.push({
            name: train.trainNumber,
            value: hour,
            xAxis: hour,
            yAxis: 1,
            trainNumber: train.trainNumber,
            passengers: train.passengers
          })
        } else {
          departPoints.push({
            name: train.trainNumber,
            value: hour,
            xAxis: hour,
            yAxis: 1,
            trainNumber: train.trainNumber,
            passengers: train.passengers
          })
        }
      })
      
      return { arrive: arrivePoints, depart: departPoints }
    },
    
    // 处理窗口大小变化
    handleWindowResize() {
      if (this.energyTrendChart) {
        this.energyTrendChart.resize()
      }
    },
    
    // 销毁图表
    disposeChart() {
      if (this.energyTrendChart) {
        this.energyTrendChart.dispose()
        this.energyTrendChart = null
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
</style>