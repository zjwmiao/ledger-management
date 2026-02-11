<template>
  <div class="common-table-wrapper">
    <el-table
      :data="data"
      class="common-table"
      @sort-change="handleSortChange"
    >
      <!-- Expandable row column -->
      <el-table-column v-if="expandable" type="expand">
        <template #default="scope">
          <slot name="expand" :row="scope.row" :$index="scope.$index"></slot>
        </template>
      </el-table-column>

      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :sortable="column.sortable ? 'custom' : false"
      >
        <template v-if="column.filterable || column.searchable" #header>
          <div class="table-header">
            <span>{{ column.label }}</span>
            <div class="header-actions">
              <!-- Filter Icon -->
              <el-popover
                v-if="column.filterable"
                placement="bottom"
                trigger="click"
              >
                <template #reference>
                  <el-icon
                    class="header-icon"
                    @click="toggleFilter(column.prop)"
                  >
                    <Filter />
                  </el-icon>
                </template>
                <div class="filter-content">
                  <el-checkbox
                    v-if="filterCheckboxStates[column.prop]"
                    v-model="filterCheckboxStates[column.prop]!.checkAll.value"
                    :indeterminate="filterCheckboxStates[column.prop]!.isIndeterminate.value"
                    @change="handleFilterChange(column.prop)"
                  >
                    全选
                  </el-checkbox>
                  <el-checkbox-group
                    v-if="filterCheckboxStates[column.prop]"
                    v-model="filterCheckboxStates[column.prop]!.checked.value"
                    @change="handleFilterChange(column.prop)"
                  >
                    <el-checkbox
                      v-for="option in column.filterOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                    />
                  </el-checkbox-group>
                </div>
              </el-popover>

              <!-- Search Icon -->
              <el-popover
                v-if="column.searchable"
                :visible="searchVisibleMap[column.prop]"
                placement="bottom"
                :width="250"
                trigger="click"
              >
                <template #reference>
                  <el-icon
                    class="header-icon"
                    @click="toggleSearch(column.prop)"
                  >
                    <Search />
                  </el-icon>
                </template>
                <div class="search-content">
                  <el-input
                    v-model="searchValues[column.prop]"
                    :placeholder="`搜索${column.label}`"
                    clearable
                    @keyup.enter="confirmSearch(column.prop)"
                  />
                  <div class="search-actions">
                    <el-button
                      size="small"
                      @click="resetSearch(column.prop)"
                    >
                      重置
                    </el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="confirmSearch(column.prop)"
                    >
                      搜索
                    </el-button>
                  </div>
                </div>
              </el-popover>
            </div>
          </div>
        </template>

        <!-- Default slot for custom cell rendering -->
        <template #default="scope">
          <slot
            :name="column.prop"
            :row="scope.row"
            :column="column"
            :$index="scope.$index"
          >
            {{ scope.row[column.prop] }}
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, shallowRef } from 'vue'
import { Filter, Search } from '@element-plus/icons-vue'
import useCheckbox from '@/composables/useCheckbox'

interface FilterOption {
  label: string | number
  value: string
}

interface ColumnConfig {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean
  filterable?: boolean
  filterOptions?: FilterOption[]
  searchable?: boolean
}

interface Props {
  columns: ColumnConfig[]
  data: any[]
  expandable?: boolean
}

interface Emits {
  (e: 'filter-change', prop: string, values: string[]): void
  (e: 'search-change', prop: string, value: string): void
  (e: 'sort-change', prop: string, order: string | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Filter state
const filterVisibleMap = reactive<Record<string, boolean>>({})
const filterCheckboxStates = shallowRef<Record<string, ReturnType<typeof useCheckbox>>>({})

// Search state
const searchVisibleMap = reactive<Record<string, boolean>>({})
const searchValues = ref<Record<string, string>>({})

// Initialize filter and search values with watch
watch(
  () => props.columns,
  (columns) => {
    const newFilterStates: Record<string, ReturnType<typeof useCheckbox>> = {}
    const newSearchValues: Record<string, string> = {}

    columns.forEach((column) => {
      if (column.filterable) {
        filterVisibleMap[column.prop] = false
        // Initialize useCheckbox for each filterable column
        const options = column.filterOptions || []
        newFilterStates[column.prop] = useCheckbox(options)
      }
      if (column.searchable) {
        searchVisibleMap[column.prop] = false
        newSearchValues[column.prop] = ''
      }
    })

    filterCheckboxStates.value = newFilterStates
    searchValues.value = newSearchValues
  },
  { immediate: true }
)

// Filter methods
const toggleFilter = (prop: string) => {
  filterVisibleMap[prop] = !filterVisibleMap[prop]
}

const handleFilterChange = (prop: string) => {
  const checkboxState = filterCheckboxStates.value[prop]
  if (checkboxState) {
    emit('filter-change', prop, checkboxState.checked.value)
  }
}

// Search methods
const toggleSearch = (prop: string) => {
  searchVisibleMap[prop] = !searchVisibleMap[prop]
}

const confirmSearch = (prop: string) => {
  searchVisibleMap[prop] = false
  emit('search-change', prop, searchValues.value[prop]!)
}

const resetSearch = (prop: string) => {
  searchValues.value[prop] = ''
  searchVisibleMap[prop] = false
  emit('search-change', prop, '')
}

// Sort method
const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  emit('sort-change', prop, order)
}
</script>

<style scoped>
.common-table-wrapper {
  border-radius: 4px;
  overflow: hidden;
}

.common-table {
  width: 100%;
  border-radius: 4px;
}

.common-table :deep(.el-table__header-wrapper) {
  background-color: rgb(235, 241, 250);
}

.common-table :deep(.el-table__header th) {
  background-color: rgb(235, 241, 250);
  color: #000;
  font-weight: 600;
}

/* .common-table :deep(.el-table__header th .cell) {
  padding: 0;
} */

.table-header {
  display: flex;
  align-items: center;
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.header-icon {
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: color 0.3s;
}

.header-icon:hover {
  color: rgb(0, 47, 167);
}

.filter-content :deep(.el-checkbox-group) {
  display: flex;
  flex-direction: column;
}

.filter-actions,
.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.search-content .el-input {
  margin-bottom: 12px;
}
</style>
