<template>
  <el-card shadow="never" class="filter-card">
    <el-form :inline="true" class="filter-form" label-position="top">
      <el-form-item label="站点选择">
        <el-select
          :model-value="selectedStation"
          @update:model-value="$emit('update:selectedStation', $event)"
          placeholder="请选择高铁站"
          clearable
          filterable
          size="small"
          :suffix-icon="LocationFilled"
        >
          <el-option
            v-for="station in stationList"
            :key="station.value"
            :label="station.label"
            :value="station.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="时间范围">
        <el-date-picker
          :model-value="dateRange"
          @update:model-value="$emit('update:dateRange', $event)"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          size="small"
          :editable="false"
          unlink-panels
          :shortcuts="dateShortcuts"
          :prefix-icon="Calendar"
        />
      </el-form-item>

      <el-form-item label="时间粒度">
        <el-select 
          :model-value="timeGranularity" 
          @update:model-value="handleTimeGranularityChange" 
          placeholder="选择时间粒度"
          size="small"
          clearable
          :suffix-icon="Timer"
        >
          <el-option label="小时" value="hour" />
          <el-option label="日" value="day" />
          <el-option label="周" value="week" />
          <el-option label="月" value="month" />
          <el-option label="年" value="year" />
        </el-select>
      </el-form-item>

      <el-form-item label=" ">
        <div class="filter-actions">
          <el-button type="primary" size="small" class="action-btn" @click="handleQuery">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="info" plain size="small" class="action-btn" @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { Calendar, LocationFilled, Timer, Search, Refresh } from '@element-plus/icons-vue'

export default {
  name: 'FilterBar',
  props: {
    stationList: {
      type: Array,
      default: () => []
    },
    selectedStation: {
      type: String,
      default: ''
    },
    dateRange: {
      type: Array,
      default: () => []
    },
    timeGranularity: {
      type: String,
      default: 'day'
    }
  },
  components: {
    Calendar,
    LocationFilled,
    Timer,
    Search,
    Refresh
  },
  methods: {
    handleTimeGranularityChange(value) {
      this.$emit('update:timeGranularity', value)
      this.$emit('timeGranularityChange', value)
    },
    handleQuery() {
      this.$emit('query')
    },
    handleReset() {
      this.$emit('reset')
    }
  },
  computed: {
    dateShortcuts() {
      return [
        {
          text: '近7天',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 6)
            return [start, end]
          }
        },
        {
          text: '近30天',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 29)
            return [start, end]
          }
        }
      ]
    }
  }
}
</script>

<style scoped>
.filter-card {
  margin-bottom: 20px;
  border: 1px solid #e5e6eb;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(31, 56, 88, 0.08);
  padding: 12px 16px 4px;
}

.filter-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 16px;
  align-items: end;
}

.filter-form :deep(.el-form-item__label) {
  font-size: 12px;
  color: #86909c;
  padding-bottom: 4px;
}

.filter-form :deep(.el-input__wrapper),
.filter-form :deep(.el-select .el-select__wrapper),
.filter-form :deep(.el-date-editor) {
  border-radius: 8px;
  border: 1px solid #e5e6eb;
  box-shadow: none;
  background: #f7f8fa;
  min-height: 36px;
}

.filter-form :deep(.el-input__inner),
.filter-form :deep(.el-select__selected-item),
.filter-form :deep(.el-range-input) {
  color: #1d2129;
}

.filter-form :deep(.el-input__wrapper.is-focus),
.filter-form :deep(.el-select .el-select__wrapper.is-focused),
.filter-form :deep(.el-date-editor.is-active) {
  border-color: #409eff;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.12);
  background: #fff;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  min-width: 84px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .filter-card {
    padding: 12px;
  }
}
</style>