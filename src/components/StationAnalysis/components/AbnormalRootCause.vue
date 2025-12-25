<template>
  <el-card shadow="hover" class="chart-card">
    <div slot="header" class="card-header">
      <h3 class="card-title">
        <i class="fa fa-exclamation-triangle"></i> 能耗异常根因分析
      </h3>
      <el-select v-model="abnormalAnalysisType" placeholder="分析类型" size="small" @change="updateAbnormalCauseChart">
        <el-option label="按设备" value="equipment" />
        <el-option label="按时间段" value="time" />
        <el-option label="按能耗类型" value="energyType" />
      </el-select>
    </div>
    <div class="abnormal-analysis-content">
      <div class="abnormal-table-container">
        <el-table
          :data="energyAbnormalData"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column prop="time" label="异常时间" width="180" />
          <el-table-column prop="type" label="异常类型" width="120">
            <template #default="scope">
              <el-tag type="danger">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="异常描述" />
          <el-table-column prop="cause" label="根因分析" width="200" />
          <el-table-column prop="solution" label="解决方案" width="200" />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewAbnormalDetail(scope.row)">
                <i class="fa fa-eye"></i> 查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="abnormal-chart-container">
        <div ref="abnormalCauseChart" class="chart"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'AbnormalRootCause',
  data() {
    return {
      abnormalAnalysisType: 'equipment',
      energyAbnormalData: [
        {
          time: '2023-12-20 08:30',
          type: '能耗突增',
          description: '空调系统能耗异常增加35%',
          cause: '空调滤网堵塞，导致运行效率下降',
          solution: '清洗空调滤网',
          equipment: '空调系统-1',
          energyType: '电力',
          value: 35
        },
        {
          time: '2023-12-20 14:20',
          type: '能耗偏高',
          description: '照明系统能耗持续偏高',
          cause: '部分区域照明设备未按计划关闭',
          solution: '检查照明控制系统',
          equipment: '照明系统-1',
          energyType: '电力',
          value: 28
        },
        {
          time: '2023-12-21 09:15',
          type: '能耗异常',
          description: '电梯系统能耗波动较大',
          cause: '电梯门传感器故障，频繁开关',
          solution: '更换电梯门传感器',
          equipment: '电梯系统-1',
          energyType: '电力',
          value: 42
        },
        {
          time: '2023-12-21 16:45',
          type: '能耗突增',
          description: '通风系统能耗异常增加',
          cause: '通风管道漏风，系统负载增加',
          solution: '检修通风管道',
          equipment: '通风系统-2',
          energyType: '电力',
          value: 38
        },
        {
          time: '2023-12-22 10:20',
          type: '能耗偏高',
          description: '空调系统夜间能耗偏高',
          cause: '温控系统设置不当',
          solution: '调整温控系统参数',
          equipment: '空调系统-2',
          energyType: '电力',
          value: 25
        },
        {
          time: '2023-12-22 15:30',
          type: '能耗异常',
          description: '给排水系统能耗异常',
          cause: '水泵故障，运行效率低下',
          solution: '维修水泵设备',
          equipment: '给排水系统',
          energyType: '电力',
          value: 32
        },
        {
          time: '2023-12-23 08:45',
          type: '能耗突增',
          description: '安检设备能耗突然增加',
          cause: '设备老化，电阻增大',
          solution: '更换老化设备',
          equipment: '安检设备-1',
          energyType: '电力',
          value: 45
        },
        {
          time: '2023-12-23 13:15',
          type: '能耗偏高',
          description: 'LED显示屏能耗偏高',
          cause: '亮度设置过高',
          solution: '调整显示屏亮度',
          equipment: 'LED显示屏-1',
          energyType: '电力',
          value: 22
        },
        {
          time: '2023-12-24 09:30',
          type: '能耗异常',
          description: '通信系统能耗波动',
          cause: '备用电源频繁切换',
          solution: '检查电源系统',
          equipment: '通信系统',
          energyType: '电力',
          value: 30
        },
        {
          time: '2023-12-24 16:20',
          type: '能耗突增',
          description: '自动检票机能耗增加',
          cause: '检票口堵塞，设备持续运行',
          solution: '优化检票流程',
          equipment: '自动检票机-1',
          energyType: '电力',
          value: 36
        }
      ],
      abnormalCauseChart: null
    }
  },
  mounted() {
    this.initAbnormalCauseChart()
  },
  beforeUnmount() {
    if (this.abnormalCauseChart) {
      this.abnormalCauseChart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    viewAbnormalDetail(row) {
      this.$emit('viewDetail', row)
    },
    initAbnormalCauseChart() {
      this.abnormalCauseChart = echarts.init(this.$refs.abnormalCauseChart)
      this.updateAbnormalCauseChart()
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', this.handleResize)
    },
    updateAbnormalCauseChart() {
      const chartData = this.generateChartData()
      
      let option = {}
      
      if (this.abnormalAnalysisType === 'equipment') {
        option = {
          title: {
            text: '设备异常能耗分析',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}%'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: chartData.legendData
          },
          series: [
            {
              name: '异常次数',
              type: 'pie',
              radius: '50%',
              data: chartData.seriesData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      } else if (this.abnormalAnalysisType === 'time') {
        option = {
          title: {
            text: '时间段异常能耗分析',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>{a}: {c}次'
          },
          xAxis: {
            type: 'category',
            data: chartData.xAxisData
          },
          yAxis: {
            type: 'value',
            name: '异常次数'
          },
          series: [
            {
              name: '异常次数',
              type: 'line',
              data: chartData.seriesData,
              smooth: true
            }
          ]
        }
      } else if (this.abnormalAnalysisType === 'energyType') {
        option = {
          title: {
            text: '能耗类型异常分析',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>{a}: {c}次'
          },
          xAxis: {
            type: 'category',
            data: chartData.xAxisData
          },
          yAxis: {
            type: 'value',
            name: '异常次数'
          },
          series: [
            {
              name: '异常次数',
              type: 'bar',
              data: chartData.seriesData
            }
          ]
        }
      }
      
      this.abnormalCauseChart.setOption(option)
    },
    generateChartData() {
      if (this.abnormalAnalysisType === 'equipment') {
        // 按设备统计异常次数
        const equipmentMap = {}
        this.energyAbnormalData.forEach(item => {
          equipmentMap[item.equipment] = (equipmentMap[item.equipment] || 0) + 1
        })
        
        const legendData = Object.keys(equipmentMap)
        const seriesData = Object.entries(equipmentMap).map(([name, value]) => ({
          name,
          value
        }))
        
        return { legendData, seriesData }
      } else if (this.abnormalAnalysisType === 'time') {
        // 按时间段统计
        const timeMap = {}
        this.energyAbnormalData.forEach(item => {
          const date = item.time.split(' ')[0]
          timeMap[date] = (timeMap[date] || 0) + 1
        })
        
        const xAxisData = Object.keys(timeMap).sort()
        const seriesData = xAxisData.map(date => timeMap[date])
        
        return { xAxisData, seriesData }
      } else if (this.abnormalAnalysisType === 'energyType') {
        // 按能耗类型统计
        const typeMap = {}
        this.energyAbnormalData.forEach(item => {
          typeMap[item.energyType] = (typeMap[item.energyType] || 0) + 1
        })
        
        const xAxisData = Object.keys(typeMap)
        const seriesData = xAxisData.map(type => typeMap[type])
        
        return { xAxisData, seriesData }
      }
    },
    handleResize() {
      if (this.abnormalCauseChart) {
        this.abnormalCauseChart.resize()
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

.abnormal-analysis-content {
  display: flex;
  gap: 20px;
}

.abnormal-table-container {
  flex: 1;
  overflow: auto;
  max-height: 500px;
}

.abnormal-chart-container {
  flex: 1;
}

.chart {
  width: 100%;
  height: 400px;
}

@media (max-width: 1200px) {
  .abnormal-analysis-content {
    flex-direction: column;
  }
}
</style>