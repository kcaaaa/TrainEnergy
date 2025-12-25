<template>
  <!-- 模板管理弹窗 -->
  <el-dialog
    :title="isEditingTemplate ? '编辑策略模板' : '创建策略模板'"
    :visible.sync="templateDialogVisible"
    width="50%"
  >
    <el-form :model="templateForm" label-width="120px">
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
          <el-checkbox
            v-for="strategy in strategyList"
            :key="strategy.key"
            :label="strategy.key"
          >
            {{ strategy.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="templateDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveTemplate">保存</el-button>
    </span>
  </el-dialog>
  
  <!-- 模板列表弹窗 -->
  <el-dialog
    title="策略模板列表"
    :visible.sync="templateListDialogVisible"
    width="60%"
  >
    <el-table :data="strategyTemplates" style="width: 100%">
      <el-table-column prop="name" label="模板名称" width="200" />
      <el-table-column prop="description" label="模板描述" />
      <el-table-column prop="strategies" label="包含策略" width="250">
        <template slot-scope="scope">
          <span v-for="(strategyKey, index) in scope.row.strategies" :key="strategyKey">
            {{ getStrategyName(strategyKey) }}
            <span v-if="index < scope.row.strategies.length - 1">, </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" @click="applyTemplate(scope.row)">应用</el-button>
          <el-button size="small" type="primary" @click="editTemplate(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteTemplate(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="templateListDialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'StrategyTemplateManager',
  props: {
    strategyList: {
      type: Array,
      required: true
    },
    strategyTemplates: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 模板管理弹窗
      templateDialogVisible: false,
      templateListDialogVisible: false,
      templateForm: {
        name: '',
        description: '',
        strategies: [],
        params: {}
      },
      isEditingTemplate: false,
      currentTemplateId: ''
    }
  },
  methods: {
    // 打开模板管理
    handleTemplateManage() {
      this.templateListDialogVisible = true
    },
    // 创建新模板
    createTemplate() {
      this.resetTemplateForm()
      this.isEditingTemplate = false
      this.templateDialogVisible = true
    },
    // 编辑模板
    editTemplate(template) {
      this.templateForm = {
        ...template
      }
      this.isEditingTemplate = true
      this.currentTemplateId = template.id
      this.templateDialogVisible = true
    },
    // 删除模板
    deleteTemplate(templateId) {
      this.$confirm('确定要删除该模板吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('delete-template', templateId)
        this.$message.success('模板删除成功')
      }).catch(() => {
        // 用户取消删除
      })
    },
    // 应用模板
    applyTemplate(template) {
      this.$emit('apply-template', template)
      this.templateListDialogVisible = false
      this.$message.success('模板应用成功')
    },
    // 保存模板
    saveTemplate() {
      if (!this.templateForm.name) {
        this.$message.error('请输入模板名称')
        return
      }
      
      if (this.isEditingTemplate) {
        // 编辑现有模板
        this.$emit('update-template', {
          ...this.templateForm,
          id: this.currentTemplateId
        })
        this.$message.success('模板更新成功')
      } else {
        // 创建新模板
        const newTemplate = {
          ...this.templateForm,
          id: `template-${Date.now()}`
        }
        this.$emit('create-template', newTemplate)
        this.$message.success('模板创建成功')
      }
      
      this.templateDialogVisible = false
      this.resetTemplateForm()
    },
    // 重置模板表单
    resetTemplateForm() {
      this.templateForm = {
        name: '',
        description: '',
        strategies: [],
        params: {}
      }
      this.isEditingTemplate = false
      this.currentTemplateId = ''
    },
    // 获取策略名称
    getStrategyName(strategyKey) {
      const strategy = this.strategyList.find(s => s.key === strategyKey)
      return strategy ? strategy.name : strategyKey
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>