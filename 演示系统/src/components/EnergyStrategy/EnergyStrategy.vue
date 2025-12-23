<template>
  <div class="energy-strategy-container">
    <!-- 页面标题 -->
    <el-card shadow="hover" class="page-header">
      <h1 class="page-title">
        <i class="fa fa-lightbulb-o"></i> 节能策略模拟
      </h1>
      <p class="page-subtitle">模拟不同节能策略的实施效果，评估节能潜力和经济效益</p>
    </el-card>

    <!-- 策略选择与参数设置 -->
    <el-card shadow="hover" class="strategy-card">
      <div slot="header" class="card-header">
        <h3 class="card-title">
          <i class="fa fa-sliders"></i> 策略选择与参数设置
        </h3>
      </div>
      <div class="strategy-content">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <div class="strategy-section">
              <h4 class="section-title">站点与时间选择</h4>
              <el-form :model="formData" label-position="left" label-width="120px">
                <el-form-item label="目标站点">
                  <el-select v-model="formData.station" placeholder="请选择站点" style="width: 100%">
                    <el-option 
                      v-for="station in stationOptions" 
                      :key="station.value" 
                      :label="station.label" 
                      :value="station.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="模拟时间范围">
                  <el-date-picker
                    v-model="formData.dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="strategy-section">
              <h4 class="section-title">节能策略组合</h4>
              <el-checkbox-group v-model="formData.selectedStrategies" class="strategy-checkboxes">
                <el-checkbox :label="'lighting'">
                  <div class="checkbox-content">
                    <h5 class="checkbox-title">照明系统优化</h5>
                    <p class="checkbox-desc">更换LED灯具，安装感应控制系统</p>
                  </div>
                </el-checkbox>
                <el-checkbox :label="'airConditioning'">
                  <div class="checkbox-content">
                    <h5 class="checkbox-title">空调系统改造</h5>
                    <p class="checkbox-desc">使用变频技术，优化温度设置</p>
                  </div>
                </el-checkbox>
                <el-checkbox :label="'ventilation'">
                  <div class="checkbox-content">
                    <h5 class="checkbox-title">通风系统优化</h5>
                    <p class="checkbox-desc">安装CO2传感器，按需通风</p>
                  </div>
                </el-checkbox>
                <el-checkbox :label="'renewableEnergy'">
                  <div class="checkbox-content">
                    <h5 class="checkbox-title">可再生能源应用</h5>
                    <p class="checkbox-desc">安装太阳能光伏系统</p>
                  </div>
                </el-checkbox>
                <el-checkbox :label="'energyStorage'">
                  <div class="checkbox-content">
                    <h5 class="checkbox-title">能源存储系统</h5>
                    <p class="checkbox-desc">配置电池储能，峰谷电价套利</p>
                  </div>
                </el-checkbox>
                <el-checkbox :label="'smartControl'">
                  <div class="checkbox-content">
                    <h5 class="checkbox-title">智能控制系统</h5>
                    <p class="checkbox-desc">AI优化能源调度，实时监控</p>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
        <div class="strategy-actions">
          <el-button type="primary" @click="handleSimulate" :loading="simulating">
            <i class="fa fa-play"></i> 开始模拟
          </el-button>
          <el-button @click="handleReset">
            <i class="fa fa-refresh"></i> 重置
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 模拟结果展示 -->
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
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'EnergyStrategy',
  data() {
    return {
      // 表单数据
      formData: {
        station: 'BJ',
        dateRange: [new Date('2024-01-01'), new Date('2024-12-31')],
        selectedStrategies: ['lighting', 'airConditioning', 'smartControl']
      },
      // 站点选项
      stationOptions: [
        { label: '北京南站', value: 'BJ' },
        { label: '上海虹桥站', value: 'SH' },
        { label: '广州南站', value: 'GZ' },
        { label: '深圳北站', value: 'SZ' },
        { label: '杭州东站', value: 'HZ' },
        { label: '成都东站', value: 'CD' }
      ],
      // 模拟状态
      simulating: false,
      // 模拟结果
      simulationResults: null,
      // 图表实例
      energyComparisonChart: null,
      strategyContributionChart: null
    }
  },
  computed: {
    // 策略详情数据
    strategyDetails() {
      if (!this.simulationResults) return []
      return this.simulationResults.strategyDetails
    },
    // 实施建议
    recommendations() {
      if (!this.simulationResults) return []
      return this.simulationResults.recommendations
    }
  },
  mounted() {
    // 初始化默认模拟
    this.handleSimulate()
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
    // 开始模拟
    handleSimulate() {
      this.simulating = true
      // 模拟API请求延迟
      setTimeout(() => {
        this.generateSimulationResults()
        this.simulating = false
      }, 1500)
    },
    // 重置表单
    handleReset() {
      this.formData = {
        station: 'BJ',
        dateRange: [new Date('2024-01-01'), new Date('2024-12-31')],
        selectedStrategies: ['lighting', 'airConditioning', 'smartControl']
      }
      this.simulationResults = null
      // 销毁图表
      if (this.energyComparisonChart) {
        this.energyComparisonChart.dispose()
        this.energyComparisonChart = null
      }
      if (this.strategyContributionChart) {
        this.strategyContributionChart.dispose()
        this.strategyContributionChart = null
      }
    },
    // 生成模拟结果
    generateSimulationResults() {
      // 根据选择的策略生成模拟结果
      const baseEnergyConsumption = this.getBaseEnergyConsumption()
      const selectedStrategies = this.formData.selectedStrategies
      
      // 计算各策略的节能效果
      const strategyEffects = {
        lighting: { savings: 800000, investment: 1200000, savingsRate: 5, name: '照明系统优化', description: '更换LED灯具，安装感应控制系统' },
        airConditioning: { savings: 1500000, investment: 2800000, savingsRate: 9, name: '空调系统改造', description: '使用变频技术，优化温度设置' },
        ventilation: { savings: 600000, investment: 900000, savingsRate: 3.5, name: '通风系统优化', description: '安装CO2传感器，按需通风' },
        renewableEnergy: { savings: 2000000, investment: 8500000, savingsRate: 12, name: '可再生能源应用', description: '安装太阳能光伏系统' },
        energyStorage: { savings: 1200000, investment: 5200000, savingsRate: 7, name: '能源存储系统', description: '配置电池储能，峰谷电价套利' },
        smartControl: { savings: 900000, investment: 1800000, savingsRate: 5.5, name: '智能控制系统', description: 'AI优化能源调度，实时监控' }
      }
      
      // 计算总节能效果
      let totalSavings = 0
      let totalInvestment = 0
      const selectedEffects = []
      
      selectedStrategies.forEach(strategyKey => {
        const effect = strategyEffects[strategyKey]
        totalSavings += effect.savings
        totalInvestment += effect.investment
        // 计算年收益（按0.8元/kWh计算）
        const annualRevenue = Math.round(effect.savings * 0.8)
        // 计算回收期
        const paybackPeriod = (effect.investment / annualRevenue).toFixed(1)
        selectedEffects.push({
          ...effect,
          annualRevenue,
          paybackPeriod
        })
      })
      
      const savingsRate = ((totalSavings / baseEnergyConsumption) * 100).toFixed(1)
      const totalAnnualRevenue = Math.round(totalSavings * 0.8)
      const totalPaybackPeriod = (totalInvestment / totalAnnualRevenue).toFixed(1)
      
      // 生成模拟结果
      this.simulationResults = {
        expectedSavings: totalSavings.toLocaleString(),
        savingsRate,
        expectedRevenue: totalAnnualRevenue.toLocaleString(),
        paybackPeriod: totalPaybackPeriod,
        strategyDetails: selectedEffects,
        recommendations: this.generateRecommendations(selectedEffects)
      }
      
      // 绘制图表
      this.drawEnergyComparisonChart(baseEnergyConsumption, totalSavings)
      this.drawStrategyContributionChart(selectedEffects)
    },
    // 获取基准能耗
    getBaseEnergyConsumption() {
      // 根据站点获取基准能耗数据
      const baseEnergyData = {
        'BJ': 16800000,
        'SH': 18500000,
        'GZ': 15200000,
        'SZ': 14500000,
        'HZ': 12800000,
        'CD': 11500000
      }
      return baseEnergyData[this.formData.station] || 15000000
    },
    // 绘制能耗对比图表
    drawEnergyComparisonChart(baseEnergy, savings) {
      const chartDom = this.$refs.energyComparisonChart
      this.energyComparisonChart = echarts.init(chartDom)
      
      const option = {
        title: {
          text: '能耗对比',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            return params[0].name + ': ' + params[0].value.toLocaleString() + ' kWh'
          }
        },
        legend: {
          data: ['基准能耗', '实施后能耗'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['能耗对比']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} kWh'
          }
        },
        series: [
          {
            name: '基准能耗',
            type: 'bar',
            data: [baseEnergy],
            itemStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '实施后能耗',
            type: 'bar',
            data: [baseEnergy - savings],
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      }
      
      this.energyComparisonChart.setOption(option)
      
      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        this.energyComparisonChart.resize()
      })
    },
    // 绘制策略贡献分布图表
    drawStrategyContributionChart(strategies) {
      const chartDom = this.$refs.strategyContributionChart
      this.strategyContributionChart = echarts.init(chartDom)
      
      const option = {
        title: {
          text: '各策略节能贡献分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} kWh ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: strategies.map(item => item.name)
        },
        series: [
          {
            name: '节能贡献',
            type: 'pie',
            radius: '50%',
            data: strategies.map(item => ({
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
      }
      
      this.strategyContributionChart.setOption(option)
      
      // 监听窗口大小变化
      window.addEventListener('resize', () => {
        this.strategyContributionChart.resize()
      })
    },
    // 生成实施建议
    generateRecommendations(strategies) {
      const now = new Date()
      const timestamp = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      
      return [
        {
          title: '优先实施高性价比策略',
          content: '建议优先实施节能率高、回收期短的策略，如照明系统优化和智能控制系统，快速实现节能效果。',
          timestamp
        },
        {
          title: '分阶段实施长期策略',
          content: '对于投资较大的策略，如可再生能源应用和能源存储系统，建议分阶段实施，降低初期投资压力。',
          timestamp
        },
        {
          title: '建立能耗监测体系',
          content: '在实施节能策略的同时，建立完善的能耗监测体系，实时跟踪节能效果，及时调整策略。',
          timestamp
        },
        {
          title: '开展节能宣传培训',
          content: '对车站工作人员开展节能宣传和培训，提高节能意识，确保节能策略的有效实施。',
          timestamp
        },
        {
          title: '定期评估与优化',
          content: '定期评估节能策略的实施效果，根据实际情况进行优化调整，持续提升节能效益。',
          timestamp
        }
      ]
    }
  }
}
</script>

<style scoped>
.energy-strategy-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 页面标题 */
.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 28px;
  color: #303133;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
}

.page-title i {
  color: #67C23A;
  margin-right: 10px;
}

.page-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 策略卡片 */
.strategy-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
}

.card-title i {
  margin-right: 8px;
  color: #409EFF;
}

.strategy-content {
  padding: 20px 0;
}

.strategy-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #EBEEF5;
}

/* 策略选择 */
.strategy-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.checkbox-content {
  display: flex;
  flex-direction: column;
}

.checkbox-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 5px 0;
}

.checkbox-desc {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

/* 操作按钮 */
.strategy-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

/* 结果展示 */
.results-container {
  margin-top: 20px;
}

.results-card {
  margin-bottom: 20px;
}

.results-metrics {
  padding: 20px 0;
}

.metric-item {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.metric-name {
  font-size: 14px;
  color: #606266;
  margin: 0 0 10px 0;
}

.metric-value {
  margin: 10px 0;
}

.value-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}

.value-unit {
  font-size: 16px;
  color: #606266;
  margin-left: 5px;
}

.metric-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 10px;
}

/* 图表容器 */
.chart-container {
  height: 400px;
  margin-top: 20px;
}

.chart {
  width: 100%;
  height: 100%;
}

/* 策略详情表格 */
.details-card {
  margin-bottom: 20px;
}

/* 实施建议 */
.recommendation-card {
  margin-bottom: 20px;
}

.recommendation-content {
  padding: 20px 0;
}

.recommendation-title {
  font-size: 16px;
  color: #303133;
  margin: 0 0 10px 0;
}

.recommendation-desc {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .energy-strategy-container {
    padding: 10px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .strategy-content {
    padding: 10px 0;
  }
  
  .chart-container {
    height: 300px;
  }
  
  .metric-item {
    padding: 15px 10px;
  }
  
  .value-number {
    font-size: 24px;
  }
}
</style>