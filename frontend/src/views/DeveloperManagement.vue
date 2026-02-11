<template>
  <div class="developer-management">
    <!-- Community Dropdown -->
    <div class="community-selector">
      <el-dropdown @command="handleCommunityChange">
        <span class="dropdown-title">
          {{ selectedCommunity }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="全部社区">全部社区</el-dropdown-item>
            <el-dropdown-item command="openEuler">openEuler</el-dropdown-item>
            <el-dropdown-item command="openGauss">openGauss</el-dropdown-item>
            <el-dropdown-item command="MindSpore">MindSpore</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- Main Card Container -->
    <el-card class="content-card" shadow="never">
      <!-- Form Section - Vertical Layout -->
      <div class="form-section">
        <el-form :model="formData" label-width="80px" class="filter-form">
          <el-form-item label="度量指标">
            <el-radio-group v-model="formData.metric">
              <el-radio :border="true" label="D0">D0</el-radio>
              <el-radio :border="true" label="D1">D1</el-radio>
              <el-radio :border="true" label="D2">D2</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="度量维度">
            <el-radio-group v-model="formData.dimension">
              <el-radio :border="true" label="增量">增量</el-radio>
              <el-radio :border="true" label="总量">总量</el-radio>
              <el-radio :border="true" label="当期活跃">当期活跃</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="时间间隔">
            <el-radio-group v-model="formData.timeInterval">
              <el-radio :border="true" label="天">天</el-radio>
              <el-radio :border="true" label="周">周</el-radio>
              <el-radio :border="true" label="月">月</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <!-- Two Charts Side by Side -->
      <div class="charts-row">
        <div>
          <h3 class="chart-title">贡献人数</h3>
          <BaseChart :option="leftChartOption" height="300px" />
        </div>
        <div>
          <h3 class="chart-title">活跃人数</h3>
          <BaseChart :option="rightChartOption" height="300px" />
        </div>
      </div>

      <!-- Multi-Series Chart -->
      <div class="full-chart">
        <h3 class="chart-title">贡献度/Issue/Comment数据</h3>
        <BaseChart :option="multiSeriesChartOption" height="300px" />
      </div>

      <!-- Developers List Table -->
      <div class="table-section">
        <div class="table-header">
          <h3 class="table-title">开发者列表</h3>
          <el-input
            v-model="developerSearchText"
            placeholder="请输入姓名"
            class="search-input"
            clearable
          />
        </div>
        <CommonTable
          :columns="developerTableColumns"
          :data="filteredDeveloperData"
          @filter-change="handleFilterChange"
          @search-change="handleSearchChange"
          @sort-change="handleSortChange"
        />
        <div class="table-pagination">
          <span class="page-info">共 {{ developerTableData.length }} 条项目</span>
          <el-pagination
            v-model:current-page="developerCurrentPage"
            :page-size="10"
            :total="developerTableData.length"
            layout="prev, pager, next, jumper"
          />
        </div>
      </div>

      <!-- Developer Metrics Table -->
      <div class="table-section">
        <div class="table-header">
          <h3 class="table-title">开发者多维度数据</h3>
          <el-input
            v-model="metricsSearchText"
            placeholder="请输入姓名"
            class="search-input"
            clearable
          />
        </div>
        <CommonTable
          :columns="metricsTableColumns"
          :data="filteredMetricsData"
          @filter-change="handleFilterChange"
          @search-change="handleSearchChange"
          @sort-change="handleSortChange"
        />
        <div class="table-pagination">
          <span class="page-info">共 {{ metricsTableData.length }} 条项目</span>
          <el-pagination
            v-model:current-page="metricsCurrentPage"
            :page-size="10"
            :total="metricsTableData.length"
            layout="prev, pager, next, jumper"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import BaseChart from '@/components/BaseChart.vue'
import CommonTable from '@/components/CommonTable.vue'
import type { EChartsOption } from 'echarts'

// Community selection
const selectedCommunity = ref('全部社区')

const handleCommunityChange = (command: string) => {
  selectedCommunity.value = command
  console.log('Selected community:', command)
  // TODO: Update charts based on selected community
}

// Form data
const formData = ref({
  metric: 'D0',
  dimension: '增量',
  timeInterval: '月'
})

// Search text
const developerSearchText = ref('')
const metricsSearchText = ref('')

// Pagination
const developerCurrentPage = ref(1)
const metricsCurrentPage = ref(1)

// Developer table columns
const developerTableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'github', label: 'GitHub ID' },
  { prop: 'gitcode', label: 'GitCode ID' },
  { prop: 'gitee', label: 'Gitee ID' },
  { prop: 'status', label: '状态' }
]

// Developer table data
const developerTableData = ref([
  { name: 'Zhang San', github: 'zhangsan', gitcode: 'zhangsan_gc', gitee: 'zhangsan_gt', status: '活跃' },
  { name: 'Li Si', github: 'lisi', gitcode: 'lisi_gc', gitee: 'lisi_gt', status: '活跃' },
  { name: 'Wang Wu', github: 'wangwu', gitcode: 'wangwu_gc', gitee: 'wangwu_gt', status: '非活跃' },
  { name: 'Zhao Liu', github: 'zhaoliu', gitcode: 'zhaoliu_gc', gitee: 'zhaoliu_gt', status: '活跃' },
  { name: 'Chen Qi', github: 'chenqi', gitcode: 'chenqi_gc', gitee: 'chenqi_gt', status: '活跃' }
])

// Filtered developer data
const filteredDeveloperData = computed(() => {
  if (!developerSearchText.value) {
    return developerTableData.value
  }
  return developerTableData.value.filter(item =>
    item.name.toLowerCase().includes(developerSearchText.value.toLowerCase())
  )
})

// Metrics table columns
const metricsTableColumns = [
  { prop: 'name', label: '姓名' },
  { prop: 'email', label: '邮箱' },
  { prop: 'commits', label: '提交数' },
  { prop: 'prs', label: 'PR 数' },
  { prop: 'issues', label: 'Issue 数' },
  { prop: 'reviews', label: '评论数' },
  { prop: 'score', label: '综合评分' },
  { prop: 'level', label: '等级' }
]

// Metrics table data
const metricsTableData = ref([
  {
    name: 'Zhang San',
    email: 'zhangsan@example.com',
    commits: 235,
    prs: 314,
    issues: 391,
    reviews: 350,
    score: 85,
    level: 'D0'
  },
  {
    name: 'Li Si',
    email: 'lisi@example.com',
    commits: 180,
    prs: 250,
    issues: 320,
    reviews: 280,
    score: 72,
    level: 'D1'
  },
  {
    name: 'Wang Wu',
    email: 'wangwu@example.com',
    commits: 120,
    prs: 180,
    issues: 210,
    reviews: 190,
    score: 58,
    level: 'D2'
  }
])

// Filtered metrics data
const filteredMetricsData = computed(() => {
  if (!metricsSearchText.value) {
    return metricsTableData.value
  }
  return metricsTableData.value.filter(item =>
    item.name.toLowerCase().includes(metricsSearchText.value.toLowerCase())
  )
})

// Table event handlers
const handleFilterChange = (prop: string, values: string[]) => {
  console.log('Filter change:', prop, values)
  // TODO: Implement filter logic
}

const handleSearchChange = (prop: string, value: string) => {
  console.log('Search change:', prop, value)
  // TODO: Implement search logic
}

const handleSortChange = (prop: string, order: string | null) => {
  console.log('Sort change:', prop, order)
  // TODO: Implement sort logic
}

// Left Chart Option - 贡献人数
const leftChartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    top: '10%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '贡献人数',
      type: 'bar',
      data: [380, 420, 780, 600, 680, 420, 530, 360, 420, 530, 612, 450],
      itemStyle: {
        color: '#5470c6'
      }
    }
  ]
}))

// Right Chart Option - 活跃人数
const rightChartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    top: '10%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '活跃人数',
      type: 'bar',
      data: [520, 450, 360, 280, 410, 330, 280, 350, 280, 220, 280, 320],
      itemStyle: {
        color: '#fac858'
      }
    }
  ]
}))

// Multi-Series Chart Option
const multiSeriesChartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['commit', 'issue', 'comment'],
    top: '0%'
  },
  grid: {
    left: '3%',
    top: '12%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'commit',
      type: 'bar',
      data: [320, 332, 301, 334, 390, 330, 320, 332, 301, 334, 390, 330],
      itemStyle: {
        color: '#5470c6'
      }
    },
    {
      name: 'issue',
      type: 'bar',
      data: [220, 182, 191, 234, 290, 230, 220, 182, 191, 234, 290, 230],
      itemStyle: {
        color: '#91cc75'
      }
    },
    {
      name: 'comment',
      type: 'bar',
      data: [150, 232, 201, 154, 190, 330, 150, 232, 201, 154, 190, 330],
      itemStyle: {
        color: '#fac858'
      }
    }
  ]
}))
</script>

<style scoped>
.el-radio {
  margin-right: 8px;
}

:deep(.el-radio__input) {
  display: none;
}

.developer-management {
  width: 100%;
}

.community-selector {
  margin-bottom: 20px;
}

.dropdown-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dropdown-title:hover {
  color: #409eff;
}

.content-card {
  background-color: #ffffff;
  border: none;
}

.content-card :deep(.el-card__body) {
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e4e7ed;
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.full-chart {
  margin-bottom: 32px;
}

.table-section {
  margin-top: 32px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.search-input {
  width: 200px;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 12px 0;
}

.page-info {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .charts-row {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-input {
    width: 100%;
  }
}
</style>
