<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="600px"
    center
  >
    <div class="param-config-dialog">
      <el-form :model="formData" label-width="80px" size="small">
        <!-- 通用参数 -->
        <el-divider>通用参数</el-divider>
        <el-form-item label="目标温度(°C)">
          <el-input-number v-model="formData.targetTemp" :min="16" :max="28" :step="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="通风时长(h/d)">
          <el-input-number v-model="formData.ventilationTime" :min="0" :max="24" :step="0.5" style="width: 100%" />
        </el-form-item>
        <el-form-item label="照明时长(h/d)">
          <el-input-number v-model="formData.lightingTime" :min="0" :max="24" :step="0.5" style="width: 100%" />
        </el-form-item>
        
        <!-- 特殊参数：根据选择的策略显示不同参数 -->
        <el-divider>{{ selectedStrategy.name }}参数</el-divider>
        
        <!-- 策略1: 智能温控策略 -->
        <template v-if="selectedStrategy.id === 1">
          <el-form-item label="温度梯度(°C)">
            <el-input-number v-model="formData.tempGradient" :min="0.5" :max="3" :step="0.5" style="width: 100%" />
          </el-form-item>
          <el-form-item label="传感器密度(个/㎡)">
            <el-input-number v-model="formData.sensorDensity" :min="0.1" :max="1" :step="0.1" style="width: 100%" />
          </el-form-item>
        </template>
        
        <!-- 策略2: 智能通风策略 -->
        <template v-else-if="selectedStrategy.id === 2">
          <el-form-item label="CO₂阈值(ppm)">
            <el-input-number v-model="formData.co2Threshold" :min="800" :max="2000" :step="100" style="width: 100%" />
          </el-form-item>
          <el-form-item label="新风比(%)">
            <el-input-number v-model="formData.freshAirRatio" :min="10" :max="50" :step="5" style="width: 100%" />
          </el-form-item>
        </template>
        
        <!-- 策略3: 智能照明策略 -->
        <template v-else-if="selectedStrategy.id === 3">
          <el-form-item label="光照阈值(lux)">
            <el-input-number v-model="formData.lightThreshold" :min="100" :max="1000" :step="50" style="width: 100%" />
          </el-form-item>
          <el-form-item label="调光系数">
            <el-input-number v-model="formData.dimmingCoeff" :min="0.3" :max="1" :step="0.1" style="width: 100%" />
          </el-form-item>
        </template>
        
        <!-- 策略4: 综合节能策略 -->
        <template v-else-if="selectedStrategy.id === 4">
          <el-form-item label="温度梯度(°C)">
            <el-input-number v-model="formData.tempGradient" :min="0.5" :max="3" :step="0.5" style="width: 100%" />
          </el-form-item>
          <el-form-item label="CO₂阈值(ppm)">
            <el-input-number v-model="formData.co2Threshold" :min="800" :max="2000" :step="100" style="width: 100%" />
          </el-form-item>
          <el-form-item label="光照阈值(lux)">
            <el-input-number v-model="formData.lightThreshold" :min="100" :max="1000" :step="50" style="width: 100%" />
          </el-form-item>
        </template>
        
        <!-- 策略5: 可再生能源策略 -->
        <template v-else-if="selectedStrategy.id === 5">
          <el-form-item label="光伏安装面积(㎡)">
            <el-input-number v-model="formData.solarArea" :min="0" :max="10000" :step="100" style="width: 100%" />
          </el-form-item>
          <el-form-item label="储能容量(kWh)">
            <el-input-number v-model="formData.storageCapacity" :min="0" :max="5000" :step="100" style="width: 100%" />
          </el-form-item>
        </template>
        
        <!-- 策略6: 设备优化策略 -->
        <template v-else-if="selectedStrategy.id === 6">
          <el-form-item label="设备更新比例(%)">
            <el-input-number v-model="formData.equipmentRatio" :min="0" :max="100" :step="5" style="width: 100%" />
          </el-form-item>
          <el-form-item label="优化优先级">
            <el-select v-model="formData.priority" style="width: 100%">
              <el-option label="节能效果" value="energy" />
              <el-option label="投资回报" value="return" />
              <el-option label="维护成本" value="maintenance" />
            </el-select>
          </el-form-item>
        </template>
        
        <!-- 策略7: 行为节能策略 -->
        <template v-else-if="selectedStrategy.id === 7">
          <el-form-item label="员工参与度(%)">
            <el-input-number v-model="formData.participationRate" :min="0" :max="100" :step="5" style="width: 100%" />
          </el-form-item>
          <el-form-item label="激励系数">
            <el-input-number v-model="formData.incentiveCoeff" :min="0.1" :max="2" :step="0.1" style="width: 100%" />
          </el-form-item>
        </template>
      </el-form>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ParamConfigDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    strategy: {
      type: Object,
      default: () => ({})
    },
    configData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        targetTemp: 24,
        ventilationTime: 12,
        lightingTime: 16,
        tempGradient: 1,
        sensorDensity: 0.5,
        co2Threshold: 1000,
        freshAirRatio: 20,
        lightThreshold: 300,
        dimmingCoeff: 0.5,
        solarArea: 500,
        storageCapacity: 1000,
        equipmentRatio: 50,
        priority: 'energy',
        participationRate: 70,
        incentiveCoeff: 1
      }
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
    dialogTitle() {
      return `${this.strategy.name || '策略'}参数配置`
    },
    selectedStrategy() {
      return this.strategy
    }
  },
  watch: {
    configData: {
      handler(newVal) {
        if (newVal) {
          this.formData = { ...this.formData, ...newVal }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.formData)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
.param-config-dialog {
  max-height: 500px;
  overflow-y: auto;
}
</style>