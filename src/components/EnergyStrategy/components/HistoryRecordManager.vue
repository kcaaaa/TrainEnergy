<template>
  <!-- 历史记录列表弹窗 -->
  <el-dialog
    :title="'历史记录管理'"
    :visible.sync="dialogVisible"
    width="800px"
    center
  >
    <div class="history-list">
      <el-table
        :data="historyList"
        stripe
        border
        style="width: 100%"
        @row-click="handleRowClick"
      >
        <el-table-column prop="id" label="记录ID" width="80" />
        <el-table-column prop="strategyName" label="策略名称" width="150" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="energySavingRate" label="节能率(%)" width="100" />
        <el-table-column prop="annualSavings" label="年节能量(kWh)" width="120" />
        <el-table-column prop="annualCostSavings" label="年节约费用(元)" width="120" />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleDetail(scope.row)">查看详情</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
  
  <!-- 历史记录详情弹窗 -->
  <el-dialog
    :title="'历史记录详情'"
    :visible.sync="detailVisible"
    width="900px"
    center
  >
    <div class="history-detail" v-if="selectedRecord">
      <el-card shadow="hover">
        <div slot="header" class="clearfix">
          <span>{{ selectedRecord.strategyName }} - 模拟结果详情</span>
        </div>
        
        <div class="detail-info">
          <div class="info-item">
            <label>记录ID：</label>
            <span>{{ selectedRecord.id }}</span>
          </div>
          <div class="info-item">
            <label>创建时间：</label>
            <span>{{ selectedRecord.createTime }}</span>
          </div>
          <div class="info-item">
            <label>策略名称：</label>
            <span>{{ selectedRecord.strategyName }}</span>
          </div>
          <div class="info-item">
            <label>模拟时长：</label>
            <span>{{ selectedRecord.simulationTime }} 小时</span>
          </div>
        </div>
        
        <el-divider />
        
        <div class="detail-results">
          <h3>节能效果</h3>
          <div class="results-grid">
            <div class="result-item">
              <div class="result-label">节能率</div>
              <div class="result-value">{{ selectedRecord.energySavingRate }}%</div>
            </div>
            <div class="result-item">
              <div class="result-label">年节能量</div>
              <div class="result-value">{{ selectedRecord.annualSavings }} kWh</div>
            </div>
            <div class="result-item">
              <div class="result-label">年节约费用</div>
              <div class="result-value">{{ selectedRecord.annualCostSavings }} 元</div>
            </div>
            <div class="result-item">
              <div class="result-label">投资回收期</div>
              <div class="result-value">{{ selectedRecord.paybackPeriod }} 年</div>
            </div>
          </div>
          
          <h3 style="margin-top: 20px">策略参数</h3>
          <el-table :data="formatParams" stripe border style="width: 100%" size="small">
            <el-table-column prop="key" label="参数名" width="180" />
            <el-table-column prop="value" label="参数值" />
          </el-table>
          
          <!-- 策略实施成本估算 -->
          <h3 style="margin-top: 20px">策略实施成本估算</h3>
          <div class="cost-grid">
            <div class="cost-item">
              <div class="cost-label">总投资</div>
              <div class="cost-value">{{ selectedRecord.totalInvestment }} 元</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">硬件成本</div>
              <div class="cost-value">{{ selectedRecord.hardwareCost }} 元</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">安装成本</div>
              <div class="cost-value">{{ selectedRecord.installationCost }} 元</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">年维护成本</div>
              <div class="cost-value">{{ selectedRecord.annualMaintenanceCost }} 元</div>
            </div>
          </div>
          
          <h3 style="margin-top: 20px">设备运行数据</h3>
          <div class="equipment-data">
            <el-table :data="selectedRecord.equipmentData" stripe border style="width: 100%" size="small">
              <el-table-column prop="equipmentName" label="设备名称" width="150" />
              <el-table-column prop="power" label="功率(kW)" width="100" />
              <el-table-column prop="operatingTime" label="运行时长(h)" width="120" />
              <el-table-column prop="energyConsumption" label="能耗(kWh)" width="120" />
              <el-table-column prop="efficiency" label="运行效率(%)" width="120" />
            </el-table>
          </div>
        </div>
      </el-card>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'HistoryRecordManager',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    historyList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      detailVisible: false,
      selectedRecord: null
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    formatParams() {
      if (!this.selectedRecord || !this.selectedRecord.strategyParams) {
        return []
      }
      
      const params = this.selectedRecord.strategyParams
      return Object.keys(params).map(key => {
        return {
          key: this.formatParamName(key),
          value: params[key]
        }
      })
    }
  },
  methods: {
    formatParamName(key) {
      const paramMap = {
        targetTemp: '目标温度(°C)',
        ventilationTime: '通风时长(h/d)',
        lightingTime: '照明时长(h/d)',
        tempGradient: '温度梯度(°C)',
        sensorDensity: '传感器密度(个/㎡)',
        co2Threshold: 'CO₂阈值(ppm)',
        freshAirRatio: '新风比(%)',
        lightThreshold: '光照阈值(lux)',
        dimmingCoeff: '调光系数',
        solarArea: '光伏安装面积(㎡)',
        storageCapacity: '储能容量(kWh)',
        equipmentRatio: '设备更新比例(%)',
        priority: '优化优先级',
        participationRate: '员工参与度(%)',
        incentiveCoeff: '激励系数'
      }
      return paramMap[key] || key
    },
    handleRowClick(row) {
      this.handleDetail(row)
    },
    handleDetail(row) {
      this.selectedRecord = row
      this.detailVisible = true
    },
    handleDelete(id) {
      this.$confirm('确定要删除这条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete-record', id)
        this.$message.success('删除成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    closeDetail() {
      this.detailVisible = false
      this.selectedRecord = null
    }
  },
  watch: {
    detailVisible(val) {
      if (!val) {
        this.selectedRecord = null
      }
    }
  }
}
</script>

<style scoped>
.history-list {
  max-height: 500px;
  overflow-y: auto;
}

.history-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-info {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.info-item {
  width: 25%;
  margin-bottom: 10px;
}

.info-item label {
  font-weight: bold;
  margin-right: 10px;
}

.results-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.result-item {
  flex: 1;
  min-width: 200px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: center;
}

.result-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.result-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.cost-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.cost-item {
  flex: 1;
  min-width: 200px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  text-align: center;
}

.cost-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.cost-value {
  font-size: 20px;
  font-weight: bold;
  color: #E6A23C;
}

.equipment-data {
  margin-top: 20px;
}
</style>