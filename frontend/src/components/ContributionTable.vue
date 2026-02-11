<template>
  <div class="contribution-section">
    <div class="section-title" v-if="title">{{ title }}</div>

    <div class="contribution-table" :class="{ 'layout-horizontal': layout === 'horizontal' }">
      <template v-if="layout === 'horizontal'">
        <!-- Horizontal Layout: Split into two columns -->
        <div class="contribution-column contribution-column-left">
          <div
            class="contribution-row"
            v-for="(item, index) in leftItems"
            :key="index"
            :class="{ 'is-last': index === leftItems.length - 1 }"
          >
            <span class="contribution-label">{{ item.label }}</span>
            <div class="divider-vertical"></div>
            <span class="contribution-value">{{ item.value }}</span>
          </div>
        </div>

        <div class="divider-middle"></div>

        <div class="contribution-column contribution-column-right" :class="{ 'equal-columns': hasEqualColumns }">
          <div
            class="contribution-row"
            v-for="(item, index) in rightItems"
            :key="index"
            :class="{ 'is-last': index === rightItems.length - 1 }"
          >
            <span class="contribution-label">{{ item.label }}</span>
            <div class="divider-vertical"></div>
            <span class="contribution-value">{{ item.value }}</span>
          </div>
        </div>
      </template>

      <template v-else>
        <!-- Vertical Layout: Single column -->
        <div class="contribution-column full-width">
          <div
            class="contribution-row"
            v-for="(item, index) in items"
            :key="index"
          >
            <span class="contribution-label">{{ item.label }}</span>
            <div class="divider-vertical"></div>
            <span class="contribution-value">{{ item.value }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ContributionItem {
  label: string
  value: number | string
}

interface Props {
  title?: string
  items: ContributionItem[]
  layout?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal'
})

// Split items into left and right for horizontal layout
const leftItems = computed(() => {
  if (props.layout !== 'horizontal') return []
  const mid = Math.ceil(props.items.length / 2)
  return props.items.slice(0, mid)
})

const rightItems = computed(() => {
  if (props.layout !== 'horizontal') return []
  const mid = Math.ceil(props.items.length / 2)
  return props.items.slice(mid)
})

// Check if left and right columns have same number of rows
const hasEqualColumns = computed(() => {
  return leftItems.value.length === rightItems.value.length
})
</script>

<style scoped>
.contribution-section {
  margin-top: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: #303133;
  margin-bottom: 16px;
}

.contribution-table {
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.contribution-table.layout-horizontal {
  display: flex;
}

.contribution-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.contribution-column.full-width {
  width: 100%;
}

.contribution-row {
  display: flex;
  align-items: center;
  height: 42px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* Vertical layout: remove border from last row */
.contribution-column.full-width .contribution-row:last-child {
  border-bottom: none;
}

/* Horizontal layout: always remove border from left column's last row */
.layout-horizontal .contribution-column-left .contribution-row:last-child {
  border-bottom: none;
}

/* Horizontal layout: remove border from right column's last row only when columns are equal */
.layout-horizontal .contribution-column-right.equal-columns .contribution-row:last-child {
  border-bottom: none;
}

.contribution-label {
  font-size: 16px;
  line-height: 24px;
  color: #303133;
  font-weight: 400;
  min-width: 160px;
}

.divider-vertical {
  width: 1px;
  height: 42px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 24px;
}

.contribution-value {
  flex: 1;
  font-size: 16px;
  line-height: 24px;
  color: #303133;
  font-weight: 400;
}

.divider-middle {
  width: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 0 -1px;
}
</style>
