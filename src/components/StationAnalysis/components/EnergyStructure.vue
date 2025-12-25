<template>
  <div class="energy-structure-container">
    <div class="structure-section">
      <h3 class="section-title">
        <i class="fa fa-pie-chart"></i> 能耗结构分析
      </h3>
      <div ref="energyStructureChart" class="chart structure-chart"></div>
    </div>
    <div class="department-section">
      <h3 class="section-title">
        <i class="fa fa-building"></i> 部门能耗对比
      </h3>
      <div ref="departmentEnergyChart" class="chart department-chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'EnergyStructure',
  data() {
    return {
      energyStructureChart: null,
      departmentEnergyChart: null
    }
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeUnmount() {
    this.disposeCharts()
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // 初始化所有图表
    initCharts() {
      this.initEnergyStructureChart()
      this.initDepartmentEnergyChart()
    },
    
    // 初始化能耗结构饼图
    initEnergyStructureChart() {
      this.energyStructureChart = echarts.init(this.$refs.energyStructureChart)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} kWh ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          top: 'center'
        },
        series: [
          {
            name: '能耗结构',
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
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 850000, name: '空调系统' },
              { value: 520000, name: '照明系统' },
              { value: 380000, name: '动力系统' },
              { value: 240000, name: '通风系统' },
              { value: 150000, name: '其他系统' }
            ]
          }
        ]
      }
      this.energyStructureChart.setOption(option)
    },
    
    // 初始化部门能耗对比图
    initDepartmentEnergyChart() {
      this.departmentEnergyChart = echarts.init(this.$refs.departmentEnergyChart)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '能耗(kWh)'
        },
        yAxis: {
          type: 'category',
          data: ['候车大厅', '售票厅', '办公区', '设备房', '停车场', '站台', '其他区域']
        },
        series: [
          {
            name: '本月能耗',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [450000, 120000, 230000, 380000, 150000, 180000, 90000]
          },
          {
            name: '上月能耗',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [420000, 110000, 210000, 350000, 140000, 170000, 85000]
          }
        ]
      }
      this.departmentEnergyChart.setOption(option)
    },
    
    // 处理窗口大小变化
    handleWindowResize() {
      if (this.energyStructureChart) {
        this.energyStructureChart.resize()
      }
      if (this.departmentEnergyChart) {
        this.departmentEnergyChart.resize()
      }
    },
    
    // 销毁所有图表
    disposeCharts() {
      if (this.energyStructureChart) {
        this.energyStructureChart.dispose()
        this.energyStructureChart = null
      }
      if (this.departmentEnergyChart) {
        this.departmentEnergyChart.dispose()
        this.departmentEnergyChart = null
      }
    }
  }
}
</script>

<style scoped>
.energy-structure-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.structure-section,
.department-section {
  flex: 1;
  min-width: 300px;
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

.chart {
  width: 100%;
  height: 400px;
}

.structure-chart {
  height: 350px;
}

.department-chart {
  height: 350px;
}
</style>