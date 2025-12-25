<template>
  <div class="station-analysis-container">
    <!-- 页面标题 -->
    <el-card shadow="hover" class="page-header">
      <h1 class="page-title">
        <i class="fa fa-line-chart"></i> 单站能耗分析
      </h1>
      <p class="page-subtitle">对单个高铁站的能耗数据进行深入分析和趋势预测</p>
    </el-card>

    <!-- 筛选条件 -->
    <el-card shadow="hover" class="filter-card">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="站点选择">
            <el-select v-model="selectedStation" placeholder="请选择高铁站" clearable>
              <el-option
                v-for="station in stationList"
                :key="station.value"
                :label="station.label"
                :value="station.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="时间粒度">
            <el-select v-model="timeGranularity" placeholder="选择时间粒度">
              <el-option label="日" value="day" />
              <el-option label="周" value="week" />
              <el-option label="月" value="month" />
              <el-option label="年" value="year" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" class="filter-actions">
          <el-button type="primary" @click="handleQuery">
            <i class="fa fa-search"></i> 查询
          </el-button>
          <el-button type="info" @click="handleReset">
            <i class="fa fa-refresh"></i> 重置
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 能耗指标概览 -->
    <el-row :gutter="20" class="metrics-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="metric-card energy-total">
          <div class="metric-content">
            <div class="metric-header">
              <h3 class="metric-title">总能耗</h3>
              <i class="fa fa-bolt metric-icon"></i>
            </div>
            <div class="metric-value">{{ totalEnergy }} kWh</div>
            <div class="metric-trend">
              <span class="trend-label">同比</span>
              <span class="trend-value positive">{{ energyTrend.yoy }}%</span>
              <span class="trend-label">环比</span>
              <span class="trend-value negative">{{ energyTrend.mom }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="metric-card unit-energy">
          <div class="metric-content">
            <div class="metric-header">
              <h3 class="metric-title">单位面积能耗</h3>
              <i class="fa fa-area-chart metric-icon"></i>
            </div>
            <div class="metric-value">{{ unitAreaEnergy }} kWh/㎡</div>
            <div class="metric-trend">
              <span class="trend-label">同比</span>
              <span class="trend-value positive">{{ unitAreaTrend.yoy }}%</span>
              <span class="trend-label">环比</span>
              <span class="trend-value positive">{{ unitAreaTrend.mom }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="metric-card energy-cost">
          <div class="metric-content">
            <div class="metric-header">
              <h3 class="metric-title">能耗成本</h3>
              <i class="fa fa-money metric-icon"></i>
            </div>
            <div class="metric-value">¥{{ energyCost }}</div>
            <div class="metric-trend">
              <span class="trend-label">同比</span>
              <span class="trend-value negative">{{ costTrend.yoy }}%</span>
              <span class="trend-label">环比</span>
              <span class="trend-value positive">{{ costTrend.mom }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card shadow="hover" class="metric-card energy-efficiency">
          <div class="metric-content">
            <div class="metric-header">
              <h3 class="metric-title">能源效率</h3>
              <i class="fa fa-tachometer metric-icon"></i>
            </div>
            <div class="metric-value">{{ energyEfficiency }}%</div>
            <div class="metric-trend">
              <span class="trend-label">同比</span>
              <span class="trend-value positive">{{ efficiencyTrend.yoy }}%</span>
              <span class="trend-label">环比</span>
              <span class="trend-value positive">{{ efficiencyTrend.mom }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 能耗趋势图 -->
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <h3 class="card-title">
              <i class="fa fa-line-chart"></i> 能耗趋势分析
            </h3>
            <el-button type="text" size="small" @click="toggleChartFullscreen">
              <i class="fa fa-expand"></i>
            </el-button>
          </div>
          <div class="chart-container">
            <div ref="energyTrendChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 能耗结构分析 -->
    <el-row :gutter="20">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <h3 class="card-title">
              <i class="fa fa-pie-chart"></i> 能耗结构占比
            </h3>
          </div>
          <div class="chart-container">
            <div ref="energyStructureChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <h3 class="card-title">
              <i class="fa fa-bar-chart"></i> 部门能耗对比
            </h3>
          </div>
          <div class="chart-container">
            <div ref="departmentEnergyChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 异常能耗检测 -->
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-card shadow="hover" class="alert-card">
          <div slot="header" class="card-header">
            <h3 class="card-title">
              <i class="fa fa-exclamation-triangle"></i> 异常能耗检测
            </h3>
            <el-button type="success" size="small" @click="handleExportAlert">
              <i class="fa fa-download"></i> 导出报告
            </el-button>
          </div>
          <el-table
            :data="abnormalEnergyList"
            stripe
            border
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column prop="energyValue" label="能耗值(kWh)" width="120" />
            <el-table-column prop="expectedValue" label="预期值(kWh)" width="120" />
            <el-table-column prop="deviation" label="偏差率" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.deviation > 0 ? 'danger' : 'success'">
                  {{ scope.row.deviation }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="异常原因" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button type="primary" size="small" @click="handleViewDetail(scope.row)">
                  <i class="fa fa-eye"></i> 查看详情
                </el-button>
                <el-button type="warning" size="small" @click="handleMarkResolved(scope.row)">
                  <i class="fa fa-check-circle"></i> 标记已处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="abnormalEnergyList.length"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 能耗预测 -->
    <el-row :gutter="20">
      <el-col :xs="24">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <h3 class="card-title">
              <i class="fa fa-line-chart"></i> 能耗预测分析
            </h3>
            <el-select v-model="predictionDays" placeholder="预测天数" size="small">
              <el-option label="7天" value="7" />
              <el-option label="15天" value="15" />
              <el-option label="30天" value="30" />
            </el-select>
          </div>
          <div class="chart-container">
            <div ref="energyPredictionChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'StationAnalysis',
  data() {
    return {
      // 筛选条件
      selectedStation: '',
      dateRange: '',
      timeGranularity: 'day',
      predictionDays: '7',
      
      // 站点列表
      stationList: [
        { label: '北京南站', value: 'beijing-south' },
        { label: '上海虹桥站', value: 'shanghai-hongqiao' },
        { label: '广州南站', value: 'guangzhou-south' },
        { label: '深圳北站', value: 'shenzhen-north' },
        { label: '杭州东站', value: 'hangzhou-east' },
        { label: '成都东站', value: 'chengdu-east' }
      ],
      
      // 能耗指标数据
      totalEnergy: '2,345,678',
      unitAreaEnergy: '123.45',
      energyCost: '187,654.32',
      energyEfficiency: '85.6',
      
      // 趋势数据
      energyTrend: { yoy: '5.2', mom: '-2.1' },
      unitAreaTrend: { yoy: '3.1', mom: '1.8' },
      costTrend: { yoy: '7.5', mom: '-0.5' },
      efficiencyTrend: { yoy: '2.8', mom: '1.2' },
      
      // 异常能耗列表
      abnormalEnergyList: [],
      
      // 分页数据
      currentPage: 1,
      pageSize: 10,
      loading: false,
      
      // 图表实例
      energyTrendChart: null,
      energyStructureChart: null,
      departmentEnergyChart: null,
      energyPredictionChart: null
    }
  },
  mounted() {
    this.initCharts()
    this.loadAbnormalEnergyData()
    this.selectedStation = 'beijing-south'
  },
  beforeUnmount() {
    // 销毁图表实例
    if (this.energyTrendChart) {
      this.energyTrendChart.dispose()
    }
    if (this.energyStructureChart) {
      this.energyStructureChart.dispose()
    }
    if (this.departmentEnergyChart) {
      this.departmentEnergyChart.dispose()
    }
    if (this.energyPredictionChart) {
      this.energyPredictionChart.dispose()
    }
  },
  methods: {
    // 初始化图表
    initCharts() {
      this.initEnergyTrendChart()
      this.initEnergyStructureChart()
      this.initDepartmentEnergyChart()
      this.initEnergyPredictionChart()
      
      // 监听窗口大小变化，调整图表大小
      window.addEventListener('resize', this.handleWindowResize)
    },
    
    // 初始化能耗趋势图
    initEnergyTrendChart() {
      this.energyTrendChart = echarts.init(this.$refs.energyTrendChart)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['实际能耗', '预测能耗', '历史平均'],
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
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value',
          name: '能耗(kWh)',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '实际能耗',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120000, 190000, 360000, 280000, 450000, 320000, 580000, 620000, 480000, 350000, 280000, 220000]
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
            data: [null, null, null, null, null, null, null, null, null, null, 290000, 230000]
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
            data: [180000, 220000, 310000, 290000, 410000, 350000, 520000, 580000, 450000, 330000, 270000, 210000]
          }
        ]
      }
      this.energyTrendChart.setOption(option)
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
    
    // 初始化能耗预测图
    initEnergyPredictionChart() {
      this.energyPredictionChart = echarts.init(this.$refs.energyPredictionChart)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['实际能耗', '预测能耗'],
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
          data: ['1月1日', '1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日', '1月8日', '1月9日', '1月10日', '1月11日', '1月12日', '1月13日', '1月14日', '1月15日']
        },
        yAxis: {
          type: 'value',
          name: '能耗(kWh)'
        },
        series: [
          {
            name: '实际能耗',
            type: 'line',
            data: [12000, 19000, 36000, 28000, 45000, 32000, 58000],
            itemStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '预测能耗',
            type: 'line',
            data: [null, null, null, null, null, null, null, 42000, 38000, 45000, 52000, 48000, 55000, 50000, 47000],
            lineStyle: {
              type: 'dashed',
              color: '#E6A23C'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(230, 162, 60, 0.5)' },
                { offset: 1, color: 'rgba(230, 162, 60, 0.1)' }
              ])
            }
          }
        ]
      }
      this.energyPredictionChart.setOption(option)
    },
    
    // 加载异常能耗数据
    loadAbnormalEnergyData() {
      this.loading = true
      // 模拟加载数据
      setTimeout(() => {
        this.abnormalEnergyList = [
          {
            id: 1,
            time: '2024-01-15 08:30:00',
            energyValue: '23,456',
            expectedValue: '18,500',
            deviation: '26.7',
            reason: '空调系统异常运行'
          },
          {
            id: 2,
            time: '2024-01-14 14:20:00',
            energyValue: '15,678',
            expectedValue: '12,300',
            deviation: '27.5',
            reason: '照明系统未按时关闭'
          },
          {
            id: 3,
            time: '2024-01-13 22:15:00',
            energyValue: '8,901',
            expectedValue: '6,500',
            deviation: '36.9',
            reason: '设备房通风系统故障'
          },
          {
            id: 4,
            time: '2024-01-12 09:45:00',
            energyValue: '19,234',
            expectedValue: '16,800',
            deviation: '14.5',
            reason: '候车大厅空调温度设置过低'
          },
          {
            id: 5,
            time: '2024-01-11 16:30:00',
            energyValue: '13,456',
            expectedValue: '10,200',
            deviation: '31.9',
            reason: '售票厅照明系统异常'
          }
        ]
        this.loading = false
      }, 1000)
    },
    
    // 查询数据
    handleQuery() {
      this.loading = true
      // 模拟查询数据
      setTimeout(() => {
        this.loading = false
        this.$message.success('查询成功')
      }, 1000)
    },
    
    // 重置筛选条件
    handleReset() {
      this.selectedStation = ''
      this.dateRange = ''
      this.timeGranularity = 'day'
      this.$message.info('筛选条件已重置')
    },
    
    // 切换图表全屏
    toggleChartFullscreen() {
      this.$message.info('全屏功能开发中...')
    },
    
    // 查看异常详情
    handleViewDetail(row) {
      this.$message.info(`查看ID为${row.id}的异常详情`)
    },
    
    // 标记异常已处理
    handleMarkResolved(row) {
      this.$confirm('确定要标记此异常为已处理吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('标记成功')
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    
    // 导出异常报告
    handleExportAlert() {
      this.$message.info('导出异常报告功能开发中...')
    },
    
    // 分页处理
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
    },
    
    handleCurrentChange(val) {
      this.currentPage = val
    },
    
    // 窗口大小变化时调整图表大小
    handleWindowResize() {
      if (this.energyTrendChart) {
        this.energyTrendChart.resize()
      }
      if (this.energyStructureChart) {
        this.energyStructureChart.resize()
      }
      if (this.departmentEnergyChart) {
        this.departmentEnergyChart.resize()
      }
      if (this.energyPredictionChart) {
        this.energyPredictionChart.resize()
      }
    }
  }
}
</script>

<style scoped>
.station-analysis-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 页面标题样式 */
.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
}

.page-title i {
  margin-right: 10px;
  color: #409EFF;
}

.page-subtitle {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

/* 筛选条件样式 */
.filter-card {
  margin-bottom: 20px;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.filter-actions .el-button {
  margin-left: 10px;
}

/* 指标卡片样式 */
.metrics-row {
  margin-bottom: 20px;
}

.metric-card {
  height: 100%;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.metric-content {
  padding: 20px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.metric-title {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  margin: 0;
}

.metric-icon {
  font-size: 24px;
  color: #909399;
}

.metric-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.metric-trend {
  font-size: 14px;
  color: #606266;
}

.trend-label {
  margin-right: 5px;
}

.trend-value {
  margin-right: 15px;
  font-weight: 500;
}

.trend-value.positive {
  color: #F56C6C;
}

.trend-value.negative {
  color: #67C23A;
}

/* 卡片样式 */
.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
}

.card-title i {
  margin-right: 8px;
  color: #409EFF;
}

/* 图表容器样式 */
.chart-container {
  position: relative;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}

/* 表格样式 */
.alert-card .el-table {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .station-analysis-container {
    padding: 10px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .metric-value {
    font-size: 24px;
  }
}
</style>