<template>
  <div v-if="simulationResults" class="results-container">
    <!-- 节能效果概览 -->
    <el-card shadow="hover" class="results-card">
      <div slot="header" class="card-header">
        <h3 class="card-title">
          <i class="fa fa-bar-chart"></i> 节能效果概览
        </h3>
      </div>
      <el-row :gutter="20" class="results-metrics">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="metric-item">
            <h4 class="metric-name">预计节能量</h4>
            <div class="metric-value">
              <span class="value-number">{{ simulationResults.expectedSavings }}</span>
              <span class="value-unit">kWh</span>
            </div>
            <div class="metric-desc">策略实施后的预计节能量</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="metric-item">
            <h4 class="metric-name">节能率</h4>
            <div class="metric-value">
              <span class="value-number">{{ simulationResults.savingsRate }}</span>
              <span class="value-unit">%</span>
            </div>
            <div class="metric-desc">相比基准能耗的节能比例</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="metric-item">
            <h4 class="metric-name">预计收益</h4>
            <div class="metric-value">
              <span class="value-number">¥{{ simulationResults.expectedRevenue }}</span>
            </div>
            <div class="metric-desc">按当前电价计算的年收益</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="metric-item">
            <h4 class="metric-name">投资回收期</h4>
            <div class="metric-value">
              <span class="value-number">{{ simulationResults.paybackPeriod }}</span>
              <span class="value-unit">年</span>
            </div>
            <div class="metric-desc">策略实施的投资回收周期</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 策略实施成本估算 -->
    <el-card shadow="hover" class="results-card">
      <div slot="header" class="card-header">
        <h3 class="card-title">
          <i class="fa fa-money"></i> 策略实施成本估算
        </h3>
      </div>
      <el-row :gutter="20" class="results-metrics">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="metric-item">
            <h4 class="metric-name">总投资成本</h4>
            <div class="metric-value">
              <span class="value-number">¥{{ simulationResults.costEstimation.totalInvestment }}</span>
            </div>
            <div class="metric-desc">所有策略的总投资成本</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="metric-item">
            <h4 class="metric-name">硬件成本</h4>
            <div class="metric-value">
              <span class="value-number">¥{{ simulationResults.costEstimation.hardwareCost }}</span>
            </div>
            <div class="metric-desc">设备采购成本</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="metric-item">
            <h4 class="metric-name">安装成本</h4>
            <div class="metric-value">
              <span class="value-number">¥{{ simulationResults.costEstimation.installationCost }}</span>
            </div>
            <div class="metric-desc">设备安装和调试成本</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="metric-item">
            <h4 class="metric-name">年维护成本</h4>
            <div class="metric-value">
              <span class="value-number">¥{{ simulationResults.costEstimation.annualMaintenanceCost }}</span>
            </div>
            <div class="metric-desc">每年的设备维护成本</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 模拟结果图表 -->
    <el-row :gutter="20">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <h3 class="card-title">能耗对比分析</h3>
          </div>
          <div class="chart-container">
            <div ref="energyComparisonChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="chart-card">
          <div slot="header" class="card-header">
            <h3 class="card-title">策略节能贡献分布</h3>
          </div>
          <div class="chart-container">
            <div ref="strategyContributionChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 策略效果详情 -->
    <el-card shadow="hover" class="details-card">
      <div slot="header" class="card-header">
        <h3 class="card-title">策略效果详情</h3>
      </div>
      <el-table :data="strategyDetails" stripe style="width: 100%">
        <el-table-column prop="name" label="策略名称" width="200" />
        <el-table-column prop="savings" label="节能量(kWh)" width="150" />
        <el-table-column prop="savingsRate" label="节能率(%)" width="120">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.savingsRate" :stroke-width="6" />
          </template>
        </el-table-column>
        <el-table-column prop="investment" label="投资成本(元)" width="150" />
        <el-table-column prop="annualRevenue" label="年收益(元)" width="150" />
        <el-table-column prop="paybackPeriod" label="回收期(年)" width="120" />
        <el-table-column prop="description" label="策略描述" />
      </el-table>
    </el-card>

    <!-- 策略影响范围分析 -->
    <el-card shadow="hover" class="impact-analysis-card">
      <div slot="header" class="card-header">
        <h3 class="card-title">
          <i class="fa fa-map-o"></i> 策略影响范围分析
        </h3>
      </div>
      <div class="impact-content">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <h4 class="section-title">区域影响分析</h4>
            <el-table :data="simulationResults.impactAnalysis.areas" stripe style="width: 100%">
              <el-table-column prop="name" label="区域" width="150" />
              <el-table-column prop="savings" label="节能量(kWh)" width="150" />
              <el-table-column prop="percentage" label="占比(%)" width="120">
                <template slot-scope="scope">
                  <el-progress :percentage="scope.row.percentage" :stroke-width="6" />
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" />
            </el-table>
          </el-col>
          <el-col :xs="24" :md="12">
            <h4 class="section-title">设备类型影响</h4>
            <el-table :data="simulationResults.impactAnalysis.devices" stripe style="width: 100%">
              <el-table-column prop="name" label="设备类型" width="150" />
              <el-table-column prop="savings" label="节能量(kWh)" width="150" />
              <el-table-column prop="percentage" label="占比(%)" width="120">
                <template slot-scope="scope">
                  <el-progress :percentage="scope.row.percentage" :stroke-width="6" />
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" />
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 实施建议 -->
    <el-card shadow="hover" class="recommendation-card">
      <div slot="header" class="card-header">
        <h3 class="card-title">
          <i class="fa fa-lightbulb-o"></i> 实施建议
        </h3>
      </div>
      <div class="recommendation-content">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in recommendations"
            :key="index"
            :timestamp="item.timestamp"
            placement="top"
          >
            <el-card shadow="hover">
              <h4 class="recommendation-title">{{ item.title }}</h4>
              <p class="recommendation-desc">{{ item.content }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="saveResults">保存结果</el-button>
      <el-button @click="printReport">打印报告</el-button>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'SimulationResults',
  data() {
    return {
      // 图表实例
      energyComparisonChart: null,
      strategyContributionChart: null
    }
  },
  props: {
    simulationResults: {
      type: Object,
      default: null
    },
    strategyDetails: {
      type: Array,
      default: () => []
    },
    recommendations: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    simulationResults: {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.initCharts()
          })
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.simulationResults) {
      this.initCharts()
    }
  },
  beforeDestroy() {
    // 销毁图表实例
    if (this.energyComparisonChart) {
      this.energyComparisonChart.dispose()
    }
    if (this.strategyContributionChart) {
      this.strategyContributionChart.dispose()
    }
  },
  methods: {
    // 初始化图表
    initCharts() {
      // 能耗对比分析图表
      if (this.$refs.energyComparisonChart) {
        this.energyComparisonChart = echarts.init(this.$refs.energyComparisonChart)
        this.energyComparisonChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['基准能耗', '策略实施后能耗', '节能量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['照明', '空调', '通风', '其他']
          },
          yAxis: {
            type: 'value',
            name: '能耗(kWh)'
          },
          series: [
            {
              name: '基准能耗',
              type: 'bar',
              data: [25000, 45000, 15000, 10000],
              itemStyle: {
                color: '#909399'
              }
            },
            {
              name: '策略实施后能耗',
              type: 'bar',
              data: [15000, 30000, 10000, 8000],
              itemStyle: {
                color: '#409EFF'
              }
            },
            {
              name: '节能量',
              type: 'bar',
              data: [10000, 15000, 5000, 2000],
              itemStyle: {
                color: '#67C23A'
              }
            }
          ]
        })
      }

      // 策略节能贡献分布图表
      if (this.$refs.strategyContributionChart) {
        this.strategyContributionChart = echarts.init(this.$refs.strategyContributionChart)
        this.strategyContributionChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: this.strategyDetails.map(item => item.name)
          },
          series: [
            {
              name: '节能贡献',
              type: 'pie',
              radius: '50%',
              center: ['50%', '60%'],
              data: this.strategyDetails.map(item => ({
                value: item.savings,
                name: item.name
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      }

      // 响应式调整
      window.addEventListener('resize', this.handleResize)
    },
    // 处理窗口大小变化
    handleResize() {
      if (this.energyComparisonChart) {
        this.energyComparisonChart.resize()
      }
      if (this.strategyContributionChart) {
        this.strategyContributionChart.resize()
      }
    },
    // 保存结果
    saveResults() {
      this.$emit('save-results', this.simulationResults)
    },
    // 打印报告
    printReport() {
      window.print()
    }
  }
}
</script>

<style scoped>
.results-container {
  padding: 20px;
}

.results-card,
.chart-card,
.details-card,
.impact-analysis-card,
.recommendation-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.results-metrics {
  margin-top: 10px;
}

.metric-item {
  text-align: center;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.metric-name {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.value-unit {
  font-size: 16px;
  margin-left: 5px;
}

.metric-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.chart-container {
  height: 300px;
}

.chart {
  width: 100%;
  height: 100%;
}

.section-title {
  margin-bottom: 15px;
  font-size: 16px;
  color: #303133;
  font-weight: bold;
}

.recommendation-content {
  padding: 10px 0;
}

.recommendation-title {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #303133;
}

.recommendation-desc {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.action-buttons {
  text-align: center;
  margin-top: 20px;
}

.action-buttons .el-button {
  margin: 0 10px;
}
</style>