<template>
  <div class="menu-management-container">
    <el-card class="menu-card">
      <template #header>
        <div class="card-header">
          <h3>菜单管理</h3>
          <el-button type="primary" size="small" @click="handleAddMenu">
            <i class="fa fa-plus"></i> 新增菜单
          </el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按菜单名称或路径搜索"
          clearable
          size="small"
          style="width: 260px"
        >
          <template #prefix>
            <i class="fa fa-search"></i>
          </template>
        </el-input>
      </div>
      
      <el-table :data="pagedMenus" stripe style="width: 100%" height="500">
        <el-table-column prop="id" label="菜单ID" width="80" />
        <el-table-column prop="menuName" label="菜单名称" width="150" />
        <el-table-column prop="menuPath" label="菜单路径" width="150" />
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="scope">
            <i :class="scope.row.icon" v-if="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="parentName" label="父菜单" width="120" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.status" @change="handleStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEditMenu(scope.row)">
              <i class="fa fa-pencil"></i> 编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteMenu(scope.row)">
              <i class="fa fa-trash"></i> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredMenus.length"
          :page-sizes="[10, 20, 50, 100]"
          v-model:page-size="pagination.pageSize"
          v-model:current-page="pagination.currentPage"
        />
      </div>
    </el-card>

    <!-- 新增/编辑菜单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="menuForm"
        :rules="menuRules"
        ref="menuFormRef"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径" prop="menuPath">
          <el-input v-model="menuForm.menuPath" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入FontAwesome图标类名，如fa-home" />
        </el-form-item>
        <el-form-item label="父菜单">
          <el-select v-model="menuForm.parentId" placeholder="请选择父菜单" style="width: 100%">
            <el-option label="无父菜单" value="0" />
            <el-option
              v-for="menu in parentMenuList"
              :key="menu.id"
              :label="menu.menuName"
              :value="menu.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="menuForm.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveMenu">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'MenuManagement',
  setup() {
    // 菜单列表
    const menuList = ref([])
    const menuFormRef = ref(null)
    const dialogVisible = ref(false)
    const dialogTitle = ref('新增菜单')
    const currentMenuId = ref(null)
    const searchKeyword = ref('')
    const pagination = reactive({
      currentPage: 1,
      pageSize: 10
    })

    // 菜单表单
    const menuForm = reactive({
      id: '',
      menuName: '',
      menuPath: '',
      icon: '',
      parentId: '0',
      sort: 0,
      status: true
    })

    // 菜单表单验证规则
    const menuRules = reactive({
      menuName: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
      ],
      menuPath: [
        { required: true, message: '请输入菜单路径', trigger: 'blur' },
        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
      ],
      sort: [
        { required: true, message: '请输入排序', trigger: 'blur' }
      ]
    })

    // 初始化菜单数据
    const initMenuData = () => {
      const storedMenus = localStorage.getItem('menuList')
      if (storedMenus) {
        menuList.value = JSON.parse(storedMenus)
      } else {
        // 初始化默认菜单数据
        const defaultMenus = [
          { id: 1, menuName: '系统管理', menuPath: '/system', icon: 'fa-cog', parentId: 0, sort: 1, status: true },
          { id: 2, menuName: '用户管理', menuPath: '/system/users', icon: 'fa-users', parentId: 1, sort: 1, status: true },
          { id: 3, menuName: '角色管理', menuPath: '/system/roles', icon: 'fa-user-secret', parentId: 1, sort: 2, status: true },
          { id: 4, menuName: '菜单管理', menuPath: '/system/menus', icon: 'fa-bars', parentId: 1, sort: 3, status: true },
          { id: 5, menuName: '系统设置', menuPath: '/system/settings', icon: 'fa-wrench', parentId: 1, sort: 4, status: true },
          { id: 6, menuName: '系统日志', menuPath: '/system/logs', icon: 'fa-file-text', parentId: 1, sort: 5, status: true },
          { id: 7, menuName: '首页', menuPath: '/home', icon: 'fa-home', parentId: 0, sort: 0, status: true },
          { id: 8, menuName: '设备管理', menuPath: '/device', icon: 'fa-desktop', parentId: 0, sort: 2, status: true },
          { id: 9, menuName: '能耗分析', menuPath: '/energy', icon: 'fa-line-chart', parentId: 0, sort: 3, status: true }
        ]
        menuList.value = defaultMenus
        localStorage.setItem('menuList', JSON.stringify(defaultMenus))
      }
    }

    // 保存菜单数据到LocalStorage
    const saveMenuData = () => {
      localStorage.setItem('menuList', JSON.stringify(menuList.value))
    }

    // 记录系统日志
    const addSystemLog = (title, content) => {
      const logs = localStorage.getItem('systemLogs')
      const logList = logs ? JSON.parse(logs) : []
      const newLog = {
        id: logList.length ? logList[0].id + 1 : 1,
        type: 'system',
        title,
        content,
        operator: 'system',
        ip: '127.0.0.1',
        userAgent: 'system',
        createTime: new Date().toISOString()
      }
      logList.unshift(newLog)
      if (logList.length > 1000) {
        logList.length = 1000
      }
      localStorage.setItem('systemLogs', JSON.stringify(logList))
    }

    // 获取父菜单列表
    const parentMenuList = computed(() => {
      return menuList.value.filter(menu => menu.id !== currentMenuId.value)
    })

    // 格式化菜单列表，添加父菜单名称
    const formattedMenuList = computed(() => {
      return menuList.value.map(menu => {
        const parentMenu = menuList.value.find(m => m.id === menu.parentId)
        return {
          ...menu,
          parentName: parentMenu ? parentMenu.menuName : '无'
        }
      })
    })

    // 过滤和分页
    const filteredMenus = computed(() => {
      if (!searchKeyword.value) return formattedMenuList.value
      const keyword = searchKeyword.value.toLowerCase()
      return formattedMenuList.value.filter(menu =>
        menu.menuName.toLowerCase().includes(keyword) ||
        menu.menuPath.toLowerCase().includes(keyword)
      )
    })

    const pagedMenus = computed(() => {
      const start = (pagination.currentPage - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      return filteredMenus.value.slice(start, end)
    })

    // 计算层级深度，限制不超过5级
    const getMenuDepth = (parentId, depth = 1) => {
      if (!parentId || parentId === '0' || parentId === 0) return depth
      const parent = menuList.value.find(m => m.id === parentId)
      if (!parent) return depth
      return getMenuDepth(parent.parentId, depth + 1)
    }

    // 打开新增菜单弹窗
    const handleAddMenu = () => {
      dialogTitle.value = '新增菜单'
      currentMenuId.value = null
      resetForm()
      dialogVisible.value = true
    }

    // 打开编辑菜单弹窗
    const handleEditMenu = (row) => {
      dialogTitle.value = '编辑菜单'
      currentMenuId.value = row.id
      // 复制菜单数据到表单
      Object.assign(menuForm, row)
      dialogVisible.value = true
    }

    // 删除菜单
    const handleDeleteMenu = (row) => {
      // 检查是否有子菜单
      const hasChildren = menuList.value.some(menu => menu.parentId === row.id)
      if (hasChildren) {
        ElMessage.warning('该菜单下有子菜单，不能删除')
        return
      }

      ElMessageBox.confirm('确定要删除该菜单吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = menuList.value.findIndex(menu => menu.id === row.id)
        if (index !== -1) {
          menuList.value.splice(index, 1)
          saveMenuData()
          ElMessage.success('删除成功')
          addSystemLog('菜单管理-删除', `删除菜单：${row.menuName}`)
        }
      }).catch(() => {
        // 用户取消删除
      })
    }

    // 保存菜单
    const handleSaveMenu = () => {
      menuFormRef.value.validate((valid) => {
        if (valid) {
          // 层级校验
          const depth = getMenuDepth(menuForm.parentId)
          if (depth > 5) {
            ElMessage.warning('菜单层级不能超过5级')
            return
          }

          if (currentMenuId.value) {
            // 编辑菜单
            const index = menuList.value.findIndex(menu => menu.id === currentMenuId.value)
            if (index !== -1) {
              menuList.value[index] = { ...menuForm }
              ElMessage.success('编辑成功')
              addSystemLog('菜单管理-编辑', `编辑菜单：${menuForm.menuName}`)
            }
          } else {
            // 新增菜单
            const newId = Math.max(...menuList.value.map(menu => menu.id), 0) + 1
            const newMenu = {
              ...menuForm,
              id: newId
            }
            menuList.value.push(newMenu)
            ElMessage.success('新增成功')
            addSystemLog('菜单管理-新增', `新增菜单：${newMenu.menuName}`)
          }
          saveMenuData()
          dialogVisible.value = false
        }
      })
    }

    // 切换菜单状态
    const handleStatusChange = (row) => {
      saveMenuData()
      ElMessage.success('状态更新成功')
      addSystemLog('菜单管理-状态变更', `菜单${row.menuName}状态更新为：${row.status ? '启用' : '禁用'}`)
    }

    // 重置表单
    const resetForm = () => {
      menuForm.id = ''
      menuForm.menuName = ''
      menuForm.menuPath = ''
      menuForm.icon = ''
      menuForm.parentId = '0'
      menuForm.sort = 0
      menuForm.status = true
      if (menuFormRef.value) {
        menuFormRef.value.resetFields()
      }
    }

    // 组件挂载时初始化
    onMounted(() => {
      initMenuData()
    })

    return {
      menuList,
      filteredMenus,
      pagedMenus,
      searchKeyword,
      pagination,
      menuForm,
      menuRules,
      menuFormRef,
      dialogVisible,
      dialogTitle,
      parentMenuList,
      handleAddMenu,
      handleEditMenu,
      handleDeleteMenu,
      handleSaveMenu,
      handleStatusChange
    }
  }
}
</script>

<style scoped>
.menu-management-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-card {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.pagination-container {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>