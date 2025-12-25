<template>
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
</template>

<script>
export default {
  name: 'MetricsOverview',
  props: {
    totalEnergy: {
      type: String,
      default: '0'
    },
    unitAreaEnergy: {
      type: String,
      default: '0'
    },
    energyCost: {
      type: String,
      default: '0'
    },
    energyEfficiency: {
      type: String,
      default: '0'
    },
    energyTrend: {
      type: Object,
      default: () => ({ yoy: '0', mom: '0' })
    },
    unitAreaTrend: {
      type: Object,
      default: () => ({ yoy: '0', mom: '0' })
    },
    costTrend: {
      type: Object,
      default: () => ({ yoy: '0', mom: '0' })
    },
    efficiencyTrend: {
      type: Object,
      default: () => ({ yoy: '0', mom: '0' })
    }
  }
}
</script>

<style scoped>
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
  padding: 16px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.metric-icon {
  font-size: 24px;
  color: #409EFF;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #303133;
}

.metric-trend {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.trend-label {
  color: #909399;
  margin-right: 8px;
}

.trend-value {
  font-weight: 500;
  margin-right: 16px;
}

.trend-value.positive {
  color: #67C23A;
}

.trend-value.negative {
  color: #F56C6C;
}

.energy-total .metric-icon {
  color: #F56C6C;
}

.unit-energy .metric-icon {
  color: #E6A23C;
}

.energy-cost .metric-icon {
  color: #67C23A;
}

.energy-efficiency .metric-icon {
  color: #409EFF;
}
</style>