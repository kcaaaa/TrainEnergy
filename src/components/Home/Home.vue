<template>
  <div class="home-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>首页数据展示</h2>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
        <el-button type="primary" @click="refreshData">
          <i class="fa fa-refresh"></i> 刷新数据
        </el-button>
      </div>
    </div>

    <!-- 核心指标展示 -->
    <div class="core-indicators">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card shadow="hover" class="indicator-card" @click="viewIndicatorDetail('总能耗')">
            <div class="indicator-content">
              <div class="indicator-icon energy">
                <i class="fa fa-bolt"></i>
              </div>
              <div class="indicator-info">
                <div class="indicator-label">总能耗</div>
                <div class="indicator-value">{{ coreIndicators.totalEnergy }} kWh</div>
                <div class="indicator-change">
                  <span :class="coreIndicators.totalEnergyChange > 0 ? 'increase' : 'decrease'">
                    <i class="fa" :class="coreIndicators.totalEnergyChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                    {{ Math.abs(coreIndicators.totalEnergyChange) }}%
                  </span>
                  <span class="change-text">较昨日</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card shadow="hover" class="indicator-card" @click="viewIndicatorDetail('总费用')">
            <div class="indicator-content">
              <div class="indicator-icon cost">
                <i class="fa fa-yen"></i>
              </div>
              <div class="indicator-info">
                <div class="indicator-label">总费用</div>
                <div class="indicator-value">¥{{ coreIndicators.totalCost }}</div>
                <div class="indicator-change">
                  <span :class="coreIndicators.totalCostChange > 0 ? 'increase' : 'decrease'">
                    <i class="fa" :class="coreIndicators.totalCostChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down'">
                    </i>
                    {{ Math.abs(coreIndicators.totalCostChange) }}%
                  </span>
                  <span class="change-text">较昨日</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card shadow="hover" class="indicator-card" @click="viewIndicatorDetail('能效指标')">
            <div class="indicator-content">
              <div class="indicator-icon efficiency">
                <i class="fa fa-line-chart"></i>
              </div>
              <div class="indicator-info">
                <div class="indicator-label">能效指标</div>
                <div class="indicator-value">{{ coreIndicators.efficiencyIndex }} kgce/人</div>
                <div class="indicator-change">
                  <span :class="coreIndicators.efficiencyIndexChange > 0 ? 'increase' : 'decrease'">
                    <i class="fa" :class="coreIndicators.efficiencyIndexChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down'">
                    </i>
                    {{ Math.abs(coreIndicators.efficiencyIndexChange) }}%
                  </span>
                  <span class="change-text">较昨日</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card shadow="hover" class="indicator-card" @click="viewIndicatorDetail('预警数量')">
            <div class="indicator-content">
              <div class="indicator-icon alert">
                <i class="fa fa-exclamation-triangle"></i>
              </div>
              <div class="indicator-info">
                <div class="indicator-label">预警数量</div>
                <div class="indicator-value">{{ coreIndicators.alertCount }}</div>
                <div class="indicator-change">
                  <span :class="coreIndicators.alertCountChange > 0 ? 'increase' : 'decrease'">
                    <i class="fa" :class="coreIndicators.alertCountChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down'">
                    </i>
                    {{ Math.abs(coreIndicators.alertCountChange) }}%
                  </span>
                  <span class="change-text">较昨日</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 能耗趋势图 -->
    <div class="energy-trend">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>能耗趋势图</span>
            <div class="header-actions">
              <el-select v-model="trendTimeRange" placeholder="选择时间范围" size="small">
                <el-option label="今日" value="today" />
                <el-option label="昨日" value="yesterday" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
              <el-button size="small" type="success" @click="exportEnergyTrendData">
                <i class="fa fa-download"></i> 导出Excel
              </el-button>
            </div>
          </div>
        </template>
        <div id="energyTrendChart" class="chart-container"></div>
      </el-card>
    </div>

    <!-- 区域能耗分析与设备能耗分析 -->
    <div class="analysis-section">
      <el-row :gutter="20">
        <!-- 区域能耗分析 -->
        <el-col :xs="24" :md="12" :lg="12" :xl="12">
          <el-card shadow="hover">
            <template #header>
          <div class="card-header">
            <span>区域能耗分析</span>
            <div class="header-actions">
              <el-button size="small" type="primary" @click="viewAreaDetail">
                <i class="fa fa-search"></i> 查看详情
              </el-button>
              <el-button size="small" type="success" @click="exportAreaEnergyData">
                <i class="fa fa-download"></i> 导出Excel
              </el-button>
            </div>
          </div>
        </template>
        <div id="areaEnergyChart" class="chart-container"></div>
          </el-card>
        </el-col>

        <!-- 设备能耗分析 -->
        <el-col :xs="24" :md="12" :lg="12" :xl="12">
          <el-card shadow="hover">
            <template #header>
          <div class="card-header">
            <span>设备能耗分析</span>
            <div class="header-actions">
              <el-button size="small" type="primary" @click="viewDeviceDetail">
                <i class="fa fa-search"></i> 查看详情
              </el-button>
              <el-button size="small" type="success" @click="exportDeviceEnergyData">
                <i class="fa fa-download"></i> 导出Excel
              </el-button>
            </div>
          </div>
        </template>
        <div id="deviceEnergyChart" class="chart-container"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 能耗结构分析与时段能耗分析 -->
    <div class="analysis-section">
      <el-row :gutter="20">
        <!-- 能耗结构分析 -->
        <el-col :xs="24" :md="12" :lg="12" :xl="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>能耗结构分析</span>
                <div class="header-actions">
                  <el-button size="small" type="primary" @click="viewEnergyStructureDetail">
                    <i class="fa fa-search"></i> 查看详情
                  </el-button>
                  <el-button size="small" type="success" @click="exportEnergyStructureData">
                    <i class="fa fa-download"></i> 导出Excel
                  </el-button>
                </div>
              </div>
            </template>
            <div id="energyStructureChart" class="chart-container"></div>
          </el-card>
        </el-col>

        <!-- 时段能耗分析 -->
        <el-col :xs="24" :md="12" :lg="12" :xl="12">
          <el-card shadow="hover">
            <template #header>
          <div class="card-header">
            <span>时段能耗分析</span>
            <el-button size="small" type="success" @click="exportTimeEnergyData">
              <i class="fa fa-download"></i> 导出Excel
            </el-button>
          </div>
        </template>
        <div id="timeEnergyChart" class="chart-container"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 能耗预警记录 -->
    <div class="alert-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>能耗预警记录</span>
            <div class="header-actions">
              <el-button size="small" type="primary" @click="viewAllAlerts">
                <i class="fa fa-list"></i> 查看全部
              </el-button>
              <el-button size="small" type="success" @click="exportAlertData">
                <i class="fa fa-download"></i> 导出Excel
              </el-button>
            </div>
          </div>
        </template>
        <div class="alert-table">
          <el-table :data="alertRecords" stripe style="width: 100%">
            <el-table-column prop="time" label="预警时间" width="150" />
            <el-table-column prop="station" label="高铁站" width="120" />
            <el-table-column prop="area" label="区域" width="100" />
            <el-table-column prop="type" label="预警类型" width="120">
              <template #default="scope">
                <el-tag :type="getAlertTypeTag(scope.row.type)">
                  {{ scope.row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="预警描述" />
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="scope">
                <el-button type="text" size="small" @click="handleAlert(scope.row)">
                  <i class="fa fa-eye"></i> 处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>

    <!-- 能耗预警详情弹窗 -->
    <el-dialog
      v-model="alertDetailVisible"
      title="能耗预警详情"
      width="600px"
      :before-close="handleDialogClose"
    >
      <div v-if="currentAlert" class="alert-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="预警时间">{{ currentAlert.time }}</el-descriptions-item>
          <el-descriptions-item label="高铁站">{{ currentAlert.station }}</el-descriptions-item>
          <el-descriptions-item label="区域">{{ currentAlert.area }}</el-descriptions-item>
          <el-descriptions-item label="预警类型">
            <el-tag :type="getAlertTypeTag(currentAlert.type)">{{ currentAlert.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="预警描述">{{ currentAlert.description }}</el-descriptions-item>
          <el-descriptions-item label="预警状态">
            <el-tag :type="currentAlert.status === '已处理' ? 'success' : 'warning'">
              {{ currentAlert.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="能耗值">{{ currentAlert.energyValue || 'N/A' }} kWh</el-descriptions-item>
          <el-descriptions-item label="阈值">{{ currentAlert.threshold || 'N/A' }} kWh</el-descriptions-item>
          <el-descriptions-item label="超出比例" v-if="currentAlert.exceedRatio">
            <el-tag type="danger">{{ currentAlert.exceedRatio }}%</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="设备名称" v-if="currentAlert.deviceName">{{ currentAlert.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="设备ID" v-if="currentAlert.deviceId">{{ currentAlert.deviceId }}</el-descriptions-item>
        </el-descriptions>
        
        <div v-if="currentAlert.status === '未处理'" class="alert-handle">
          <h4>预警处理</h4>
          <el-form :model="alertHandleForm" label-width="80px">
            <el-form-item label="处理方式">
              <el-select v-model="alertHandleForm.handleType" placeholder="请选择处理方式" style="width: 100%">
                <el-option label="调整设备参数" value="adjust" />
                <el-option label="设备检修" value="maintain" />
                <el-option label="正常波动" value="normal" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
            <el-form-item label="处理备注">
              <el-input
                v-model="alertHandleForm.remark"
                type="textarea"
                :rows="4"
                placeholder="请输入处理备注"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        
        <div v-else class="alert-handle-record">
          <h4>处理记录</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="处理时间">{{ currentAlert.handleTime || 'N/A' }}</el-descriptions-item>
            <el-descriptions-item label="处理人">{{ currentAlert.handler || 'N/A' }}</el-descriptions-item>
            <el-descriptions-item label="处理方式">{{ currentAlert.handleType || 'N/A' }}</el-descriptions-item>
            <el-descriptions-item label="处理备注">{{ currentAlert.remark || 'N/A' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleDialogClose">关闭</el-button>
          <el-button
            type="primary"
            v-if="currentAlert && currentAlert.status === '未处理'"
            @click="submitAlertHandle"
          >
            确认处理
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    const dateRange = ref([])
    const trendTimeRange = ref('today')
    let energyTrendChart = null
    let areaEnergyChart = null
    let deviceEnergyChart = null
    let timeEnergyChart = null
    let energyStructureChart = null

    // 核心指标数据
    const coreIndicators = reactive({
      totalEnergy: 12543.6,
      totalEnergyChange: -2.3,
      totalCost: 8960.5,
      totalCostChange: -1.8,
      efficiencyIndex: 12.5,
      efficiencyIndexChange: -0.5,
      alertCount: 12,
      alertCountChange: 15.4
    })

    // 预警记录数据
    const alertRecords = reactive([
      {
        time: '2024-01-15 08:30',
        station: '北京南站',
        area: '候车厅',
        type: '超耗预警',
        description: '候车厅照明能耗超出阈值15%',
        status: '未处理',
        energyValue: 1875.5,
        threshold: 1630.9,
        exceedRatio: 15,
        deviceName: 'LED照明系统',
        deviceId: 'LIGHT-BJS-001'
      },
      {
        time: '2024-01-15 09:15',
        station: '上海虹桥站',
        area: '空调系统',
        type: '异常能耗',
        description: '空调系统能耗异常波动',
        status: '未处理',
        energyValue: 3245.2,
        threshold: 2800.0,
        exceedRatio: 15.9,
        deviceName: '中央空调主机',
        deviceId: 'AC-SHH-002'
      },
      {
        time: '2024-01-15 10:45',
        station: '广州南站',
        area: '电梯系统',
        type: '超耗预警',
        description: '电梯系统能耗超出阈值20%',
        status: '未处理',
        energyValue: 1120.0,
        threshold: 933.3,
        exceedRatio: 20,
        deviceName: '高速电梯群',
        deviceId: 'ELEVATOR-GZN-005'
      },
      {
        time: '2024-01-15 11:20',
        station: '深圳北站',
        area: '照明系统',
        type: '异常能耗',
        description: '照明系统能耗异常增高',
        status: '未处理',
        energyValue: 1560.8,
        threshold: 1300.7,
        exceedRatio: 20,
        deviceName: '应急照明系统',
        deviceId: 'LIGHT-SZN-007'
      },
      {
        time: '2024-01-15 14:30',
        station: '杭州东站',
        area: '空调系统',
        type: '超耗预警',
        description: '空调系统能耗超出阈值18%',
        status: '未处理',
        energyValue: 2950.0,
        threshold: 2500.0,
        exceedRatio: 18,
        deviceName: '中央空调末端',
        deviceId: 'AC-HZD-003'
      }
    ])

    // 能耗预警详情弹窗
    const alertDetailVisible = ref(false)
    const currentAlert = ref(null)
    const alertHandleForm = reactive({
      handleType: '',
      remark: ''
    })

    // 重置预警处理表单
    const resetAlertHandleForm = () => {
      alertHandleForm.handleType = ''
      alertHandleForm.remark = ''
    }

    // 初始化能耗趋势图
    const initEnergyTrendChart = () => {
      const chartDom = document.getElementById('energyTrendChart')
      energyTrendChart = echarts.init(chartDom)

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
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '能耗 (kWh)',
            min: 0,
            max: 1500
          }
        ],
        series: [
          {
            name: '实际能耗',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#409EFF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320, 1450, 1330, 1220, 1020, 930]
          },
          {
            name: '预测能耗',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 2,
              type: 'dashed',
              color: '#909399'
            },
            emphasis: {
              focus: 'series'
            },
            data: [800, 900, 850, 950, 1250, 1300, 1350, 1400, 1350, 1200, 1050, 950]
          }
        ]
      }

      energyTrendChart.setOption(option)
    }

    // 初始化区域能耗分析图
    const initAreaEnergyChart = () => {
      const chartDom = document.getElementById('areaEnergyChart')
      areaEnergyChart = echarts.init(chartDom)

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} kWh ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center'
        },
        series: [
          {
            name: '区域能耗',
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
              { value: 3500, name: '候车厅' },
              { value: 2800, name: '站台' },
              { value: 2200, name: '办公区' },
              { value: 1800, name: '设备间' },
              { value: 1500, name: '其他区域' }
            ]
          }
        ]
      }

      areaEnergyChart.setOption(option)
    }

    // 初始化设备能耗分析图
    const initDeviceEnergyChart = () => {
      const chartDom = document.getElementById('deviceEnergyChart')
      deviceEnergyChart = echarts.init(chartDom)

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
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['空调系统', '照明系统', '电梯系统', '通风系统', '给排水系统', '其他设备']
        },
        series: [
          {
            name: '能耗 (kWh)',
            type: 'bar',
            data: [4200, 3500, 1800, 1200, 800, 1043],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#409EFF' },
                { offset: 1, color: '#67C23A' }
              ])
            }
          }
        ]
      }

      deviceEnergyChart.setOption(option)
    }

    // 初始化时段能耗分析图
    const initTimeEnergyChart = () => {
      const chartDom = document.getElementById('timeEnergyChart')
      timeEnergyChart = echarts.init(chartDom)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['能耗值'],
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['早高峰', '上午', '下午', '晚高峰', '夜间']
        },
        yAxis: {
          type: 'value',
          name: '能耗 (kWh)'
        },
        series: [
          {
            name: '能耗值',
            type: 'bar',
            data: [3200, 2800, 2500, 3000, 1000],
            itemStyle: {
              color: function(params) {
                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
                return colors[params.dataIndex]
              }
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      }

      timeEnergyChart.setOption(option)
    }

    // 初始化能耗结构分析图
    const initEnergyStructureChart = () => {
      const chartDom = document.getElementById('energyStructureChart')
      energyStructureChart = echarts.init(chartDom)

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} kWh ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '能耗结构',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['35%', '50%'],
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
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 7526.16, name: '电力' },
              { value: 2508.72, name: '天然气' },
              { value: 1505.23, name: '水' },
              { value: 1003.49, name: '其他能源' }
            ]
          }
        ]
      }

      energyStructureChart.setOption(option)
    }

    // 获取预警类型标签颜色
    const getAlertTypeTag = (type) => {
      const typeMap = {
        '超耗预警': 'warning',
        '异常能耗': 'danger',
        '效率低下': 'info'
      }
      return typeMap[type] || 'default'
    }

    // 刷新数据
    const refreshData = () => {
      // 模拟刷新数据
      console.log('刷新数据')
      // 这里可以添加实际的数据刷新逻辑
    }

    // 查看区域详情
    const viewAreaDetail = () => {
      router.push('/station-analysis')
    }

    // 查看设备详情
    const viewDeviceDetail = () => {
      router.push('/energy-ratio')
    }

    // 查看全部预警
    const viewAllAlerts = () => {
      router.push('/energy-alert')
    }

    // 处理预警
    const handleAlert = (row) => {
      currentAlert.value = {...row}
      alertDetailVisible.value = true
      resetAlertHandleForm()
    }

    // 关闭预警详情弹窗
    const handleDialogClose = () => {
      alertDetailVisible.value = false
      resetAlertHandleForm()
      setTimeout(() => {
        currentAlert.value = null
      }, 300)
    }

    // 提交预警处理
    const submitAlertHandle = () => {
      if (!alertHandleForm.handleType) {
        ElMessage.error('请选择处理方式')
        return
      }
      
      // 模拟处理预警
      const alertIndex = alertRecords.findIndex(item => 
        item.time === currentAlert.value.time && 
        item.station === currentAlert.value.station
      )
      
      if (alertIndex !== -1) {
        // 更新预警记录
        alertRecords[alertIndex].status = '已处理'
        alertRecords[alertIndex].handleTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
        alertRecords[alertIndex].handler = '系统管理员'
        alertRecords[alertIndex].handleType = alertHandleForm.handleType
        alertRecords[alertIndex].remark = alertHandleForm.remark
        
        // 更新当前预警
        currentAlert.value = {...alertRecords[alertIndex]}
        
        ElMessage.success('预警处理成功')
        handleDialogClose()
      }
    }

    // 导出能耗趋势图数据到Excel
    const exportEnergyTrendData = () => {
      // 获取图表数据
      const option = energyTrendChart.getOption()
      const xAxisData = option.xAxis[0].data
      const series = option.series
      
      // 准备Excel数据
      const excelData = []
      const header = ['时间'].concat(series.map(item => item.name))
      excelData.push(header)
      
      // 填充数据行
      xAxisData.forEach((time, index) => {
        const row = [time]
        series.forEach(item => {
          row.push(item.data[index])
        })
        excelData.push(row)
      })
      
      // 创建工作簿和工作表
      const worksheet = XLSX.utils.aoa_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '能耗趋势数据')
      
      // 导出Excel文件
      XLSX.writeFile(workbook, `能耗趋势数据_${new Date().toISOString().slice(0,10)}.xlsx`)
      ElMessage.success('能耗趋势数据导出成功')
    }

    // 导出区域能耗分析数据到Excel
    const exportAreaEnergyData = () => {
      // 获取图表数据
      const option = areaEnergyChart.getOption()
      const seriesData = option.series[0].data
      
      // 准备Excel数据
      const excelData = [['区域名称', '能耗值(kWh)', '占比(%)']]
      seriesData.forEach(item => {
        // 计算百分比
        const total = seriesData.reduce((sum, current) => sum + current.value, 0)
        const percentage = ((item.value / total) * 100).toFixed(2)
        excelData.push([item.name, item.value, percentage])
      })
      
      // 创建工作簿和工作表
      const worksheet = XLSX.utils.aoa_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '区域能耗分析')
      
      // 导出Excel文件
      XLSX.writeFile(workbook, `区域能耗分析_${new Date().toISOString().slice(0,10)}.xlsx`)
      ElMessage.success('区域能耗分析数据导出成功')
    }

    // 导出设备能耗分析数据到Excel
    const exportDeviceEnergyData = () => {
      // 获取图表数据
      const option = deviceEnergyChart.getOption()
      const yAxisData = option.yAxis[0].data
      const seriesData = option.series[0].data
      
      // 准备Excel数据
      const excelData = [['设备名称', '能耗值(kWh)']]
      yAxisData.forEach((name, index) => {
        excelData.push([name, seriesData[index]])
      })
      
      // 创建工作簿和工作表
      const worksheet = XLSX.utils.aoa_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '设备能耗分析')
      
      // 导出Excel文件
      XLSX.writeFile(workbook, `设备能耗分析_${new Date().toISOString().slice(0,10)}.xlsx`)
      ElMessage.success('设备能耗分析数据导出成功')
    }

    // 导出时段能耗分析数据到Excel
    const exportTimeEnergyData = () => {
      // 获取图表数据
      const option = timeEnergyChart.getOption()
      const xAxisData = option.xAxis[0].data
      const seriesData = option.series[0].data
      
      // 准备Excel数据
      const excelData = [['时段', '能耗值(kWh)']]
      xAxisData.forEach((time, index) => {
        excelData.push([time, seriesData[index]])
      })
      
      // 创建工作簿和工作表
      const worksheet = XLSX.utils.aoa_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '时段能耗分析')
      
      // 导出Excel文件
      XLSX.writeFile(workbook, `时段能耗分析_${new Date().toISOString().slice(0,10)}.xlsx`)
      ElMessage.success('时段能耗分析数据导出成功')
    }

    // 导出能耗预警记录数据到Excel
    const exportAlertData = () => {
      // 准备Excel数据
      const excelData = [['预警时间', '高铁站', '区域', '预警类型', '预警描述', '状态']]
      alertRecords.forEach(record => {
        excelData.push([
          record.time,
          record.station,
          record.area,
          record.type,
          record.description,
          record.status
        ])
      })
      
      // 创建工作簿和工作表
      const worksheet = XLSX.utils.aoa_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '能耗预警记录')
      
      // 导出Excel文件
      XLSX.writeFile(workbook, `能耗预警记录_${new Date().toISOString().slice(0,10)}.xlsx`)
      ElMessage.success('能耗预警记录导出成功')
    }

    // 导出能耗结构分析数据到Excel
    const exportEnergyStructureData = () => {
      // 获取图表数据
      const option = energyStructureChart.getOption()
      const seriesData = option.series[0].data
      
      // 准备Excel数据
      const excelData = [['能源类型', '能耗值(kWh)', '占比(%)']]
      seriesData.forEach(item => {
        // 计算百分比
        const total = seriesData.reduce((sum, current) => sum + current.value, 0)
        const percentage = ((item.value / total) * 100).toFixed(2)
        excelData.push([item.name, item.value, percentage])
      })
      
      // 创建工作簿和工作表
      const worksheet = XLSX.utils.aoa_to_sheet(excelData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '能耗结构分析')
      
      // 导出Excel文件
      XLSX.writeFile(workbook, `能耗结构分析_${new Date().toISOString().slice(0,10)}.xlsx`)
      ElMessage.success('能耗结构分析数据导出成功')
    }

    // 查看能耗结构详情
    const viewEnergyStructureDetail = () => {
      router.push('/energy-structure')
    }

    // 查看核心指标详情
    const viewIndicatorDetail = (indicator) => {
      console.log('查看指标详情:', indicator)
      ElMessage.info(`${indicator}详情功能正在开发中`)
    }

    // 响应式处理
    const handleResize = () => {
      energyTrendChart && energyTrendChart.resize()
      areaEnergyChart && areaEnergyChart.resize()
      deviceEnergyChart && deviceEnergyChart.resize()
      timeEnergyChart && timeEnergyChart.resize()
      energyStructureChart && energyStructureChart.resize()
    }

    // 生命周期钩子
    onMounted(() => {
      initEnergyTrendChart()
      initAreaEnergyChart()
      initDeviceEnergyChart()
      initTimeEnergyChart()
      initEnergyStructureChart()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      energyTrendChart && energyTrendChart.dispose()
      areaEnergyChart && areaEnergyChart.dispose()
      deviceEnergyChart && deviceEnergyChart.dispose()
      timeEnergyChart && timeEnergyChart.dispose()
      energyStructureChart && energyStructureChart.dispose()
    })

    return {
      dateRange,
      trendTimeRange,
      coreIndicators,
      alertRecords,
      refreshData,
      viewAreaDetail,
      viewDeviceDetail,
      viewAllAlerts,
      handleAlert,
      getAlertTypeTag,
      exportEnergyTrendData,
      exportAreaEnergyData,
      exportDeviceEnergyData,
      exportTimeEnergyData,
      exportAlertData,
      viewIndicatorDetail
    }
  }
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.core-indicators {
  margin-bottom: 20px;
}

.indicator-card {
  height: 100%;
}

.indicator-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.indicator-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
  margin-right: 15px;
}

.indicator-icon.energy {
  background-color: #409EFF;
}

.indicator-icon.cost {
  background-color: #67C23A;
}

.indicator-icon.efficiency {
  background-color: #E6A23C;
}

.indicator-icon.alert {
  background-color: #F56C6C;
}

.indicator-info {
  flex: 1;
}

.indicator-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.indicator-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.indicator-change {
  display: flex;
  align-items: center;
  gap: 5px;
}

.indicator-change .increase {
  color: #F56C6C;
}

.indicator-change .decrease {
  color: #67C23A;
}

.change-text {
  font-size: 12px;
  color: #909399;
}

.energy-trend {
  margin-bottom: 20px;
}

.analysis-section {
  margin-bottom: 20px;
}

.chart-container {
  height: 350px;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-table {
  max-height: 350px;
  overflow-y: auto;
}

.bottom-section {
  margin-bottom: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .indicator-content {
    flex-direction: column;
    text-align: center;
  }

  .indicator-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style>