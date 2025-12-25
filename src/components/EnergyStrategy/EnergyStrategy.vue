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
        <el-button type="success" @click="handleTemplateManage">
          <i class="fa fa-folder"></i> 策略模板管理
        </el-button>
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
                <el-form-item label="策略模板">
                  <el-select v-model="formData.selectedTemplate" placeholder="请选择策略模板" @change="handleTemplateChange" style="width: 100%">
                    <el-option
                      v-for="template in strategyTemplates"
                      :key="template.id"
                      :label="template.name"
                      :value="template.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="strategy-section">
              <h4 class="section-title">节能策略组合</h4>
              <p class="section-desc">拖拽调整策略优先级（从上到下优先级递减）</p>
              <el-card class="sortable-list-card">
                <el-sortable
                  v-model="formData.strategyPriorities"
                  :handle="'.drag-handle'"
                  class="sortable-list"
                >
                  <div
                    v-for="strategy in strategyList"
                    :key="strategy.key"
                    class="sortable-item"
                  >
                    <div class="item-content">
                      <i class="fa fa-bars drag-handle"></i>
                      <el-checkbox
                        v-model="formData.selectedStrategies"
                        :label="strategy.key"
                      >
                        <div class="checkbox-content">
                          <h5 class="checkbox-title">{{ strategy.name }}</h5>
                          <p class="checkbox-desc">{{ strategy.description }}</p>
                          <el-button
                            type="primary"
                            size="small"
                            @click="handleParamConfig(strategy.key)"
                          >
                            <i class="fa fa-cog"></i> 配置参数
                          </el-button>
                        </div>
                      </el-checkbox>
                    </div>
                  </div>
                </el-sortable>
              </el-card>
            </div>
          </el-col>
        </el-row>
        <div class="strategy-actions">
          <el-button type="primary" @click="handleSimulate" :loading="simulating">
            <i class="fa fa-play"></i> 开始模拟
          </el-button>
          <el-button type="success" @click="handleSmartRecommendation">
            <i class="fa fa-lightbulb-o"></i> 智能推荐
          </el-button>
          <el-button @click="handleReset">
            <i class="fa fa-refresh"></i> 重置
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 创建/编辑策略模板弹窗 -->
    <el-dialog
      :title="isEditingTemplate ? '编辑策略模板' : '创建策略模板'"
      :visible.sync="templateDialogVisible"
      width="600px"
      center
    >
      <el-form :model="templateForm" label-width="100px" class="template-form">
        <el-form-item label="模板名称">
          <el-input v-model="templateForm.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板描述">
          <el-input
            v-model="templateForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入模板描述"
          />
        </el-form-item>
        <el-form-item label="包含策略">
          <el-checkbox-group v-model="templateForm.strategies">
            <el-checkbox label="lighting">照明系统优化</el-checkbox>
            <el-checkbox label="airConditioning">空调系统改造</el-checkbox>
            <el-checkbox label="ventilation">通风系统优化</el-checkbox>
            <el-checkbox label="renewableEnergy">可再生能源应用</el-checkbox>
            <el-checkbox label="energyStorage">能源存储系统</el-checkbox>
            <el-checkbox label="smartControl">智能控制系统</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTemplate">保存</el-button>
      </div>
    </el-dialog>

    <!-- 策略模板列表弹窗 -->
    <el-dialog
      title="策略模板管理"
      :visible.sync="templateListDialogVisible"
      width="800px"
      center
    >
      <div class="template-management">
        <el-button type="primary" @click="openCreateTemplateDialog">
          <i class="fa fa-plus"></i> 创建新模板
        </el-button>
        <div class="template-list">
          <div
            v-for="template in strategyTemplates"
            :key="template.id"
            class="template-item"
          >
            <div class="template-info">
              <h4 class="template-name">{{ template.name }}</h4>
              <p class="template-description">{{ template.description }}</p>
              <div class="template-strategies">
                <el-tag
                  v-for="strategyKey in template.strategies"
                  :key="strategyKey"
                  class="strategy-tag"
                >
                  {{ getStrategyName(strategyKey) }}
                </el-tag>
              </div>
            </div>
            <div class="template-actions">
              <el-button type="primary" size="small" @click="editTemplate(template)">
                <i class="fa fa-edit"></i> 编辑
              </el-button>
              <el-button type="danger" size="small" @click="deleteTemplate(template.id)">
                <i class="fa fa-trash"></i> 删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateListDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 参数配置弹窗 -->
    <el-dialog
      :title="`${getStrategyName(currentConfigStrategy)}参数配置`"
      :visible.sync="paramConfigDialogVisible"
      width="600px"
      center
    >
      <el-form :model="currentStrategyParams" label-width="120px" class="param-config-form">
        <!-- 照明系统优化参数 -->
        <template v-if="currentConfigStrategy === 'lighting'">
          <el-form-item label="温度阈值(°C)">
            <el-input-number v-model="currentStrategyParams.temperatureThreshold" :min="18" :max="30" :step="0.5" />
          </el-form-item>
          <el-form-item label="运行时间">
            <el-time-select
              v-model="currentStrategyParams.runtime"
              :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
              placeholder="选择运行时间"
            />
          </el-form-item>
          <el-form-item label="功率限制(W)">
            <el-input-number v-model="currentStrategyParams.powerLimit" :min="500" :max="5000" :step="100" />
          </el-form-item>
          <el-form-item label="感应控制">
            <el-switch v-model="currentStrategyParams.感应控制" />
          </el-form-item>
          <el-form-item label="定时开关">
            <el-switch v-model="currentStrategyParams.定时开关" />
          </el-form-item>
        </template>

        <!-- 空调系统改造参数 -->
        <template v-else-if="currentConfigStrategy === 'airConditioning'">
          <el-form-item label="温度阈值(°C)">
            <el-input-number v-model="currentStrategyParams.temperatureThreshold" :min="16" :max="28" :step="0.5" />
          </el-form-item>
          <el-form-item label="运行时间">
            <el-time-select
              v-model="currentStrategyParams.runtime"
              :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
              placeholder="选择运行时间"
            />
          </el-form-item>
          <el-form-item label="功率限制(W)">
            <el-input-number v-model="currentStrategyParams.powerLimit" :min="1000" :max="20000" :step="500" />
          </el-form-item>
          <el-form-item label="变频调节">
            <el-switch v-model="currentStrategyParams.变频调节" />
          </el-form-item>
          <el-form-item label="分区控制">
            <el-switch v-model="currentStrategyParams.分区控制" />
          </el-form-item>
        </template>

        <!-- 通风系统优化参数 -->
        <template v-else-if="currentConfigStrategy === 'ventilation'">
          <el-form-item label="CO2阈值(ppm)">
            <el-input-number v-model="currentStrategyParams.co2Threshold" :min="500" :max="2000" :step="100" />
          </el-form-item>
          <el-form-item label="运行时间">
            <el-time-select
              v-model="currentStrategyParams.runtime"
              :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
              placeholder="选择运行时间"
            />
          </el-form-item>
          <el-form-item label="功率限制(W)">
            <el-input-number v-model="currentStrategyParams.powerLimit" :min="500" :max="5000" :step="100" />
          </el-form-item>
          <el-form-item label="按需通风">
            <el-switch v-model="currentStrategyParams.按需通风" />
          </el-form-item>
        </template>

        <!-- 可再生能源应用参数 -->
        <template v-else-if="currentConfigStrategy === 'renewableEnergy'">
          <el-form-item label="太阳能容量(kW)">
            <el-input-number v-model="currentStrategyParams.solarCapacity" :min="100" :max="5000" :step="100" />
          </el-form-item>
          <el-form-item label="安装面积(m²)">
            <el-input-number v-model="currentStrategyParams.installationArea" :min="100" :max="20000" :step="100" />
          </el-form-item>
          <el-form-item label="功率限制(W)">
            <el-input-number v-model="currentStrategyParams.powerLimit" :min="500" :max="10000" :step="100" />
          </el-form-item>
        </template>

        <!-- 能源存储系统参数 -->
        <template v-else-if="currentConfigStrategy === 'energyStorage'">
          <el-form-item label="存储容量(kWh)">
            <el-input-number v-model="currentStrategyParams.capacity" :min="1000" :max="20000" :step="500" />
          </el-form-item>
          <el-form-item label="充电时间">
            <el-time-select
              v-model="currentStrategyParams.chargeTime"
              :picker-options="{ start: '00:00', step: '00:30', end: '23:30' }"
              placeholder="选择充电时间"
            />
          </el-form-item>
          <el-form-item label="放电时间">
            <el-input v-model="currentStrategyParams.dischargeTime" placeholder="例如: 08:00-12:00,18:00-22:00" />
          </el-form-item>
          <el-form-item label="功率限制(W)">
            <el-input-number v-model="currentStrategyParams.powerLimit" :min="500" :max="10000" :step="100" />
          </el-form-item>
        </template>

        <!-- 智能控制系统参数 -->
        <template v-else-if="currentConfigStrategy === 'smartControl'">
          <el-form-item label="AI优化">
            <el-switch v-model="currentStrategyParams.aiOptimization" />
          </el-form-item>
          <el-form-item label="实时监控">
            <el-switch v-model="currentStrategyParams.realTimeMonitoring" />
          </el-form-item>
          <el-form-item label="预测维护">
            <el-switch v-model="currentStrategyParams.predictiveMaintenance" />
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paramConfigDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveStrategyParams">保存</el-button>
      </div>
    </el-dialog>

    <!-- 历史记录列表弹窗 -->
    <el-dialog
      title="模拟历史记录"
      :visible.sync="historyListDialogVisible"
      width="800px"
      center
    >
      <div class="history-actions">
        <el-button type="danger" @click="clearAllHistory">
          <i class="fa fa-trash"></i> 清空所有记录
        </el-button>
      </div>
      <el-table :data="strategyHistory" stripe style="width: 100%">
        <el-table-column prop="timestamp" label="模拟时间" width="180" />
        <el-table-column prop="station" label="目标站点" width="120">
          <template slot-scope="scope">
            {{ getStationName(scope.row.station) }}
          </template>
        </el-table-column>
        <el-table-column prop="selectedStrategies" label="选择的策略" width="250">
          <template slot-scope="scope">
            <el-tag
              v-for="strategyKey in scope.row.selectedStrategies"
              :key="strategyKey"
              type="info"
              size="small"
              class="strategy-tag"
            >
              {{ getStrategyName(strategyKey) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expectedSavings" label="预计节能量(kWh)" width="120" />
        <el-table-column prop="savingsRate" label="节能率(%)" width="100">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.savingsRate" :stroke-width="6" />
          </template>
        </el-table-column>
        <el-table-column prop="expectedRevenue" label="预计收益(元)" width="120" />
        <el-table-column prop="paybackPeriod" label="回收期(年)" width="100" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="viewHistoryDetail(scope.row)"
            >
              查看详情
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteHistory(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="historyListDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 历史记录详情弹窗 -->
    <el-dialog
      title="模拟历史详情"
      :visible.sync="historyDetailDialogVisible"
      width="800px"
      center
    >
      <div v-if="currentHistoryRecord">
        <div class="detail-metrics">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="6">
              <div class="metric-item">
                <h4 class="metric-name">模拟时间</h4>
                <div class="metric-value">
                  <span class="value-number">{{ currentHistoryRecord.timestamp }}</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="metric-item">
                <h4 class="metric-name">目标站点</h4>
                <div class="metric-value">
                  <span class="value-number">{{ getStationName(currentHistoryRecord.station) }}</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="metric-item">
                <h4 class="metric-name">预计节能量</h4>
                <div class="metric-value">
                  <span class="value-number">{{ currentHistoryRecord.expectedSavings }}</span>
                  <span class="value-unit">kWh</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="metric-item">
                <h4 class="metric-name">节能率</h4>
                <div class="metric-value">
                  <span class="value-number">{{ currentHistoryRecord.savingsRate }}</span>
                  <span class="value-unit">%</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="metric-item">
                <h4 class="metric-name">预计收益</h4>
                <div class="metric-value">
                  <span class="value-number">¥{{ currentHistoryRecord.expectedRevenue }}</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6">
              <div class="metric-item">
                <h4 class="metric-name">投资回收期</h4>
                <div class="metric-value">
                  <span class="value-number">{{ currentHistoryRecord.paybackPeriod }}</span>
                  <span class="value-unit">年</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-card shadow="hover" class="detail-strategies">
          <h4 class="card-title">策略效果详情</h4>
          <el-table :data="currentHistoryRecord.strategyDetails" stripe style="width: 100%">
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
          </el-table>
        </el-card>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="historyDetailDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 模拟结果展示 -->
    <div v-if="simulationResults" class="results-container">
      <SimulationResults 
        :simulation-results="simulationResults"
        :strategy-details="strategyDetails"
        :recommendations="recommendations"
        @save-results="saveSimulationResults"
      />
    </div>
  </div>
</template>

<script>
import SimulationResults from './components/SimulationResults.vue'

export default {
  name: 'EnergyStrategy',
  components: {
    SimulationResults
  },
  data() {
    return {
      // 策略列表
      strategyList: [
        { key: 'lighting', name: '照明系统优化', description: '智能控制照明，根据环境光线和人员情况自动调节' },
        { key: 'airConditioning', name: '空调系统改造', description: '优化空调运行参数，提高能效比' },
        { key: 'ventilation', name: '通风系统优化', description: '智能控制通风，根据CO2浓度自动调节' },
        { key: 'renewableEnergy', name: '可再生能源应用', description: '安装太阳能、风能等可再生能源设备' },
        { key: 'energyStorage', name: '能源存储系统', description: '安装储能设备，优化能源使用时间' },
        { key: 'smartControl', name: '智能控制系统', description: 'AI优化能源调度，实时监控' }
      ],
      // 表单数据
      formData: {
        station: 'BJ',
        dateRange: [new Date('2024-01-01'), new Date('2024-12-31')],
        selectedStrategies: ['lighting', 'airConditioning', 'smartControl'],
        selectedTemplate: '',
        // 策略优先级
        strategyPriorities: ['lighting', 'airConditioning', 'ventilation', 'renewableEnergy', 'energyStorage', 'smartControl'],
        // 详细策略参数
        strategyParams: {
          lighting: {
            temperatureThreshold: 26,
            runtime: '08:00-22:00',
            powerLimit: 1000,
            感应控制: true,
            定时开关: true
          },
          airConditioning: {
            temperatureThreshold: 26,
            runtime: '08:00-22:00',
            powerLimit: 5000,
            变频调节: true,
            分区控制: true
          },
          ventilation: {
            co2Threshold: 1000,
            runtime: '08:00-22:00',
            powerLimit: 2000,
            按需通风: true
          },
          renewableEnergy: {
            solarCapacity: 1000,
            installationArea: 5000,
            powerLimit: 8000
          },
          energyStorage: {
            capacity: 5000,
            chargeTime: '23:00',
            dischargeTime: '08:00-12:00,18:00-22:00',
            powerLimit: 10000
          },
          smartControl: {
            aiOptimization: true,
            realTimeMonitoring: true,
            predictiveMaintenance: true
          }
        }
      },
      // 站点选项
      stationOptions: [
        { value: 'BJ', label: '北京南站' },
        { value: 'SH', label: '上海虹桥站' },
        { value: 'GZ', label: '广州南站' },
        { value: 'SZ', label: '深圳北站' },
        { value: 'CD', label: '成都东站' },
        { value: 'HZ', label: '杭州东站' }
      ],
      // 模拟相关
      simulating: false,
      simulationResults: null,
      strategyDetails: [],
      recommendations: [],
      // 策略模板
      strategyTemplates: [],
      templateDialogVisible: false,
      templateListDialogVisible: false,
      isEditingTemplate: false,
      templateForm: {
        name: '',
        description: '',
        strategies: []
      },
      // 参数配置
      paramConfigDialogVisible: false,
      currentConfigStrategy: '',
      currentStrategyParams: {},
      // 历史记录
      historyListDialogVisible: false,
      historyDetailDialogVisible: false,
      strategyHistory: [],
      currentHistoryRecord: null
    }
  },
  mounted() {
    // 初始化策略模板
    this.initStrategyTemplates()
    // 初始化历史记录
    this.initHistory()
  },
  methods: {
    // 初始化策略模板
    initStrategyTemplates() {
      const templates = localStorage.getItem('strategyTemplates')
      if (templates) {
        this.strategyTemplates = JSON.parse(templates)
      } else {
        // 默认模板
        this.strategyTemplates = [
          {
            id: 1,
            name: '基础节能套餐',
            description: '适合小型车站的基础节能方案',
            strategies: ['lighting', 'ventilation']
          },
          {
            id: 2,
            name: '标准节能套餐',
            description: '适合中型车站的标准节能方案',
            strategies: ['lighting', 'airConditioning', 'smartControl']
          },
          {
            id: 3,
            name: '高级节能套餐',
            description: '适合大型车站的高级节能方案',
            strategies: ['lighting', 'airConditioning', 'renewableEnergy', 'smartControl']
          }
        ]
        localStorage.setItem('strategyTemplates', JSON.stringify(this.strategyTemplates))
      }
    },
    // 初始化历史记录
    initHistory() {
      const history = localStorage.getItem('strategyHistory')
      if (history) {
        this.strategyHistory = JSON.parse(history)
      } else {
        this.strategyHistory = []
      }
    },
    // 处理模板管理
    handleTemplateManage() {
      this.templateListDialogVisible = true
    },
    // 打开创建模板弹窗
    openCreateTemplateDialog() {
      this.isEditingTemplate = false
      this.templateForm = {
        name: '',
        description: '',
        strategies: []
      }
      this.templateDialogVisible = true
    },
    // 编辑模板
    editTemplate(template) {
      this.isEditingTemplate = true
      this.templateForm = JSON.parse(JSON.stringify(template))
      this.templateDialogVisible = true
    },
    // 保存模板
    saveTemplate() {
      if (!this.templateForm.name) {
        this.$message.error('请输入模板名称')
        return
      }
      
      if (this.isEditingTemplate) {
        // 更新现有模板
        const index = this.strategyTemplates.findIndex(t => t.id === this.templateForm.id)
        if (index !== -1) {
          this.strategyTemplates[index] = this.templateForm
          this.$message.success('模板更新成功')
        }
      } else {
        // 创建新模板
        const newTemplate = {
          id: Date.now(),
          ...this.templateForm
        }
        this.strategyTemplates.push(newTemplate)
        this.$message.success('模板创建成功')
      }
      
      localStorage.setItem('strategyTemplates', JSON.stringify(this.strategyTemplates))
      this.templateDialogVisible = false
    },
    // 删除模板
    deleteTemplate(id) {
      this.$confirm('确定要删除该模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.strategyTemplates = this.strategyTemplates.filter(t => t.id !== id)
        localStorage.setItem('strategyTemplates', JSON.stringify(this.strategyTemplates))
        this.$message.success('模板删除成功')
      }).catch(() => {
        // 取消删除
      })
    },
    // 模板选择变化
    handleTemplateChange() {
      if (!this.formData.selectedTemplate) return
      
      const template = this.strategyTemplates.find(t => t.id === this.formData.selectedTemplate)
      if (template) {
        this.formData.selectedStrategies = [...template.strategies]
      }
    },
    // 处理参数配置
    handleParamConfig(strategyKey) {
      this.currentConfigStrategy = strategyKey
      this.currentStrategyParams = JSON.parse(JSON.stringify(this.formData.strategyParams[strategyKey]))
      this.paramConfigDialogVisible = true
    },
    // 保存策略参数
    saveStrategyParams() {
      this.formData.strategyParams[this.currentConfigStrategy] = JSON.parse(JSON.stringify(this.currentStrategyParams))
      this.$message.success('参数保存成功')
      this.paramConfigDialogVisible = false
    },
    // 获取策略名称
    getStrategyName(strategyKey) {
      const strategy = this.strategyList.find(s => s.key === strategyKey)
      return strategy ? strategy.name : strategyKey
    },
    // 获取站点名称
    getStationName(stationKey) {
      const station = this.stationOptions.find(s => s.value === stationKey)
      return station ? station.label : stationKey
    },
    // 处理模拟
    handleSimulate() {
      if (this.formData.selectedStrategies.length === 0) {
        this.$message.error('请至少选择一个节能策略')
        return
      }
      
      this.simulating = true
      
      // 模拟请求延迟
      setTimeout(() => {
        // 生成模拟结果
        this.generateSimulationResults()
        this.simulating = false
      }, 1500)
    },
    // 生成模拟结果
    generateSimulationResults() {
      // 计算模拟结果
      const baseConsumption = 1000000 // 基准能耗
      let totalSavings = 0
      const strategyDetails = []
      
      // 计算各策略的效果
      this.formData.selectedStrategies.forEach(strategyKey => {
        const params = this.formData.strategyParams[strategyKey]
        let savingsRate = 0
        let investment = 0
        let annualRevenue = 0
        
        switch (strategyKey) {
          case 'lighting':
            savingsRate = 0.15 // 15%节能率
            investment = 50000 // 5万元投资
            break
          case 'airConditioning':
            savingsRate = 0.25 // 25%节能率
            investment = 150000 // 15万元投资
            break
          case 'ventilation':
            savingsRate = 0.10 // 10%节能率
            investment = 30000 // 3万元投资
            break
          case 'renewableEnergy':
            savingsRate = 0.20 // 20%节能率
            investment = params.solarCapacity * 5000 // 5000元/kW
            break
          case 'energyStorage':
            savingsRate = 0.12 // 12%节能率
            investment = params.capacity * 1500 // 1500元/kWh
            break
          case 'smartControl':
            savingsRate = 0.18 // 18%节能率
            investment = 80000 // 8万元投资
            break
        }
        
        // 计算节能量
        const savings = baseConsumption * savingsRate * 0.8 // 考虑策略叠加效应
        totalSavings += savings
        
        // 计算年收益（电价按0.8元/kWh计算）
        annualRevenue = savings * 0.8
        
        // 计算回收期
        const paybackPeriod = investment / annualRevenue
        
        strategyDetails.push({
          name: this.getStrategyName(strategyKey),
          savings: Math.round(savings),
          savingsRate: Math.round(savingsRate * 100),
          investment: Math.round(investment),
          annualRevenue: Math.round(annualRevenue),
          paybackPeriod: Math.round(paybackPeriod * 10) / 10
        })
      })
      
      // 计算总成本
      const totalInvestment = strategyDetails.reduce((sum, item) => sum + item.investment, 0)
      const hardwareCost = Math.round(totalInvestment * 0.8) // 硬件成本占80%
      const installationCost = Math.round(totalInvestment * 0.2) // 安装成本占20%
      const annualMaintenanceCost = Math.round(totalInvestment * 0.05) // 年维护成本5%
      
      // 生成模拟结果
      this.simulationResults = {
        expectedSavings: Math.round(totalSavings),
        savingsRate: Math.round((totalSavings / baseConsumption) * 100),
        expectedRevenue: Math.round(totalSavings * 0.8),
        paybackPeriod: Math.round((totalInvestment / (totalSavings * 0.8)) * 10) / 10,
        costEstimation: {
          totalInvestment: Math.round(totalInvestment),
          hardwareCost: hardwareCost,
          installationCost: installationCost,
          annualMaintenanceCost: annualMaintenanceCost
        },
        impactAnalysis: {
          areas: [
            { name: '候车厅', savings: Math.round(totalSavings * 0.6), percentage: 60, description: '主要节能区域' },
            { name: '站台', savings: Math.round(totalSavings * 0.2), percentage: 20, description: '次要节能区域' },
            { name: '办公区', savings: Math.round(totalSavings * 0.1), percentage: 10, description: '辅助节能区域' },
            { name: '其他区域', savings: Math.round(totalSavings * 0.1), percentage: 10, description: '其他节能区域' }
          ],
          devices: [
            { name: '照明设备', savings: Math.round(totalSavings * 0.35), percentage: 35, description: '照明系统节能' },
            { name: '空调设备', savings: Math.round(totalSavings * 0.45), percentage: 45, description: '空调系统节能' },
            { name: '通风设备', savings: Math.round(totalSavings * 0.10), percentage: 10, description: '通风系统节能' },
            { name: '其他设备', savings: Math.round(totalSavings * 0.10), percentage: 10, description: '其他设备节能' }
          ]
        }
      }
      
      this.strategyDetails = strategyDetails
      
      // 生成实施建议
      this.generateRecommendations()
    },
    // 生成实施建议
    generateRecommendations() {
      this.recommendations = [
        {
          title: '优先实施快速见效策略',
          content: '建议先实施照明系统优化和智能控制系统，这两项策略投资小、见效快，回收期较短。',
          timestamp: '2024-01-15'
        },
        {
          title: '分阶段实施大型项目',
          content: '可再生能源应用和能源存储系统投资较大，建议分阶段实施，先试点后推广。',
          timestamp: '2024-01-15'
        },
        {
          title: '建立能源监控体系',
          content: '实施节能策略后，建议建立完善的能源监控体系，实时跟踪节能效果，及时调整策略。',
          timestamp: '2024-01-15'
        },
        {
          title: '定期维护设备',
          content: '为确保节能效果长期稳定，建议制定定期维护计划，保持设备良好运行状态。',
          timestamp: '2024-01-15'
        }
      ]
    },
    // 智能推荐
    handleSmartRecommendation() {
      this.$message.info('智能推荐功能正在分析您的站点数据，请稍候...')
      
      // 模拟智能推荐
      setTimeout(() => {
        // 根据站点类型推荐策略
        const station = this.stationOptions.find(s => s.value === this.formData.station)
        let recommendedStrategies = []
        
        if (station.label.includes('南') || station.label.includes('北')) {
          // 大型车站推荐
          recommendedStrategies = ['lighting', 'airConditioning', 'renewableEnergy', 'smartControl']
        } else {
          // 中型车站推荐
          recommendedStrategies = ['lighting', 'airConditioning', 'ventilation', 'smartControl']
        }
        
        this.formData.selectedStrategies = recommendedStrategies
        this.$message.success('智能推荐完成，已为您选择最优节能策略组合')
      }, 1000)
    },
    // 重置
    handleReset() {
      this.formData = {
        station: 'BJ',
        dateRange: [new Date('2024-01-01'), new Date('2024-12-31')],
        selectedStrategies: ['lighting', 'airConditioning', 'smartControl'],
        selectedTemplate: '',
        strategyPriorities: ['lighting', 'airConditioning', 'ventilation', 'renewableEnergy', 'energyStorage', 'smartControl'],
        strategyParams: {
          lighting: {
            temperatureThreshold: 26,
            runtime: '08:00-22:00',
            powerLimit: 1000,
            感应控制: true,
            定时开关: true
          },
          airConditioning: {
            temperatureThreshold: 26,
            runtime: '08:00-22:00',
            powerLimit: 5000,
            变频调节: true,
            分区控制: true
          },
          ventilation: {
            co2Threshold: 1000,
            runtime: '08:00-22:00',
            powerLimit: 2000,
            按需通风: true
          },
          renewableEnergy: {
            solarCapacity: 1000,
            installationArea: 5000,
            powerLimit: 8000
          },
          energyStorage: {
            capacity: 5000,
            chargeTime: '23:00',
            dischargeTime: '08:00-12:00,18:00-22:00',
            powerLimit: 10000
          },
          smartControl: {
            aiOptimization: true,
            realTimeMonitoring: true,
            predictiveMaintenance: true
          }
        }
      }
      
      this.simulationResults = null
      this.strategyDetails = []
      this.recommendations = []
    },
    // 保存模拟结果
    saveSimulationResults() {
      this.saveToHistory()
    },
    // 保存到历史记录
    saveToHistory() {
      if (!this.simulationResults) return
      
      const record = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        station: this.formData.station,
        selectedStrategies: [...this.formData.selectedStrategies],
        expectedSavings: this.simulationResults.expectedSavings,
        savingsRate: this.simulationResults.savingsRate,
        expectedRevenue: this.simulationResults.expectedRevenue,
        paybackPeriod: this.simulationResults.paybackPeriod,
        strategyDetails: [...this.strategyDetails]
      }
      
      this.strategyHistory.unshift(record)
      localStorage.setItem('strategyHistory', JSON.stringify(this.strategyHistory))
      this.$message.success('模拟结果已保存到历史记录')
    },
    // 显示历史记录
    showHistory() {
      this.historyListDialogVisible = true
    },
    // 查看历史记录详情
    viewHistoryDetail(record) {
      this.currentHistoryRecord = record
      this.historyDetailDialogVisible = true
      this.historyListDialogVisible = false
    },
    // 删除历史记录
    deleteHistory(id) {
      this.$confirm('确定要删除该历史记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.strategyHistory = this.strategyHistory.filter(item => item.id !== id)
        localStorage.setItem('strategyHistory', JSON.stringify(this.strategyHistory))
        this.$message.success('历史记录删除成功')
      }).catch(() => {
        // 取消删除
      })
    },
    // 清空所有历史记录
    clearAllHistory() {
      this.$confirm('确定要清空所有历史记录吗？此操作不可恢复。', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.strategyHistory = []
        localStorage.setItem('strategyHistory', JSON.stringify(this.strategyHistory))
        this.$message.success('所有历史记录已清空')
      }).catch(() => {
        // 取消清空
      })
    }
  }
}
</script>

<style scoped>
.energy-strategy-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 24px;
}

.page-subtitle {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.strategy-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.strategy-content {
  padding: 20px 0;
}

.strategy-section {
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
}

.section-desc {
  margin: 0 0 15px 0;
  color: #606266;
  font-size: 14px;
}

.sortable-list-card {
  margin-top: 15px;
}

.sortable-list {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  background-color: #fff;
}

.sortable-item {
  margin-bottom: 10px;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  transition: all 0.3s;
}

.sortable-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.item-content {
  display: flex;
  align-items: center;
}

.drag-handle {
  cursor: move;
  color: #c0c4cc;
  margin-right: 10px;
  font-size: 16px;
  transition: color 0.3s;
}

.drag-handle:hover {
  color: #409eff;
}

.checkbox-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.checkbox-title {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 15px;
}

.checkbox-desc {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 13px;
}

.strategy-actions {
  margin-top: 20px;
  text-align: center;
}

.strategy-actions .el-button {
  margin: 0 10px;
}

.template-form .el-form-item {
  margin-bottom: 20px;
}

.strategy-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.template-list {
  max-height: 400px;
  overflow-y: auto;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.template-item:last-child {
  border-bottom: none;
}

.template-name {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 16px;
}

.template-description {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-actions {
  margin: 20px 0;
  text-align: center;
}

.history-actions .el-button {
  margin: 0 10px;
}

.results-container {
  margin-top: 20px;
}

.detail-metrics {
  margin-bottom: 20px;
}
</style>