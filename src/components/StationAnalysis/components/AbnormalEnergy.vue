<template>
  <div class="abnormal-energy-container">
    <h3 class="section-title">
      <i class="fa fa-exclamation-triangle"></i> 异常能耗检测
    </h3>
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="abnormalList"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="time" label="发生时间" width="180"></el-table-column>
        <el-table-column prop="area" label="区域" width="120"></el-table-column>
        <el-table-column prop="equipment" label="设备名称"></el-table-column>
        <el-table-column prop="actualEnergy" label="实际能耗(kWh)" width="120"></el-table-column>
        <el-table-column prop="predictedEnergy" label="预测能耗(kWh)" width="120"></el-table-column>
        <el-table-column prop="deviation" label="偏差率" width="100">
          <template slot-scope="scope">
            <el-tag :type="getDeviationType(scope.row.deviation)">
              {{ scope.row.deviation }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="异常等级" width="100">
          <template slot-scope="scope">
            <el-tag :type="getLevelType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              <i class="fa fa-search"></i> 查看详情
            </el-button>
            <el-button
              v-if="!scope.row.resolved"
              type="success"
              size="small"
              @click="handleMarkResolved(scope.row)"
            >
              <i class="fa fa-check"></i> 标记已处理
            </el-button>
            <el-tag v-else type="success" size="small">已处理</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 详情对话框 -->
    <el-dialog
      title="异常能耗详情"
      :visible.sync="dialogVisible"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="发生时间">{{ selectedItem.time }}</el-descriptions-item>
        <el-descriptions-item label="区域">{{ selectedItem.area }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ selectedItem.equipment }}</el-descriptions-item>
        <el-descriptions-item label="设备类型">{{ selectedItem.equipmentType }}</el-descriptions-item>
        <el-descriptions-item label="实际能耗">{{ selectedItem.actualEnergy }} kWh</el-descriptions-item>
        <el-descriptions-item label="预测能耗">{{ selectedItem.predictedEnergy }} kWh</el-descriptions-item>
        <el-descriptions-item label="偏差率">{{ selectedItem.deviation }}%</el-descriptions-item>
        <el-descriptions-item label="异常等级">{{ selectedItem.level }}</el-descriptions-item>
        <el-descriptions-item label="异常描述">{{ selectedItem.description }}</el-descriptions-item>
        <el-descriptions-item label="处理状态">
          <el-tag :type="selectedItem.resolved ? 'success' : 'danger'">
            {{ selectedItem.resolved ? '已处理' : '未处理' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AbnormalEnergy',
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      abnormalList: [],
      dialogVisible: false,
      selectedItem: null
    }
  },
  mounted() {
    this.fetchAbnormalData()
  },
  methods: {
    // 获取异常能耗数据
    fetchAbnormalData() {
      this.loading = true
      // 模拟API请求
      setTimeout(() => {
        this.abnormalList = this.generateAbnormalData()
        this.total = this.abnormalList.length
        this.loading = false
      }, 500)
    },

    // 生成模拟异常数据
    generateAbnormalData() {
      const areas = ['候车大厅', '售票厅', '办公区', '设备房', '停车场', '站台']
      const equipmentTypes = ['空调系统', '照明系统', '动力系统', '通风系统', '电梯系统']
      const levels = ['严重', '警告', '注意']
      const data = []

      for (let i = 0; i < 32; i++) {
        const predictedEnergy = Math.floor(Math.random() * 5000) + 1000
        const deviation = Math.floor(Math.random() * 40) + 5
        const actualEnergy = predictedEnergy * (1 + deviation / 100)
        const level = deviation > 25 ? '严重' : deviation > 15 ? '警告' : '注意'

        data.push({
          id: i + 1,
          time: this.generateRandomTime(),
          area: areas[Math.floor(Math.random() * areas.length)],
          equipment: `${equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]}设备${i + 1}`,
          equipmentType: equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
          actualEnergy: actualEnergy.toFixed(2),
          predictedEnergy: predictedEnergy.toFixed(2),
          deviation: deviation.toFixed(1),
          level: level,
          description: `${level}异常：${equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]}能耗超出预测值${deviation.toFixed(1)}%`,
          resolved: Math.random() > 0.6
        })
      }

      return data.sort((a, b) => new Date(b.time) - new Date(a.time))
    },

    // 生成随机时间
    generateRandomTime() {
      const now = new Date()
      const randomDays = Math.floor(Math.random() * 30)
      const randomHours = Math.floor(Math.random() * 24)
      const randomMinutes = Math.floor(Math.random() * 60)
      
      const date = new Date(now)
      date.setDate(date.getDate() - randomDays)
      date.setHours(randomHours, randomMinutes, 0, 0)
      
      return date.toLocaleString('zh-CN')
    },

    // 获取偏差率标签类型
    getDeviationType(deviation) {
      const dev = parseFloat(deviation)
      if (dev > 25) return 'danger'
      if (dev > 15) return 'warning'
      return 'info'
    },

    // 获取异常等级标签类型
    getLevelType(level) {
      if (level === '严重') return 'danger'
      if (level === '警告') return 'warning'
      if (level === '注意') return 'info'
      return ''
    },

    // 查看详情
    handleViewDetail(row) {
      this.selectedItem = { ...row }
      this.dialogVisible = true
    },

    // 标记已处理
    handleMarkResolved(row) {
      this.$confirm('确定要标记该异常为已处理吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        row.resolved = true
        this.$message({
          type: 'success',
          message: '标记成功'
        })
      }).catch(() => {
        // 取消操作
      })
    },

    // 分页处理
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
}
</script>

<style scoped>
.abnormal-energy-container {
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

.table-container {
  background-color: #fff;
}

.pagination-container {
  margin-top: 15px;
  text-align: right;
}

.dialog-footer {
  text-align: right;
}
</style>