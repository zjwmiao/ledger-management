<template>
  <div class="activity-management">
    <h1 class="page-title">活动管理</h1>

    <div class="action-buttons">
      <el-button type="primary" @click="handleDownloadTemplate">下载模板</el-button>
      <el-button type="primary" @click="handleImport">导入</el-button>
    </div>

    <el-card class="table-card" shadow="never">
      <CommonTable
        :columns="tableColumns"
        :data="paginatedData"
        @filter-change="handleFilterChange"
        @search-change="handleSearchChange"
        @sort-change="handleSortChange"
      >
        <!-- Activity Name Column with RouterLink -->
        <template #activityName="{ row }">
          <router-link
            :to="{ path: '/activity-detail', query: { id: row.id } }"
            class="activity-link"
          >
            {{ row.activityName }}
          </router-link>
        </template>
      </CommonTable>

      <!-- 分页器 -->
      <div class="pagination-container">
        <span class="page-info">共 {{ totalItems }} 条活动</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalItems"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 上传对话框 -->
    <UploadDialog v-model="uploadDialogVisible" upload-url="/activities/import" @success="fetchActivities" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import CommonTable from '@/components/CommonTable.vue'
import UploadDialog from '@/components/UploadDialog.vue'
import { ElMessage } from 'element-plus'
import { getActivities, type Activity } from '@/api/activity'

// 表格列配置
const tableColumns = [
  {
    prop: 'community',
    label: '社区',
    width: 150,
    filterable: true,
    filterOptions: [
      { label: 'openEuler', value: 'openEuler' },
      { label: 'MindSpore', value: 'MindSpore' },
      { label: 'openGauss', value: 'openGauss' }
    ]
  },
  {
    prop: 'activityName',
    label: '活动名称',
    minWidth: 200,
    searchable: true
  },
  {
    prop: 'time',
    label: '时间',
    width: 180,
    sortable: true
  },
  {
    prop: 'location',
    label: '地点',
    width: 150,
    searchable: true
  },
  {
    prop: 'participants',
    label: '参与人数',
    width: 120,
    sortable: true
  }
]

// 原始数据和表格数据
const allActivities = ref<Activity[]>([])
const tableData = ref<any[]>([])
const loading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = computed(() => tableData.value.length)

// 计算分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

// 上传对话框
const uploadDialogVisible = ref(false)

// 转换API数据为表格数据格式
const transformActivityData = (activities: Activity[]) => {
  return activities.map(activity => ({
    id: activity.id,
    community: activity.community,
    activityName: activity.name,
    time: formatDateRange(activity.startDate, activity.endDate),
    location: activity.location,
    participants: activity.maxParticipants,
    type: activity.type,
    status: activity.status,
    organizer: activity.organizer,
    description: activity.description
  }))
}

// 格式化日期范围
const formatDateRange = (startDate: string, endDate: string) => {
  if (!startDate) return ''
  if (startDate === endDate) {
    return startDate
  }
  return `${startDate} - ${endDate}`
}

// 获取活动列表
const fetchActivities = async () => {
  loading.value = true
  try {
    const data = await getActivities()
    allActivities.value = data
    tableData.value = transformActivityData(data)
    ElMessage.success('活动列表加载成功')
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    ElMessage.error('活动列表加载失败')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchActivities()
})

const handleDownloadTemplate = () => {
  const link = document.createElement('a')
  link.href = '/20260206_activity_data_import.xlsx'
  link.download = '20260206_activity_data_import.xlsx'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success('模板下载成功')
}

const handleImport = () => {
  uploadDialogVisible.value = true
}

const handleFilterChange = (prop: string, values: string[]) => {
  console.log('Filter change:', prop, values)
  // TODO: 实现筛选逻辑
}

const handleSearchChange = (prop: string, value: string) => {
  console.log('Search change:', prop, value)
  // TODO: 实现搜索逻辑
}

const handleSortChange = (prop: string, order: string | null) => {
  console.log('Sort change:', prop, order)
  // TODO: 实现排序逻辑
}

// 分页事件处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 改变每页条数时回到第一页
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

</script>

<style scoped>
.activity-management {
  width: 100%;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 20px 0;
}

.action-buttons {
  display: flex;
  margin-bottom: 20px;
}

.table-card {
  background-color: #ffffff;
  border: none;
}

.table-card :deep(.el-card__body) {
  padding: 20px;
}

.activity-link {
  color: rgb(0, 47, 167);
  text-decoration: none;
  transition: opacity 0.3s;
}

.activity-link:hover {
  opacity: 0.7;
  text-decoration: underline;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.page-info {
  font-size: 14px;
  color: #666;
}
</style>
