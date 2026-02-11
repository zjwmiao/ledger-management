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
        :data="tableData"
        @filter-change="handleFilterChange"
        @search-change="handleSearchChange"
        @sort-change="handleSortChange"
      >
        <!-- Activity Name Column with RouterLink -->
        <template #activityName="{ row }">
          <router-link
            :to="{ path: '/activity-detail', query: { name: row.activityName } }"
            class="activity-link"
          >
            {{ row.activityName }}
          </router-link>
        </template>
      </CommonTable>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonTable from '@/components/CommonTable.vue'

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

const tableData = ref([
  {
    community: 'openEuler',
    activityName: 'openEuler Summit 2024',
    time: '2024-03-15',
    location: '北京',
    participants: 500
  },
  {
    community: 'MindSpore',
    activityName: 'AI开发者大会',
    time: '2024-04-20',
    location: '上海',
    participants: 300
  },
  {
    community: 'openGauss',
    activityName: '数据库技术交流会',
    time: '2024-05-10',
    location: '深圳',
    participants: 200
  },
  {
    community: 'openEuler',
    activityName: '开源操作系统研讨会',
    time: '2024-06-05',
    location: '杭州',
    participants: 150
  },
  {
    community: 'MindSpore',
    activityName: '机器学习实战工作坊',
    time: '2024-07-12',
    location: '广州',
    participants: 250
  }
])

const handleDownloadTemplate = () => {
  console.log('下载模板')
  // TODO: 实现下载模板功能
}

const handleImport = () => {
  console.log('导入')
  // TODO: 实现导入功能
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
</style>
