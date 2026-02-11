<template>
  <div class="main-layout">
    <Header />
    <div class="layout-container">
      <Sidebar />
      <main class="main-content">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.main-layout {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main-content {
  flex: 1;
  background-color: rgb(245, 246, 248);
  overflow-y: auto;
  padding: 24px 40px;
}
</style>
