<template>
  <el-card class="table-card" shadow="never">
    <template #header>
      <h1 class="page-title">实习管理</h1>
    </template>
    <CommonTable
      :columns="tableColumns"
      :data="formattedTableData"
      :loading="loading"
      @filter-change="handleFilterChange"
      @search-change="handleSearchChange"
      @sort-change="handleSortChange"
    >
      <!-- 项目名称列，如果有原始链接则显示为链接 -->
      <template #projectName="{ row }">
        <a
          v-if="row.originalUrl"
          :href="row.originalUrl"
          target="_blank"
          class="project-link"
        >
          {{ row.projectName }}
        </a>
        <span v-else>{{ row.projectName }}</span>
      </template>
    </CommonTable>

    <!-- 分页器 -->
    <div class="pagination-container">
      <span class="page-info">共 {{ total }} 条记录</span>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CommonTable from '@/components/CommonTable.vue'
import { ElMessage } from 'element-plus'
import { getInternships, type Internship } from '@/api/internship'

// 格式化日期函数
const formatDate = (dateString: string | null) => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-')
}

// 表格列配置
const tableColumns = [
  {
    prop: 'projectName',
    label: '项目名称',
    minWidth: 200,
    searchable: true
  },
  {
    prop: 'claimant',
    label: '认领人',
    width: 120,
    searchable: true
  },
  {
    prop: 'mentor',
    label: '导师',
    width: 120
  },
  {
    prop: 'mentorEmail',
    label: '导师邮箱',
    width: 180
  },
  {
    prop: 'belongingSig',
    label: '所属SIG',
    width: 150,
    filterable: true,
    filterOptions: [
      { label: 'Kernel', value: 'Kernel' },
      { label: 'Networking', value: 'Networking' },
      { label: 'Storage', value: 'Storage' },
      { label: 'Virtualization', value: 'Virtualization' },
      { label: 'Cloud Native', value: 'Cloud Native' }
    ]
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    filterable: true,
    filterOptions: [
      { label: '进行中', value: '进行中' },
      { label: '已完成', value: '已完成' },
      { label: '已关闭', value: '已关闭' },
      { label: '待认领', value: '待认领' }
    ]
  },
  {
    prop: 'score',
    label: '评分',
    width: 100,
    sortable: true
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    width: 120,
    sortable: true
  },
  {
    prop: 'expectedCompletionTime',
    label: '预期完成时间',
    width: 140,
    sortable: true
  },
  {
    prop: 'closedAt',
    label: '关闭时间',
    width: 120,
    sortable: true
  }
]

// 表格数据
const tableData = ref<Internship[]>([])
const loading = ref(false)

// 格式化后的表格数据
const formattedTableData = computed(() => {
  return tableData.value.map(item => ({
    ...item,
    createdAt: formatDate(item.createdAt),
    expectedCompletionTime: formatDate(item.expectedCompletionTime),
    closedAt: formatDate(item.closedAt),
    systemCreatedAt: formatDate(item.systemCreatedAt),
    systemUpdatedAt: formatDate(item.systemUpdatedAt)
  }))
})

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 获取实习列表
const fetchInternships = async () => {
  loading.value = true
  try {
    const response = await getInternships(currentPage.value, pageSize.value)
    tableData.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Failed to fetch internships:', error)
    ElMessage.error('获取实习列表失败')
  } finally {
    loading.value = false
  }
}

// 分页事件处理
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
  fetchInternships()
}

const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
  fetchInternships()
}

// 表格事件处理
const handleFilterChange = (filters: any) => {
  console.log('Filter changed:', filters)
  // TODO: 实现筛选逻辑
}

const handleSearchChange = (searchText: string) => {
  console.log('Search changed:', searchText)
  // TODO: 实现搜索逻辑
}

const handleSortChange = (sort: any) => {
  console.log('Sort changed:', sort)
  // TODO: 实现排序逻辑
}

// 组件挂载时获取数据
onMounted(() => {
  fetchInternships()
})
</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
  border-bottom: none;
}
.internship-management {
  padding: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.table-card {
  border-radius: 8px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.project-link {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
