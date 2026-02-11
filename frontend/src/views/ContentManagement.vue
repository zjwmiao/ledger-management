<template>
  <div>
    <h1 class="page-title">内容传播管理</h1>

    <div class="action-buttons">
      <el-button type="primary" @click="handleDownloadTemplate">下载模板</el-button>
      <el-button type="primary" @click="handleImport">导入</el-button>
    </div>

    <el-card>
      <!-- 统计数据卡片 -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">总阅读数</p>
            <div class="stat-value-wrapper">
              <p class="stat-value">{{ stats.totalReads }}</p>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">总收藏数</p>
            <div class="stat-value-wrapper">
              <p class="stat-value">{{ stats.totalCollections }}</p>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">总评论数</p>
            <div class="stat-value-wrapper">
              <p class="stat-value">{{ stats.totalComments }}</p>
            </div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <p class="stat-label">总转发数</p>
            <div class="stat-value-wrapper">
              <p class="stat-value">{{ stats.totalShares }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 数据分析图表 -->
      <div class="charts-container">
        <!-- 内容类型饼图 -->
        <div class="chart-card">
          <div class="card-header">
            <span class="chart-title">内容类型</span>
          </div>
          <div ref="contentTypeChartRef" class="chart"></div>
        </div>
  
        <!-- 素材类型饼图 -->
        <div class="chart-card">
          <div class="card-header">
            <span class="chart-title">素材类型</span>
          </div>
          <div ref="materialTypeChartRef" class="chart"></div>
        </div>
  
        <!-- 发布类型饼图 -->
        <div class="chart-card">
          <div class="card-header">
            <span class="chart-title">发布类型</span>
          </div>
          <div ref="publishTypeChartRef" class="chart"></div>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 16px;">
      <div class="table-header">
        <h3 class="table-title">开发者列表</h3>
        <div class="table-header-right">
          <el-input
            v-model="tableSearchText"
            placeholder="输入内容标题搜索"
            class="search-input"
            clearable
          />
          <el-popover trigger="click">
            <template #reference>
              <div class="table-config-btn">
                <el-icon><Setting /></el-icon>
              </div>
            </template>
            <div>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll">全部</el-checkbox>
              <div style="height: 1px; background-color: rgba(0, 0, 0, 0.1);"></div>
              <el-checkbox value="community" label="社区" :disabled="true" :model-value="true" />
              <el-checkbox-group v-model="checked">
                <el-checkbox v-for="item in tableColumnsRaw.slice(1)" :key="item.prop" :value="item.prop" :label="item.label" />
              </el-checkbox-group>
            </div>
          </el-popover>
        </div>
      </div>
      <CommonTable
        :columns="displayColumns"
        :data="tableData"
        @filter-change="handleFilterChange"
        @search-change="handleSearchChange"
        @sort-change="handleSortChange"
      />
      <div class="table-pagination">
        <span class="page-info">共 {{ tableData.length }} 条项目</span>
        <el-pagination
          v-model:current-page="tableCurrentPage"
          :page-size="tablePageSize"
          :total="tableData.length"
          layout="prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 上传对话框 -->
    <UploadDialog
      v-model="uploadDialogVisible"
      @success="handleUploadSuccess"
      @error="handleUploadError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import CommonTable from '@/components/CommonTable.vue'
import UploadDialog from '@/components/UploadDialog.vue'
import { Setting } from '@element-plus/icons-vue'
import useCheckbox from '@/composables/useCheckbox'
import { ElMessage } from 'element-plus'

interface Stats {
  totalReads: number
  totalCollections: number
  totalComments: number
  totalShares: number
}

const stats = ref<Stats>({
  totalReads: 56423,
  totalCollections: 56423,
  totalComments: 56423,
  totalShares: 56423
})

// 上传对话框
const uploadDialogVisible = ref(false)

// 图表引用
const contentTypeChartRef = ref<HTMLDivElement>()
const materialTypeChartRef = ref<HTMLDivElement>()
const publishTypeChartRef = ref<HTMLDivElement>()

// 图表实例
let contentTypeChart: echarts.ECharts | null = null
let materialTypeChart: echarts.ECharts | null = null
let publishTypeChart: echarts.ECharts | null = null

const defaultTextStyle = {
  rich: {
    name: {
      fontSize: 12,
      color: '#777',
      width: 60
    },
    percent: {
      fontSize: 12,
      color: '#191919',
      fontWeight: 'bold',
      width: 50,
      align: 'right'
    },
    divider: {
      fontSize: 12,
      color: '#191919',
      padding: [0, 4]
    },
    value: {
      fontSize: 12,
      color: '#191919',
      fontWeight: 'bold',
      width: 30,
      align: 'right'
    }
  }
}

// 初始化内容类型图表
const initContentTypeChart = () => {
  if (!contentTypeChartRef.value) return

  contentTypeChart = echarts.init(contentTypeChartRef.value)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      icon: 'circle',
      formatter: (name: string) => {
        const data = [
          { name: '版本宣发', value: 65, percent: '24.34%' },
          { name: '活动宣发', value: 35, percent: '13.11%' },
          { name: '技术解读', value: 91, percent: '34.08%' },
          { name: '学习教程', value: 76, percent: '28.46%' }
        ]
        const item = data.find(d => d.name === name)
        return item ? `{name|${name}} {percent|${item.percent}} {divider|│} {value|${item.value}}` : name
      },
      textStyle: defaultTextStyle as any
    },
    series: [
      {
        name: '内容类型',
        type: 'pie',
        radius: ['55%', '70%'],
        center: ['25%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return '{total|267}\n{label|内容类型}'
          },
          rich: {
            total: {
              fontSize: 32,
              color: '#191919',
              lineHeight: 38
            },
            label: {
              fontSize: 12,
              color: '#777',
              lineHeight: 14
            }
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 65, name: '版本宣发', itemStyle: { color: '#2070F3' } },
          { value: 35, name: '活动宣发', itemStyle: { color: '#62B42E' } },
          { value: 91, name: '技术解读', itemStyle: { color: '#715AFB' } },
          { value: 76, name: '学习教程', itemStyle: { color: '#2CB8C9' } }
        ]
      }
    ]
  }

  contentTypeChart.setOption(option)
}

// 初始化素材类型图表
const initMaterialTypeChart = () => {
  if (!materialTypeChartRef.value) return

  materialTypeChart = echarts.init(materialTypeChartRef.value)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      icon: 'circle',
      formatter: (name: string) => {
        const data = [
          { name: '视频', value: 65, percent: '34.03%' },
          { name: '海报', value: 35, percent: '18.32%' },
          { name: '图例3', value: 91, percent: '47.64%' }
        ]
        const item = data.find(d => d.name === name)
        return item ? `{name|${name}} {percent|${item.percent}} {divider|│} {value|${item.value}}` : name
      },
      textStyle: defaultTextStyle as any
    },
    series: [
      {
        name: '素材类型',
        type: 'pie',
        radius: ['55%', '70%'],
        center: ['25%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return '{total|191}\n{label|素材类型}'
          },
          rich: {
            total: {
              fontSize: 32,
              color: '#191919',
              lineHeight: 38
            },
            label: {
              fontSize: 12,
              color: '#777',
              lineHeight: 14
            }
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 65, name: '视频', itemStyle: { color: '#2070F3' } },
          { value: 35, name: '海报', itemStyle: { color: '#62B42E' } },
          { value: 91, name: '图例3', itemStyle: { color: '#715AFB' } }
        ]
      }
    ]
  }

  materialTypeChart.setOption(option)
}

// 初始化发布类型图表
const initPublishTypeChart = () => {
  if (!publishTypeChartRef.value) return

  publishTypeChart = echarts.init(publishTypeChartRef.value)

  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      icon: 'circle',
      formatter: (name: string) => {
        const data = [
          { name: '平台首发', value: 65, percent: '65%' },
          { name: '转发', value: 35, percent: '35%' }
        ]
        const item = data.find(d => d.name === name)
        return item ? `{name|${name}} {percent|${item.percent}} {divider|│} {value|${item.value}}` : name
      },
      textStyle: defaultTextStyle as any
    },
    series: [
      {
        name: '发布类型',
        type: 'pie',
        radius: ['55%', '70%'],
        center: ['25%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return '{total|100}\n{label|发布类型}'
          },
          rich: {
            total: {
              fontSize: 32,
              color: '#191919',
              lineHeight: 38
            },
            label: {
              fontSize: 12,
              color: '#777',
              lineHeight: 14
            }
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 65, name: '平台首发', itemStyle: { color: '#2070F3' } },
          { value: 35, name: '转发', itemStyle: { color: '#62B42E' } }
        ]
      }
    ]
  }

  publishTypeChart.setOption(option)
}

// 窗口大小改变时重新调整图表大小
const handleResize = () => {
  contentTypeChart?.resize()
  materialTypeChart?.resize()
  publishTypeChart?.resize()
}

onMounted(() => {
  initContentTypeChart()
  initMaterialTypeChart()
  initPublishTypeChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  contentTypeChart?.dispose()
  materialTypeChart?.dispose()
  publishTypeChart?.dispose()
  window.removeEventListener('resize', handleResize)
})

const handleDownloadTemplate = () => {
  // TODO: 实现下载模板功能
  ElMessage.info('下载模板功能开发中...')
}

const handleImport = () => {
  uploadDialogVisible.value = true
}

const handleUploadSuccess = (file: File) => {
  ElMessage.success(`文件 ${file.name} 上传成功`)
  // TODO: 处理上传成功后的逻辑，例如刷新表格数据
}

const handleUploadError = (error: string) => {
  ElMessage.error(error)
}

const tableSearchText = ref('')

const tableColumnsRaw = [
  { label: '社区', prop: 'community' },
  { label: '内容标题', prop: 'title' },
  { label: '关联活动', prop: 'activity' },
  { label: '发布平台', prop: 'platform', sortable: true },
  { label: '作者', prop: 'author' },
  { label: '发布时间', prop: 'publishTime', sortable: true },
  { label: '内容类型', prop: 'contentType' },
  { label: '素材类型', prop: 'materialType' },
  { label: '发布类型', prop: 'publishType' },
  { label: '发布人', prop: 'publisher' },
  { label: '阅读数', prop: 'readCount' },
  { label: '收藏数', prop: 'favoriteCount' },
  { label: '评论数', prop: 'commentCount' },
  { label: '转发数', prop: 'forwardCount' },
  { label: '完播率', prop: 'completionRate' },
]

const tablePageSize = ref(10)
const tableCurrentPage = ref(1)

const { checkAll, checked, isIndeterminate } = useCheckbox(tableColumnsRaw.slice(1).map(col => ({ label: col.label, value: col.prop })));
checkAll.value = true

const displayColumns = computed(() => {
  return tableColumnsRaw.filter(col => col.prop === 'community' || checked.value.includes(col.prop))
})

const tableData = ref([
  {
    community: '社区A',
    title: '内容标题1',
    activity: '活动1',
    platform: '平台1',
    author: '作者1',
    publishTime: '2023-01-01',
    contentType: '图文',
    materialType: '图片',
    publishType: '平台首发',
    publisher: '发布人1',
    readCount: 100,
    favoriteCount: 50,
    commentCount: 20,
    forwardCount: 10,
    completionRate: '85%'
  },
  {
    community: '社区B',
    title: '内容标题2',
    activity: '活动2',
    platform: '平台2',
    author: '作者2',
    publishTime: '2023-01-02',
    contentType: '视频',
    materialType: '视频',
    publishType: '转发',
    publisher: '发布人2',
    readCount: 200,
    favoriteCount: 100,
    commentCount: 40,
    forwardCount: 30,
    completionRate: '95%'
  }
])

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

</script>

<style scoped>
.page-title {
  margin-bottom: 24px;
}

.stats-container {
  display: flex;
  flex-direction: row;
  gap: 160px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.stat-card {
  width: 117px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  letter-spacing: 0;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.6);
  margin: 0;
}

.stat-value-wrapper {
  width: 71px;
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  text-align: left;
  letter-spacing: 0;
  line-height: 32px;
  color: rgba(0, 0, 0, 1);
  white-space: pre;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.charts-container {
  display: flex;
  flex-direction: row;
  gap: 32px;
  margin-bottom: 24px;
}

.chart-card {
  flex: 1;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: center;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: rgba(0, 0, 0, 0.85);
}

.chart {
  width: 100%;
  height: 240px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.table-config-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  cursor: pointer;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.table-search-config {
  display: flex;
  gap: 24px;
}

.search-input {
  width: 200px;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 16px;
  padding: 12px 0;
}

.page-info {
  font-size: 14px;
  color: #666;
}
</style>