<template>
  <aside class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      router
    >
      <el-menu-item index="/activity-management">
        <span>活动管理</span>
      </el-menu-item>
      <el-menu-item index="/developer-management">
        <span>开发者管理</span>
      </el-menu-item>
      <el-menu-item index="/content-management">
        <span>内容传播管理</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = ref('/activity-management')

// Watch route changes to update active menu
watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  },
  { immediate: true }
)
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #ffffff;
  height: 100%;
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}
</style>
